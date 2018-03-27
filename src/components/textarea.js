const Nanocomponent = require('nanocomponent')
const html = require('choo/html')

module.exports = class Textarea extends Nanocomponent {
	constructor(name, placeholder, value) {
		super()

		this.name = name
		this.placeholder = placeholder || ''
		this.value = value || ''
	}

	createElement(value) {
		if (value) this.value = value
		var ta = html`
			<textarea name="${this.name}" id="${this.name}" placeholder="${this.placeholder}" class="ffi db 1 bn f5"></textarea>
		`
		ta.value = this.value || ''
		
		return ta
	}

	update(value) {
		return this.value !== value
	}
}
