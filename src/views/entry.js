const html = require('choo/html')
const wrapper = require('../components/wrapper')
const format = require('../components/format')
const notfound = require('../components/notfound')

const Delete = require('../components/delete')
const delete_button = new Delete()

module.exports = wrapper(view)

function view (state, emit) {
	if (state.orkl.content.length > 0) {
		state.entry = get_entry(state.params.entry)

		if (state.entry == null) return notfound()

		emit(state.events.DOMTITLECHANGE, state.entry.title + ' - ' + state.orkl.config.title)

		return html`
			<div>
				<a class="dib mb1">${state.entry.title}</a>
				<div class="db">
					<span class="mr1 tcgrey">${state.entry.date}</span>
					${modificators()}
				</div>
				<div class="db 1">
					${format(state.entry.text)}
				</div>
			</div>
		`

		function modificators() {
			if (state.orkl.dat.isOwner) return html`
				<div class="dib">
					${delete_button.render(state, emit)}
				</div>
			`
			return null
		}
	}

	function get_entry(e) {
		for (var id in state.orkl.content) {
			if (state.orkl.content[id].url == e) return state.orkl.content[id]
		}
		return null
	}
}
