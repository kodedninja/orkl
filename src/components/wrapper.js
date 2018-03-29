const html = require('choo/html')
const form = require('./form')

module.exports = view

function view(body) {
	return function(state, emit) {
		if (!state.loaded) return html`<main><div class="loading"></div></main>`

		return html`
			<main class="p2 1 db mxa mw1400">
				<div class="db 2/3 m-1 mxa">
					<div class="db mb2">
						<a href="/" class="nbb">${state.orkl.config ? state.orkl.config.title : ''}</a>
						${new_nav()}
					</div>
					${body(state, emit)}
					<div class="db 1 p1"></div>
				</div>
			</main>
		`

		function new_nav() {
			if (!state.orkl) return null

			if (state.route != '/new' && state.route != '/:entry/edit' && state.route != '/:entry' && state.orkl.dat.isOwner) return html`
				<div class="fr">
					<a href="/new">new entry</a>
				</div>
			`

			if (state.route == '/:entry' && state.orkl.dat.isOwner) return html`
				<div class="fr">
					<a href="${state.href + '/edit'}" class="fr">edit</a>
				</div>
			`

			if (state.route == '/new' || state.route == '/:entry/edit') return html`
				<div class="fr">
					<a href="/save" onclick="${onsave}">save</a>
				</div>
			`

			return null

			function onsave(e) {
				e.preventDefault()

				if (state.orkl.current.title == '') {
					emit('noTitle')
					return
				}

				emit('saveContent')
			}
		}
	}
}
