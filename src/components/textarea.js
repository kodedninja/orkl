const Nanocomponent = require('nanocomponent')
const html = require('choo/html')
const autofocus = require('dom-autofocus')

module.exports = class Textarea extends Nanocomponent {
	constructor(name, placeholder, value) {
		super()

		this.name = name
		this.placeholder = placeholder || ''
		this.value = value || ''
	}

	createElement(value, focus) {
		if (value) this.value = value

		var el = html`
			<textarea name="${this.name}" id="${this.name}" placeholder="${this.placeholder}" class="ffi db 1 bn f5"></textarea>
		`
		el.value = this.value || ''

		if (focus) return autofocus(el)
		return el
	}

	update(value) {
		return false
	}
}
