const Nanocomponent = require('nanocomponent')
const html = require('choo/html')
const autofocus = require('dom-autofocus')

module.exports = class Input extends Nanocomponent {
	constructor(name, placeholder, value, classes) {
		super()

		this.name = name
		this.placeholder = placeholder || ''
		this.value = value || ''
		this.classes = classes
	}

	createElement(state, value, focus) {
		const t = this
		if (value != undefined) this.value = value
		state.orkl.current[this.name] = this.value

		const el = html`
			<input type="text" id="${this.name}" name="${this.name}" placeholder="${this.placeholder}" class="bn 1 ffi ${this.classes}" value="${this.value}" onkeyup="${key}" style="${style()}">
		`

		function key(e) {
			t.value = this.value
			state.orkl.current[t.name] = this.value
		}

		function style() {
			return `font-family: ${state.orkl.config.style.fontfamily};`
		}

		if (focus) return autofocus(el)
		return el
	}

	update(value) {
		return false
	}
}
