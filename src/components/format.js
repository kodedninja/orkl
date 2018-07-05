var html = require('choo/html')
var MarkdownIt = require('markdown-it')
var implicitFigures = require('markdown-it-implicit-figures');
var md = new MarkdownIt({
	breaks: true,
	html: true
})

md.use(require('markdown-it-sup'))
md.use(implicitFigures, {
	figcaption: true
});

module.exports = format

function format (str) {
  	str = str || ''
  	return rawCreateElement(md.render(str))
}

function rawCreateElement (tag) {
    var el = html`<div></div>`
    el.innerHTML = tag
	return toArray(el.childNodes)
}

function toArray (arr) {
  	return Array.isArray(arr) ? arr : [].slice.call(arr)
}
