const html = require('choo/html')
const format = require('../components/format')
const wrapper = require('../components/wrapper')
const form = require('../components/form')

module.exports = wrapper(view)

function view (state, emit) {
	var entry = get_entry(state.params.entry)

	if (entry) {
		return html`
			<div>
				${form.hidden('url', entry.url)}
				${form.hidden('ctime', entry.ctime)}
				${form.input('title', 'title', entry.title)}
				${form.input('date', 'date', entry.date)}
				${form.textarea('text', 'text', entry.text)}
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
