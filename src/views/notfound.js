const html = require('choo/html')
const wrapper = require('../components/wrapper')

module.exports = wrapper(view)

function view(state, emit) {
	return html`
		<span>404 - Entry not found</span>
	`
}
