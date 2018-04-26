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
				${state.orkl.content.filter((e) => e.public || (state.orkl.dat.isOwner && !e.public)).map(entry)}
			</div>
		`
	} else {
		return html`
			${no_archive(state, emit)}
		`
	}

	function entry(state) {
		return html`
			<a href="${state.url}" class="db nbb my2">
				<a class="dib mb0-5">${state.title}</a>
				<div class="db">
					${excerpt(state.text)}
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
