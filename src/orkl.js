// the Dat part
const smarkt = require('smarkt')
const xhr = require('xhr')

module.exports = orkl

function orkl () {
	return function plugin(state, emitter) {
		try {
			var archive = new DatArchive(window.location.origin + '/')
			var fs = makeDatFs(archive)
			state.p2p = true
		} catch (err) {
			//return no_archive()
			state.p2p = false
		}


		state.events = state.events || { }
		state.export_content = false
		state.orkl = {
			config: {},
			content: [],
			dat: {}
		}

		emitter.on(state.events.DOMCONTENTLOADED, loaded)
		emitter.on('refresh', refresh)
		emitter.on('saveContent', save)
		emitter.on('delete', delete_entry)

		async function loaded() {
			if (state.p2p) await load_dat()
			else await load_http()
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
			state.orkl.dat.to_publish = (await archive.diff()).length != 0

			state.orkl.content = []
			try {
				var dir = await fs.readdir(state.orkl.config.directory)

				dir.forEach(async function(file, id) {
					var content = await fs.readfile(state.orkl.config.directory + '/' + file)
					content = smarkt.parse(content)
					content.url = file.replace('.txt', '')
					state.orkl.content.push(content)
					state.orkl.content.sort((a, b) => {
						if (b.date == a.date) return b.ctime - a.ctime
						return b.date > a.date
					})

					if (id === dir.length - 1) {
						if (state.export_content) write_export()
						emitter.emit(state.events.RENDER)
					}
				})
			} catch (err) {
				await fs.mkdir(state.orkl.config.directory)
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

						emitter.emit(state.events.RENDER)
						resolve()
					} catch (err) {
						reject(err)
					}
				})
			})
		}

		async function save(data) {
			var filename = data.url || sanitize(data.title)
			if (!data.url) {
				data.ctime = new Date().getTime()
				data.url = filename
			} else {
				data.ctime = get_entry(data.url).ctime
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
		}

		async function delete_entry(entry) {
			await fs.unlink(state.orkl.config.directory + '/' + entry + '.txt')
			state.orkl.content.splice(get_entry_index(entry), 1)

			state.export_content = true
			emitter.emit('refresh')
			emitter.emit('pushState', '/')

			await archive.commit()
		}

		async function write_export() {
			var http_data = {}
			http_data.content = state.orkl.content
			http_data.config = state.orkl.config

			state.export_content =  false

			await fs.writefile('/content.json', JSON.stringify(http_data, null, '\t'))
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
