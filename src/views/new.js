const html = require('choo/html')
const format = require('../components/format')
const wrapper = require('../components/wrapper')
const form = require('../components/form')
const notfound = require('../components/notfound')

module.exports = wrapper(view)

var today = new Date()
today = today.getFullYear() + '-' + format_number(today.getMonth() + 1)  + '-' + format_number(today.getDate())

const title = new form.input('title', "what's your post title?", '', 'f1 my1')
const date = new form.input('date', 'date of publishing')

const text = new form.textarea('text', 'what do you want to share? start typing...')

const select = new form.select('public', 'published', 'draft')

function view (state, emit) {
	if (state.orkl.dat.isOwner) {
		state.orkl.current.ctime = null
		state.orkl.current.url = null
		state.orkl.current.public = false

		return html`
			<div class="1">
				<div class="1">
					<div class="1/2 dib">
						<span class="tcred f6">${state.date_required ? 'required' : ''}</span>
						${date.render(state, today)}
					</div>
					<div class="1/2 dib ">
						${select.render(state, emit)}
					</div>
					<span class="tcred f6">${state.title_required ? 'required' : ''}</span>
					${title.render(state, '', true)}
				</div>
				${text.render(state, emit, '')}
			</div>
		`
	}

	return notfound()
}

function format_number(a) {
	return ('0' + a).slice(-2)
}
