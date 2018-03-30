const Nanocomponent = require('nanocomponent')
const html = require('choo/html')

module.exports = class Delete extends Nanocomponent {
	constructor() {
		super()

		this.sure = false
		this.timeout = null
	}

	createElement(state, emit) {
		const t = this
		return html`
			<a href="/delete" class="mr1 tcred" onclick="${click}">${this.sure ? 'sure?' : 'delete'}</a>
		`

		function click(e) {
			e.preventDefault()

			if (t.sure) {
				t.sure = false
				if (t.timeout) clearTimeout(t.timeout)
				emit('delete', state.params.entry)
		 	} else {
				t.sure = true
				t.timeout = setTimeout(function() {
					t.sure = false
					if (t.element) t.rerender()
				}, 2000)
				t.rerender()
			}
		}
	}
}
