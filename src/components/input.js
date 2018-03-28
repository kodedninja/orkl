const Nanocomponent = require('nanocomponent')
const html = require('choo/html')

module.exports = class Input extends Nanocomponent {
	constructor(name, placeholder, value) {
		super()

		this.name = name
		this.placeholder = placeholder || ''
		this.value = value || ''
	}

	createElement(value) {
		if (value) this.value = value
		return html`
			<input type="text" id="${this.name}" name="${this.name}" placeholder="${this.placeholder}" class="bn 1 mb1 f5 ffi" value="${this.value}">
		`
	}

	update(value) {
		return false
	}
}
