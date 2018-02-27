const html = require('choo/html')
const wrapper = require('../components/wrapper')

module.exports = wrapper(view)

function view (state, emit) {
	return html`
		<div class="db c100">
			${state.orkl.content.map(entry)}
		</div>
	`

	function entry(state) {
		return html`
			<a href="${state.url}" class="db nbb my2">
				<a class="dib mb1">${state.title}</a>
				<div class="db">
					${excerpt(state.text)}
				</div>
			</a>
		`

		function excerpt(text) {
			return text.substring(0, 200) + '...'
		}
	}
}
