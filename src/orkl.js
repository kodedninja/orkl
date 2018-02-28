// the Dat part
const smarkt = require('smarkt')

module.exports = orkl

function orkl () {
	return function plugin(state, emitter) {

		try {
			var archive = new DatArchive(window.location.origin + '/')
		} catch (err) {
			return no_archive()
		}

		var fs = makeDatFs(archive)

		state.events = state.events || { }
		state.orkl = {
			config: {},
			content: [],
			dat: {}
		}

		emitter.on(state.events.DOMCONTENTLOADED, loaded)
		emitter.on('refresh', refresh)
		emitter.on('saveContent', save)
		emitter.on('delete', delete_entry)
		emitter.on('publish', publish)

		async function loaded() {
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

					if (id === dir.length - 1) emitter.emit(state.events.RENDER)
				})
			} catch (err) {
				await fs.mkdir(state.orkl.config.directory)
        		emitter.emit(state.events.RENDER)
			}
		}

		async function save(data) {
			var filename = data.url || sanitize(data.title)
			if (!data.url) data.ctime = new Date().getTime()
			else {
				data.ctime = get_entry(data.url).ctime
			}
			data = smarkt.stringify(data)

			await fs.writefile(state.orkl.config.directory + '/' + filename + '.txt', data)

			emitter.emit('refresh')
			emitter.emit('pushState', '/' + filename)

			function sanitize(str) {
				return str
					.toLowerCase()
					.replace(/\s+/g, '-')
				    .replace(/[.,\/#!@?$%\^&\*;:{}=\_`~()\'\"]/g, '')
			}
		}

		async function delete_entry(entry) {
			await fs.unlink(state.orkl.config.directory + '/' + entry + '.txt')
			emitter.emit('refresh')
			emitter.emit('pushState', '/')
		}

		async function publish() {
			await archive.commit()
			state.orkl.dat.to_publish = false
			emitter.emit('render')
		}

		function get_entry(e) {
			for (var id in state.orkl.content) {
				if (state.orkl.content[id].url == e) return state.orkl.content[id]
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
