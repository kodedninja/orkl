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
					<div class="db c100 p1"></div>
				</div>
			</main>
		`

		function new_nav() {
			if (!state.orkl) return null

			if (state.route != '/new' && state.route != '/:entry/edit' && state.route != '/:entry' && state.orkl.dat.isOwner) return html`
				<div class="fr">
					${publish_button()}
					<a href="/new">new entry</a>
				</div>
			`

			if (state.route == '/:entry' && state.orkl.dat.isOwner) return html`
				<div class="fr">
					${publish_button()}
					<a href="${state.href + '/edit'}" class="fr">edit</a>
				</div>
			`

			if (state.route == '/new' || state.route == '/:entry/edit') return html`
				<a href="/save" class="fr" onclick="${onsave}">save</a>
			`

			return null

			function publish_button() {
				if (state.orkl.dat.to_publish) return html`
					<a href="/publish" class="mr1" onclick="${publish}">publish</a>
				`
				return null

				function publish(e) {
					e.preventDefault();
					emit('publish')
				}
			}

			function onsave(e) {
				e.preventDefault()

				var title = document.getElementById('title').value.trim()

				if (title == '') return;

				var url = document.getElementById('url')
				if (url) url = url.value
				else url = undefined

				emit('saveContent', {
					url: url,
					title: title,
					date: document.getElementById('date').value.trim(),
					text: document.getElementById('text').value.trim()
				})
			}
		}
	}
}
