const html = require('choo/html')
const format = require('../components/format')

module.exports = {
	input: require('./input'),
	textarea: require('./textarea'),
	select: function(name, t, f, emit, state) {
		return html`
			<a href="#" onclick=${click} class="${!state.public ? 'tcgrey' : ''}">${state.public ? t : f}</a>
		`

		function click(e) {
			e.preventDefault()
			state.change = true
			emit('change-public', !state.public)
		}
	},
	hidden: function(name, value) {
		return html`
			<input name="${name}" id="${name}" type="hidden" value="${value}">
		`
	}
}
