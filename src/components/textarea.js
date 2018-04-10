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

	createElement(state, emit, value, focus) {
		const t = this
		if (value != undefined) this.value = value
		state.orkl.current[this.name] = this.value

		var el = html`
			<textarea name="${this.name}" id="${this.name}" placeholder="${this.placeholder}" class="ffi db 1 f5" onkeyup="${key}"></textarea>
		`
		el.emit = emit
		el.value = this.value

		if (focus) return autofocus(el)
		return el

		function key(e) {
			t.value = t.element.value
			state.orkl.current[t.name] = t.element.value

			if (t.element.offsetHeight < t.element.scrollHeight) {
				t.element.style.height = t.element.scrollHeight + 'px'
			}
		}
	}

	load(element) {
		if (element.style.height == '') {
			element.style.height = element.scrollHeight + 'px'
		}

		// file drag and drop / upload
		element.addEventListener('dragover', this.drag_over, false)
		element.addEventListener('dragleave', this.drag_leave, false)
		element.addEventListener('drop', this.drop, false)
	}

	drag_over(e) {
		e.preventDefault()
		this.classList.add('ba')
	}

	drag_leave(e) {
		e.preventDefault()
		this.classList.remove('ba')
	}

	drop(e) {
		const t = this
		e.preventDefault()

		var files = e.dataTransfer.files, file = null
		var i = 0

		var reader = new FileReader()
		reader.onload = async function (e) {
			var result = e.target.result
			t.emit('file', {name: sanitize(file.name), data: result})

			type_in_textarea(t, '![' + file.name + '](/files/' + sanitize(file.name) + ')')
			t.onkeyup(e)

			i++
			if (i < files.length) next()
		}

		function next() {
			file = files[i]
			reader.readAsArrayBuffer(file)
		}

		next()
		this.classList.remove('ba')

		function type_in_textarea(el, newText) {
			var start = el.selectionStart
			var end = el.selectionEnd
			var text = el.value
			var before = text.substring(0, start)
			var after  = text.substring(end, text.length)
			el.value = (before + newText + after)
			el.selectionStart = el.selectionEnd = start + newText.length
			el.focus()
		}

		function sanitize(str) {
			return str
				.toLowerCase()
				.replace(/\s+/g, '-')
				.replace(/[,\/#!@?$%\^&\*;:{}=\_`~()\'\"]/g, '')
		}
	}

	update(value) {
		return false
	}
}
