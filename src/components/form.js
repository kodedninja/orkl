const html = require('choo/html')
const format = require('../components/format')

module.exports = {
	input: function(name, placeholder, value) {
		return html`
			<input type="text" id="${name}" name="${name}" placeholder="${placeholder ? placeholder : ''}" class="bn c100 mb1 f5 ffi" value="${value ? value : ''}">
		`
	},
	textarea: function(name, placeholder, value) {
		var ta = html`
			<textarea name="${name}" id="${name}" placeholder="${placeholder ? placeholder : ''}" class="ffi db c100 bn f5"></textarea>
		`
		ta.value = value || ''
		return ta
	},
	hidden: function(name, value) {
		return html`
			<input name="${name}" id="${name}" type="hidden" value="${value}">
		`
	}
}
