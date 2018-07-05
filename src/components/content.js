const Component = require('nanocomponent')
const html = require('choo/html')
const format = require('./format')
const MonoImage = require('monoimage')
const mediumZoom = require('medium-zoom')

module.exports = class Content extends Component {
	constructor() {
		super()
		this.text = ''
		this.entry = {}
	}

	formatimages() {
		var url = this.entry.url
		var element = this.element
	    var auto = [...element.querySelectorAll('.imgs-auto p')]
	      .forEach(function (container) {
	        unwrap(container)
	      })
	    var images = [...element.querySelectorAll('.imgs-auto img')]
	      .forEach(function (image) {
	        var parent = image.parentNode
	        var source = image.getAttribute('src')
	        var ratio = getRatio(source)

	        // skip if not ratio
	        if (!ratio) {
	          image.setAttribute('src', source)
	          if (image.parentNode.nodeName !== 'A') {
	            mediumZoom(image, {
	              background: 'rgba(0, 0, 0, 1)',
	              container: element
	            })
	          }
	          return
	        }

	        // add mono image
	        parent.insertBefore(new MonoImage().render({
	          sizes: { 100: source },
	          dimensions: { ratio: ratio },
	        }, {
	          onload: function (_img) {
	            if (_img.parentNode.nodeName === 'A') return
	            mediumZoom(_img, {
	              background: 'rgba(0, 0, 0, 1)',
	              container: element
	            })
	          }
	        }), image)
	        // remove old
	        parent.removeChild(image)
	      })

	}

	load(el) {
		this.formatimages()
	}

	afterupdate() {
		this.formatimages()
	}

	createElement(entry) {
		this.entry = entry
		this.text = format(this.entry.text)

		return html`
			<div class="db 1">
				${this.text}
			</div>
		`
	}

	update(entry) {
		return this.text !== entry.text
	}
}

function unwrap(wrapper) {
	var docFrag = document.createDocumentFragment()

  	while (wrapper.firstChild) {
    	var child = wrapper.removeChild(wrapper.firstChild)
    	if (child.nodeType === 1)  {
      		var container = document.createElement('div')
      		container.appendChild(child)
      		docFrag.appendChild(container)
    	}
  	}
  	wrapper.parentNode.replaceChild(docFrag, wrapper)
}

function getRatio(src) {
  try {
    return parseInt(src.split('_')[1].replace(/\.[^/.]+$/, ""))
  } catch (err) {
    return false
  }
}
