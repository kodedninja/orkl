const html = require('choo/html')
const format = require('../components/format')

module.exports = {
	input: require('./input'),
	textarea: require('./textarea'),
	select: require('./select'),
	hidden: function(name, value) {
		return html`
			<input name="${name}" id="${name}" type="hidden" value="${value}">
		`
	}
}
