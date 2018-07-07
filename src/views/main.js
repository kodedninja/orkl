const html = require('choo/html')
const wrapper = require('../components/wrapper')
const no_archive = require('./no_archive')
const format = require('../components/format')

module.exports = wrapper(view)

function view (state, emit) {
	if (state.orkl) {
		if (state.orkl.config.title) emit(state.events.DOMTITLECHANGE, state.orkl.config.title)

		return html`
			<div class="db 1">
				${entries()}
			</div>
		`
	} else {
		return html`
			${no_archive(state, emit)}
		`
	}

	function entries() {
		var es = state.orkl.content.filter((e) => e.public || (state.orkl.dat.isOwner && !e.public))
		if (es.length == 0) return html`
			<div class="tcgrey mt2 tac">The first entry still awaits its writer...</div>
		`
		return es.map(entry)
	}

	function entry(ent) {
		return html`
			<a href="${ent.url}" class="db nbb my2">
				<a class="dib f1 mb0-5" style="font-size: ${state.orkl.config.style.hsize}px">${ent.title}</a>
				<span class="tcgrey f5 mx1 dib">${!ent.public ? 'draft' : ''}</span>
				<div class="db">
					${excerpt(ent.text)}
				</div>
			</a>
		`

		function excerpt(text) {
			if (text) {
				var end = text.indexOf('\n\n')
				if (end == -1) end = Math.min(text.length, 300)
				if (end > 300) end = 300
				return text ? format(text.substring(0, end)) : ''
			}
			return null
		}
	}
}
