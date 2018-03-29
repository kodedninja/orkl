const html = require('choo/html')
const format = require('../components/format')
const wrapper = require('../components/wrapper')
const form = require('../components/form')

module.exports = wrapper(view)

const title = new form.input('title', 'title')
const date = new form.input('date', 'date')

const text = new form.textarea('text', 'text')

function view (state, emit) {
	state.entry = get_entry(state.params.entry)

	if (state.orkl.dat.isOwner && state.entry) {
		state.orkl.current.url = state.entry.url
		state.orkl.current.ctime = state.entry.ctime

		return html`
			<div>
				${title.render(state, state.entry.title)}
				${date.render(state, state.entry.date)}
				${text.render(state, state.entry.text, true)}
			</div>
		`
	}

	function get_entry(e) {
		for (var id in state.orkl.content) {
			if (state.orkl.content[id].url == e) return state.orkl.content[id]
		}
		return null
	}
}
