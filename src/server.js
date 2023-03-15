const Hapi = require('@hapi/hapi')
const routes = require('./routes')

const init = async () => {
	const server = Hapi.server({
		host: 'localhost',
		port: 9000,
		routes: {
			cors: {
				origin: ['*']
			}
		}
	})

	server.route(routes)
	server.start()
	console.log(`Server Started at ${server.info.uri}`)
}

init()