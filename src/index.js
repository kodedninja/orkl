const choo = require('choo')
const orkl = require('./orkl')

const app = choo()

app.use(orkl())

app.route('/', require('./views/main'))
app.route('/new', require('./views/new'))
app.route('/404', require('./views/notfound'))
app.route('/:entry', require('./views/entry'))
app.route('/:entry/edit', require('./views/edit'))

app.mount('main')
