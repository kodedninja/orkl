const html = require('choo/html')
const form = require('./form')
const customize = require('./customize')

module.exports = view

var k = false

function view(body) {
	return function(state, emit) {
		if (!state.loaded) return html`<body><div class="loading"></div></body>`

		if (!k) {
			document.addEventListener('keydown', keydown)
			k = true
		}

		return html`
			<body class="1 db" style="${apply_style()}">
				${customize(state, emit)}
				<div class="db p2 2/3 m-1 mxa mw1400 pr">
					${state.orkl.dat.isOwner ? html`<a href="#" class="customize ba brpill nbb pbutton" onclick="${customize_click}">${!state.customize ? 'customize' : 'close'}</a>` : ''}
					<div class="db mb2">
						<a href="/" class="nbb">${state.orkl.config ? state.orkl.config.title : ''}</a>
						${new_nav()}
					</div>
					${body(state, emit)}
					<div class="db 1 p1"></div>
				</div>
			</body>
		`

		function customize_click(e) {
			e.preventDefault()

			state.customize = !state.customize
			emit('re')
		}

		function new_nav() {
			if (!state.orkl) return null

			if (state.route != '/new' && state.route != '/:entry/edit' && state.route != '/:entry' && state.orkl.dat.isOwner) return html`
				<div class="fr">
					<a href="/new" class="mr1 ba brpill nbb pbutton">new entry</a>
				</div>
			`

			if (state.route == '/:entry' && state.orkl.dat.isOwner) return html`
				<div class="fr">
					<a href="${state.href + '/edit'}" class="mr1 ba brpill nbb pbutton">edit</a>
				</div>
			`

			if ((state.route == '/new' || state.route == '/:entry/edit') && state.orkl.dat.isOwner) return html`
				<div class="fr">
					<a href="/save" onclick="${onsave}" class="mr1 ba brpill nbb pbutton">save</a>
				</div>
			`

			return null
		}

		function keydown(e) {
			if ((state.route == '/new' || state.route == '/:entry/edit') && state.orkl.dat.isOwner) {
				if (e.ctrlKey && e.keyCode == 83) {
					e.preventDefault()
					onsave()
				}
			}
		}

		function onsave(e) {
			if (e) e.preventDefault()

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

		function apply_style() {
			const style = state.orkl.config.style
			return `font-family: ${style.fontfamily}; background: ${style.background}; color: ${style.color}; font-size: ${style.fontsize}px;`
		}
	}
}
