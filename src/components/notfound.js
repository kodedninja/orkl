const html = require('choo/html')

module.exports = view

function view(state, emit) {
	return html`
		<span>404 - Entry not found</span>
	`
}
