const choo = require('choo')
const orkl = require('./orkl')
const html = require('choo/html')
const update = require('forkup')

const app = choo()

app.use((state, emitter) => {
	emitter.on(state.events.RENDER, () => {
		if (state.selectbus) state.selectbus.emit('public:changed')
	})

	emitter.on('navigate', () => {
		state.title_required = false
		state.date_required = false
	})
})
app.use(orkl())

app.route('/', require('./views/main'))
app.route('/new', require('./views/new'))
app.route('/update', update_view)
app.route('/:entry', require('./views/entry'))
app.route('/:entry/edit', require('./views/edit'))

app.mount('body')

function update_view(state, emit) {
	update()
	emit('pushState', '/')
	return html`<main><div class="loading"></div></main>`
}
