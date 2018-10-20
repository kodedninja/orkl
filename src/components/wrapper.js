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
				<div class="db p2 2/3 m-1 mxa mw pr">
					${customize_button()}
					<div class="db mb2 1">
						<a href="/" class="nbb" onclick="${onhome}">${title()}</a>
						${new_nav()}
					</div>
					${body(state, emit)}
					<div class="db 1 p1"></div>
				</div>
			</body>
		`

		function title() {
			return state.orkl.config ? state.orkl.config.title : 'orkl'
		}

		function customize_button() {
			return (state.orkl.dat.isOwner && state.route != '/new' && state.route != '/:entry/edit') ? html`<a href="#" class="customize button" onclick="${customize_click}">${!state.customize ? 'customize' : 'close'}</a>` : ''
		}

		function customize_click(e) {
			e.preventDefault()

			state.customize = !state.customize
			emit('re')
		}

		function new_nav() {
			if (!state.orkl) return null

			if (state.route != '/new' && state.route != '/:entry/edit' && state.route != '/:entry' && state.orkl.dat.isOwner) return html`
				<div class="fr">
					<a href="/new" class="mr1 button ${state.welcome ? 'blink' : ''}">${!state.welcome ? 'new entry' : 'write your first entry'}</a>
				</div>
			`

			if (state.route == '/:entry' && state.orkl.dat.isOwner) return html`
				<div class="fr">
					<a href="${state.href + '/edit'}" class="mr1 button">edit</a>
				</div>
			`

			if ((state.route == '/new' || state.route == '/:entry/edit') && state.orkl.dat.isOwner) return html`
				<div class="fr">
					<a href="/save" onclick="${onsave}" class="mr1 button">save</a>
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

			if (do_save) {
				emit('saveContent')
				localStorage.removeItem('text')
			} else {
				emit('re')
			}
		}

		function onhome() {
			// if the home button is pressed we presume that it was intentional
			localStorage.removeItem('text')
		}

		function apply_style() {
			const style = state.orkl.config.style
			return `font-family: ${style.fontfamily}; background: ${style.background}; color: ${style.color}; font-size: ${style.fontsize}px;`
		}
	}
}
