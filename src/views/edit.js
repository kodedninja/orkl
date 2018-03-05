const html = require('choo/html')
const format = require('../components/format')
const wrapper = require('../components/wrapper')
const form = require('../components/form')

module.exports = wrapper(view)

function view (state, emit) {
	state.entry = get_entry(state.params.entry)

	if (state.orkl.dat.isOwner && state.entry) {
		return html`
			<div>
				${form.hidden('url', state.entry.url)}
				${form.hidden('ctime', state.entry.ctime)}
				${form.input('title', 'title', state.entry.title)}
				${form.input('date', 'date', state.entry.date)}
				${form.textarea('text', 'text', state.entry.text)}
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
