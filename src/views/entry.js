const html = require('choo/html')
const wrapper = require('../components/wrapper')
const format = require('../components/format')

module.exports = wrapper(view)

function view (state, emit) {
	state.entry = get_entry(state.params.entry)

	if (state.entry) {
		emit(state.events.DOMTITLECHANGE, state.entry.title + ' - ' + state.orkl.config.title)

		return html`
			<div>
				<a class="dib mb1">${state.entry.title}</a>
				<div class="db">
					<span class="mr1 tcgrey">${state.entry.date}</span>
					${modificators()}
				</div>
				<div class="db c100">
					${format(state.entry.text)}
				</div>
			</div>
		`

		function modificators() {
			if (state.orkl.dat.isOwner) return html`
				<div class="dib">
					<a href="/delete" class="mr1 tcred" onclick="${delete_entry}">delete</a>
				</div>
			`
			return null

			function delete_entry(e) {
				e.preventDefault()
				emit('delete', state.params.entry)
			}
		}
	}

	function get_entry(e) {
		for (var id in state.orkl.content) {
			if (state.orkl.content[id].url == e) return state.orkl.content[id]
		}
		return null
	}
}
