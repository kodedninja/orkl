const html = require('choo/html')
const format = require('../components/format')
const wrapper = require('../components/wrapper')
const form = require('../components/form')

module.exports = wrapper(view)

function view (state, emit) {
	var today = new Date()
	today = today.getFullYear() + '-' + format_number(today.getMonth() + 1)  + '-' + format_number(today.getDate())
	if (state.orkl.dat.isOwner) {
		return html`
			<div>
				${form.input('title', 'title')}
				${form.input('date', 'date', today)}
				${form.textarea('text', 'text')}
			</div>
		`
	}

	function format_number(a) {
		return ('0' + a).slice(-2)
	}
}
