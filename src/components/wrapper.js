const html = require('choo/html')
const form = require('./form')

module.exports = view

var k = false
const colorcode = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i

function view(body) {
	return function(state, emit) {
		if (!state.loaded) return html`<body><div class="loading"></div></body>`

		if (!k) {
			document.addEventListener('keydown', keydown)
			k = true
		}

		return html`
			<body class="1 db" style="${apply_style()}">
				${customize()}
				<div class="db p2 2/3 m-1 mxa mw1400 pr">
					${state.orkl.dat.isOwner ? html`<a href="#" class="customize" onclick="${customize_click}">${!state.customize ? 'customize' : 'close'}</a>` : ''}
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
					<a href="/new" class="mr1">new entry</a>
				</div>
			`

			if (state.route == '/:entry' && state.orkl.dat.isOwner) return html`
				<div class="fr">
					<a href="${state.href + '/edit'}" class="mr1">edit</a>
				</div>
			`

			if ((state.route == '/new' || state.route == '/:entry/edit') && state.orkl.dat.isOwner) return html`
				<div class="fr">
					<a href="/save" onclick="${onsave}">save</a>
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

		function customize() {
			if (state.customize) {
				var style = state.orkl.config.style
				return html`
					<div class="db bb p2">
						<div class="2/3 m-1 mxa p1">
							<div class="1 dib">
								<div class="db 1 mb0-5">
									<span class="mr1">font size: </span>
									<input type="range" oninput="${change_font}" onchange="${change_font}" class="2/3" min="14" max="26" step="1" value="${state.orkl.config.style.fontsize}">
									<span class="ml1">${style.fontsize}px</span>
								</div>
								<div class="db 1 mb0-5">
									<span class="mr1">font: </span>
									<select onchange="${change_font_style}">
										<option value="'Inter UI', helvetica, sans-serif" ${style.fontfamily == "'Inter UI', helvetica, sans-serif" ? 'selected' : ''}>Inter UI</option>
										<option value="'arial', sans-serif" ${style.fontfamily == "'arial', sans-serif" ? 'selected' : ''}>Arial</option>
										<option value="monospace" ${style.fontfamily == "monospace" ? 'selected' : ''}>Monospace</option>
										<option value="georgia" ${style.fontfamily == "georgia" ? 'selected' : ''}>Georgia</option>
									</select>
								</div>
								<div class="db 1 mb0-5">
									<span class="mr1">background: </span>
									<input type="text" placeholder="#fff" onchange="${bg_change}" value="${style.background}">
									<span class="ml1 tcgrey">experimental</span>
								</div>
								<div class="db 1">
									<span class="mr1">text color: </span>
									<input type="text" placeholder="#000" onchange="${color_change}" value="${style.color}">
									<span class="ml1 tcgrey">experimental</span>
								</div>
							</div>
						</div>
					</div>
				`
			}

			function change_font(e) {
				state.orkl.config.style.fontsize = e.target.value
				emit('savestyle')
			}

			function change_font_style(e) {
				state.orkl.config.style.fontfamily = e.target.value
				emit('savestyle')
			}

			function bg_change(e) {
				var res = e.target.value
				if (res[0] != '#') res = '#' + res

				if (!colorcode.test(res)) return
				state.orkl.config.style.background = res
				emit('savestyle')
			}

			function color_change(e) {
				var res = e.target.value
				if (res[0] != '#') res = '#' + res

				if (!colorcode.test(res)) return
				state.orkl.config.style.color = res
				emit('savestyle')
			}
		}

		function apply_style() {
			const style = state.orkl.config.style
			return `font-family: ${style.fontfamily}; background: ${style.background}; color: ${style.color}; font-size: ${style.fontsize}px;`
		}
	}
}
