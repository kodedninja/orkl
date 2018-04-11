// the Dat part
const smarkt = require('smarkt')
const xhr = require('xhr')
const RSS = require('rss')

var MarkdownIt = require('markdown-it')
var md = new MarkdownIt()

md.use(require('markdown-it-sup'))

module.exports = orkl

function orkl () {
	return function plugin(state, emitter) {
		try {
			var archive = new DatArchive(window.location.origin + '/')
			var fs = makeDatFs(archive)
			state.p2p = true
		} catch (err) {
			state.p2p = false
		}

		state.events = state.events || { }
		state.loaded = false
		state.export_content = false
		state.title_required = false
		state.date_required = false
		state.orkl = {
			config: {},
			content: [],
			dat: {},
			current: {
				title: null,
				date: null,
				text: null,
				url: null,
				public: null,
				ctime: null
			}
		}

		emitter.on('navigation', () => {
			state.title_required = false
		})
		emitter.on(state.events.DOMCONTENTLOADED, loaded)
		emitter.on('refresh', refresh)
		emitter.on('saveContent', save)
		emitter.on('delete', delete_entry)
		emitter.on('re', re)
		emitter.on('file', handle_file)

		async function loaded() {
			if (state.p2p) await load_dat()
			else load_http().catch(function() {
				return no_archive()
			})
		}

		async function load_dat() {
			var config = await fs.readfile('/config.json')
			state.orkl.config = JSON.parse(config)
			state.orkl.dat = await archive.getInfo()
			state.orkl.config.title = state.orkl.config.title || state.orkl.dat.title

			if (!state.orkl.dat.isOwner && (state.route == '/new' || state.route == '/:entry/edit')) emitter.emit('replaceState', '/')

			await refresh()
		}

		async function refresh() {
			state.orkl.content = []
			try {
				var dir = await fs.readdir(state.orkl.config.directory)

				if (dir.length == 0) {
					state.loaded = true
					emitter.emit(state.events.RENDER)
					return
				}

				dir.forEach(async function(file, id) {
					var content = await fs.readfile(state.orkl.config.directory + '/' + file)
					content = smarkt.parse(content)
					content.url = file.replace('.txt', '')
					state.orkl.content.push(content)
					state.orkl.content.sort((b, a) => {
						if (a.date && b.date && b.date == a.date) return b.ctime - a.ctime
						return b.date - a.date
					})

					if (id === dir.length - 1) {
						if (state.export_content) write_export()
						state.loaded = true
						emitter.emit(state.events.RENDER)
					}
				})
			} catch (err) {
				await fs.mkdir(state.orkl.config.directory)

				state.loaded = true

        		emitter.emit(state.events.RENDER)
			}
		}

		async function load_http() {
			return new Promise(function (resolve, reject) {
				var bust = Math.floor(Date.now() / 1000)
				xhr('/content.json?' + bust, function (err, res) {
					try {
						var http_data = JSON.parse(res.body)
						state.orkl.dat = {isOwner: false}
						state.orkl.config = http_data.config
						state.orkl.content = http_data.content

						state.loaded = true

						emitter.emit(state.events.RENDER)
						resolve()
					} catch (err) {
						reject(err)
					}
				})
			})
		}

		async function save(data) {
			state.title_required = false

			var filename = state.orkl.current.url || sanitize(state.orkl.current.title)

			var data = {
				title: state.orkl.current.title,
				date: state.orkl.current.date,
				url: state.orkl.current.url,
				public: state.orkl.current.public,
				ctime: state.orkl.current.ctime || new Date().getTime(),
				text: state.orkl.current.text
			}

			if (!data.url) {
				// no same title
				await precheck()

				data.url = filename
			}

			await fs.writefile(state.orkl.config.directory + '/' + filename + '.txt', smarkt.stringify(data))

			state.export_content = true

			emitter.emit('refresh')

			emitter.emit('pushState', '/' + filename)
			await archive.commit()

			function sanitize(str) {
				return str
					.toLowerCase()
					.replace(/\s+/g, '-')
				    .replace(/[.,\/#!@?$%\^&\*;:{}=\_`~()\'\"]/g, '')
			}

			async function precheck() {
				try {
					var a = await fs.readfile(state.orkl.config.directory + '/' + filename + '.txt')
					filename += '-' + (new Date().getTime()%10000)

					await precheck() // hopefully this will never happen
				} catch (e) {}
			}
		}

		async function delete_entry(entry) {
			await fs.unlink(state.orkl.config.directory + '/' + entry + '.txt')
			state.orkl.content.splice(get_entry_index(entry), 1)

			state.export_content = true
			emitter.emit('refresh')
			emitter.emit('pushState', '/')

			await archive.commit()
		}

		function re() {
			emitter.emit('render')
		}

		async function handle_file(file) {
			try {
				await fs.mkdir('/files')
			} catch (e) {}

			await fs.writefile('/files/' + file.name, file.data)
		}

		async function write_export() {
			var http_data = {}
			http_data.content = state.orkl.content
			http_data.config = state.orkl.config

			state.export_content =  false

			await fs.writefile('/content.json', JSON.stringify(http_data, null, '\t'))

			// RSS
			var feed = new RSS({
				title: state.orkl.config.title,
				feed_url: '/feed.xml',
				site_url: '/'
			})

			http_data.content.forEach(function(state) {
				if (state.public) {
					feed.item({
						title: state.title,
						description: md.render(excerpt(state.text)),
						url: '/' + state.url,
						date: state.date
					})
				}
			})

			await fs.writefile('/feed.xml', feed.xml({indent: true}))

			function excerpt(text) {
				if (text) {
					var end = text.indexOf('\n\n')
					if (end == -1) end = Math.min(text.length, 300)
					return text ? text.substring(0, end) : ''
				}
				return null
			}
		}

		function get_entry(e) {
			for (var id in state.orkl.content) {
				if (state.orkl.content[id].url == e) return state.orkl.content[id]
			}
			return null
		}

		function get_entry_index(e) {
			for (var id in state.orkl.content) {
				if (state.orkl.content[id].url == e) return id
			}
			return null
		}

		function no_archive() {
			state.orkl = false
			emitter.emit(state.events.RENDER)
		}
	}
}

// from jondashkyle's Dropout
function makeDatFs (archive) {
  return {
    readfile: readFile,
    writefile: writeFile,
    readdir: readdir,
    mkdir: mkdir,
    rmdir: rmdir,
    unlink: unlink,
    stat: stat
  }

  async function readFile (dir, opts) {
    return await archive.readFile(dir, opts)
  }

  async function writeFile (dir, data) {
    return await archive.writeFile(dir, data)
  }

  async function readdir (dir, opts) {
    return await archive.readdir(dir, opts)
  }

  async function mkdir (dir, opts) {
    return await archive.mkdir(dir, opts)
  }

  async function rmdir (dir, opts) {
    return await archive.rmdir(dir, opts)
  }

  async function unlink (dir) {
    return await archive.unlink(dir)
  }

  async function stat (dir) {
    return await archive.stat(dir)
  }
}
