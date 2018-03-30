var html = require('choo/html')
var MarkdownIt = require('markdown-it')
var md = new MarkdownIt()

md.use(require('markdown-it-sup'))

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
