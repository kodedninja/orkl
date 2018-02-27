const html = require('choo/html')
const format = require('../components/format')
const wrapper = require('../components/wrapper')
const form = require('../components/form')

module.exports = wrapper(view)

function view (state, emit) {
	var today = new Date()
	today = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + today.getDate()
	if (state.orkl.dat.isOwner) {	
		return html`
			<div>
				${form.input('title', 'title')}
				${form.input('date', 'date', today)}
				${form.textarea('text', 'text')}
			</div>
		`
	}
}
