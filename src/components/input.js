const Nanocomponent = require('nanocomponent')
const html = require('choo/html')
const autofocus = require('dom-autofocus')

module.exports = class Input extends Nanocomponent {
	constructor(name, placeholder, value) {
		super()

		this.name = name
		this.placeholder = placeholder || ''
		this.value = value || ''
	}

	createElement(value, focus) {
		if (value) this.value = value

		const el = html`
			<input type="text" id="${this.name}" name="${this.name}" placeholder="${this.placeholder}" class="bn 1 mb1 f5 ffi" value="${this.value}">
		`

		if (focus) return autofocus(el)
		return el
	}

	update(value) {
		return false
	}
}
