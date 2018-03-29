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

const select = new form.select('public', 'visible', 'not visible')

function view (state, emit) {
	if (state.orkl.dat.isOwner) {
		state.orkl.current.ctime = null
		state.orkl.current.url = null
		state.orkl.current.public = false
		state.orkl.current.text = ''

		return html`
			<div class="1">
				<div class="mb1 1">
					<span class="tcred f6">${state.title_required ? 'required' : ''}</span>
					${title.render(state)}
				</div>
				<div class="1/2 dib">
					${date.render(state)}
				</div>
				<div class="1/2 dib">
					${select.render(state, emit)}
				</div>
				<hr />
				${text.render(state)}
			</div>
		`
	}
}

function format_number(a) {
	return ('0' + a).slice(-2)
}
