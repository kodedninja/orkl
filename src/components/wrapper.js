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

			if ((state.route == '/new' || state.route == '/:entry/edit') && state.orkl.dat.isOwner) return html`
				<div class="fr">
					<a href="/save" onclick="${onsave}">save</a>
				</div>
			`

			return null

			function onsave(e) {
				e.preventDefault()

				state.orkl.current.title = state.orkl.current.title.trim()
				state.orkl.current.date = state.orkl.current.date.trim()

				var do_save = true

				if (state.orkl.current.title == '') {
					state.title_required = true
					do_save = false
				} else {
					state.title_required = false
				}

				if (state.orkl.current.date == '') {
					state.date_required = true
					do_save = false
				} else {
					state.date_required = false
				}

				if (do_save) emit('saveContent')
				else emit('re')
			}
		}
	}
}
