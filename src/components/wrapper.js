const html = require('choo/html')

module.exports = view

function view(body) {
	return function(state, emit) {
		return html`
			<main class="p1 c100 db">
				<div class="db c23rd m-c100 mxa">
					<div class="db mb2">
						<a href="/" class="nbb">${state.orkl.config ? state.orkl.config.title : ''}</a>
						${new_nav()}
					</div>
					${body(state, emit)}
				</div>
			</main>
		`

		function new_nav() {
			if (!state.orkl) return null

			if (state.route != '/new' && state.route != '/:entry/edit' && state.route != '/:entry' && state.orkl.dat.isOwner) return html`
				<a href="/new" class="fr">new entry</a>
			`

			if (state.route == '/:entry' && state.orkl.dat.isOwner) return html`
				<a href="${state.href + '/edit'}" class="fr">edit</a>
			`

			if (state.route == '/new' || state.route == '/:entry/edit') return html`
				<a href="/save" class="fr" onclick="${onsave}">save</a>
			`

			return null

			function onsave(e) {
				e.preventDefault()

				var url = document.getElementById('url')
				if (url) url = url.value
				else url = undefined

				emit('saveContent', {
					url: url,
					title: document.getElementById('title').value,
					date: document.getElementById('date').value,
					text: document.getElementById('text').value
				})
			}
		}
	}
}
