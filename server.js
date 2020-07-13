const path = require('path');
require('dotenv').config({ path: process.env.ENV_PATH || path.resolve(process.cwd(), '.env') });

const http = require('http');
const koa = require('koa');
const app = new koa();
const cors = require('koa2-cors');
const helmet = require('koa-helmet');
const etag = require('koa-etag');
const conditional = require('koa-conditional-get');
const serve = require('koa-static');
const socketIO = require('socket.io');

const PORT = 3000;

const unhandledRejections = new Map();
process
	.on('unhandledRejection', (err, p) => {
		unhandledRejections.set(p, err);
		setTimeout(function () {
			if (unhandledRejections.has(p)) {
				console.error(err); // Тут нужно логировать
				process.exit(1);
			}
		}, 200);
	})
	.on('rejectionHandled', p => {
		unhandledRejections.delete(p);
	})
	.on('uncaughtException', err => {
		console.error(err); // Тут нужно логировать
		process.exit(1);
	})
	.on('SIGTERM', onSigintSigtermMessageHttp('SIGTERM'))
	.on('SIGINT', onSigintSigtermMessageHttp('SIGINT'))
	.on('message', onSigintSigtermMessageHttp('message'));

app.use(cors());
app.use(helmet());
app.use(conditional());
app.use(etag());
app.use(serve(path.join(__dirname, 'build'), {
	defer: false,
	index: 'index.html',
	maxage: 86400000*30, // 30 days
	gzip: true,
	hidden: false
}));

// Setup basic express server
const server = http.createServer(app.callback());
const io = socketIO.listen(server, {
	transports: ['websocket', 'polling'],
	maxHttpBufferSize: 10e7, // how many bytes or characters a message can be, before closing the session (to avoid DoS)
	serveClient: false,
	allowUpgrades: true,
	httpCompression: true,
	cookie: false,
	wsEngine: 'ws',
});

process
	.on('SIGTERM', onSigintSigtermMessageSocket('SIGTERM'))
	.on('SIGINT', onSigintSigtermMessageSocket('SIGINT'))
	.on('message', onSigintSigtermMessageSocket('message'));

let usersCount = 0;

io.on('connection', socket => {
  ++usersCount;

  io.emit('user joined');

	socket.on('new message', text => {
	  const message = {text, created_at: Date.now()};
    socket.emit('new message', {...message, self: true});
    socket.broadcast.emit('new message', message);
	});

  socket.on('users count', () => {
    socket.emit('users count', usersCount);
  });

	socket.on('disconnect', () => {
    --usersCount;
    if (usersCount < 0) usersCount = 0;
		socket.broadcast.emit('user left');
	});
});

server.listen(PORT, () => {
	console.info('SERVER LISTENING ON PORT:', PORT);
	console.info('PROCESS PID:', process.pid);
});

function onSigintSigtermMessageHttp (signal) {
	return function (msg) {
		if ('message' === signal && 'shutdown' !== msg) return; // windows
		console.info('\n' + signal +' signal received.');
		console.info('Closing server...');
		// Stops the server from accepting new connections and finishes existing connections.
		server.close(err => {
			if (err) {
				console.error(err); // Тут нужно логировать
				return process.exit(1);
			}
			process.exit(0);
		});
	}
}
function onSigintSigtermMessageSocket (signal) {
	return function (msg) {
		if ('message' === signal && 'shutdown' !== msg) return; // windows
		console.info('Closing socket server...');
		io.close();
	}
}
