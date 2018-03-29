const Nanocomponent = require('nanocomponent')
const html = require('choo/html')

module.exports = class Select extends Nanocomponent {
	constructor(name, t, f) {
		super()

		this.name = name
		this.t = t || ''
		this.f = f || ''
	}

	createElement(state, emit) {
		const th = this

		const p = state.orkl.current.public

		return html`
			<a href="#" onclick=${click} class="${!p ? 'tcgrey' : ''} nbb db">${p ? this.t : this.f}</a>
		`

		function click(e) {
			e.preventDefault()
			state.orkl.current.public = !state.orkl.current.public
			th.rerender()
		}
	}

	update() {
		return false
	}
}
