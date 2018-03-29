const choo = require('choo')
const orkl = require('./orkl')
const html = require('choo/html')
const update = require('forkup')

const app = choo()

app.use((state, emitter) => {
	emitter.on(state.events.RENDER, () => {
		if (state.selectbus) state.selectbus.emit('public:changed')
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
