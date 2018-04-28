const html = require('choo/html')

module.exports = customize

function customize(state, emit) {
	if (state.customize) {
		var style = state.orkl.config.style
		return html`
			<div class="db bb p2">
				<div class="2/3 m-1 mxa p1">
					<div class="1 dib">
						<div class="db 1 mb0-5">
							<span class="mr1">text size: </span>
							<input type="range" oninput="${change_font}" onchange="${change_font}" class="2/3" min="15" max="26" step="1" value="${style.fontsize}">
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
		state.orkl.config.style.hsize = (parseInt(e.target.value) * 1.6).toFixed(2)
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
