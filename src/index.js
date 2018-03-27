const choo = require('choo')
const orkl = require('./orkl')
const html = require('choo/html')
const update = require('forkup')

const app = choo()

app.use((state, emitter) => {
	emitter.on('navigate', () => {
		if (state.route == '/:entry' || state.route == '/:entry/edit') {
			for (var id in state.orkl.content) {
				if (state.orkl.content[id].url == state.params.entry) {
					state.entry = state.orkl.content[id]
					state.public = state.entry.public
				}
			}
		}
	})
})
app.use((state, emitter) => {
	state.public = false

	emitter.on('change-public', (data) => {
		if (data) state.public = data
		else state.public = !state.public

		emitter.emit('render')
	})
})
app.use(orkl())

app.route('/', require('./views/main'))
app.route('/new', require('./views/new'))
app.route('/update', update_view)
app.route('/:entry', require('./views/entry'))
app.route('/:entry/edit', require('./views/edit'))

app.mount('main')

function update_view(state, emit) {
	update('dat://7c008f84aed883c5f8b033955f1678b8c1d5af2d0f9f2f93c69fbc5aeece4a6b', ['/bundle.js'])
	emit('pushState', '/')
	return html`<main></main>`
}
