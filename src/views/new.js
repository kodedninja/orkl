const html = require('choo/html')
const format = require('../components/format')
const wrapper = require('../components/wrapper')
const form = require('../components/form')

module.exports = wrapper(view)

var today = new Date()
today = today.getFullYear() + '-' + format_number(today.getMonth() + 1)  + '-' + format_number(today.getDate())

const title = new form.input('title', 'title')
const date = new form.input('date', 'date', today)

const text = new form.textarea('text', 'text')

function view (state, emit) {

	if (state.orkl.dat.isOwner) {
		return html`
			<div>
				${title.render()}
				${date.render()}
				${text.render()}
			</div>
		`
	}
}

function format_number(a) {
	return ('0' + a).slice(-2)
}
