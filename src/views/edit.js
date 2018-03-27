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
		return html`
			<div>
				${form.hidden('url', state.entry.url)}
				${form.hidden('ctime', state.entry.ctime)}
				${title.render(state.entry.title)}
				${date.render(state.entry.date)}
				${text.render(state.entry.text)}
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
