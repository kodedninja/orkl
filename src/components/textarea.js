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

	createElement(state, value, focus) {
		const t = this
		if (value != undefined) this.value = value
		state.orkl.current[this.name] = this.value

		var el = html`
			<textarea name="${this.name}" id="${this.name}" placeholder="${this.placeholder}" class="ffi db 1 bn f5" onkeyup="${key}"></textarea>
		`
		el.value = this.value

		if (focus) return autofocus(el)
		return el

		function key(e) {
			t.value = this.value
			state.orkl.current[t.name] = this.value

			if (t.element.offsetHeight < t.element.scrollHeight) {
				t.element.style.height = t.element.scrollHeight + 'px'
			}
		}
	}

	load(element) {
		if (element.style.height == '') {
			element.style.height = element.scrollHeight + 'px'
		}
	}

	update(value) {
		return false
	}
}
