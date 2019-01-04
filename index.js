const ports = {
	client: 4000,
	websocket: 4001
}

const express = require('express');
const wsServer = require('ws').Server;

const app = express();
app.use('/', express.static('./public'));

app.listen(ports.client, () => console.log(`Server is running on port ${ ports.client }!`));

const io = new wsServer({
	port: ports.websocket
});

io.broadcast = function(data) {
	let a = JSON.stringify(data);

	for(let user of users) {
		user.socket.emit(a);
	}
}

{ // multiplayer game
	let game = {},
		users = [];

	let genID = () => { // 
		function a() {
			let b = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789~", // lib
				c = 25, // length
				d = ""; // output
			
			for(let ma = 0; ma < c; ma++) {
				d += b[Math.floor(Math.random() * b.length)];
			}

			return d;
		}

		// Get id
		let id = a();

		// Validate if no users with that id
		if(users.findIndex(io => io.id === id) !== -1) return genID(); // restart function
		else return id; // return id

	}

	io.on('connection', socket => {
		let id = genID(); // generate id

		socket.id = id;

		console.log(`User ${ socket.id } was successfully connected!`);

		// add new user
		users.push({
			id: id,
			socket,
			isHost: users.length === 0
		});

		socket.on('message', a => { // data received
			a = JSON.parse(a);
			
			switch(a.type) {
				case 'START_GAME':
					
				break;
				default:break;
			}
		});



		// TODO: Disconnect function -> remove socket from the clients array.
	});
}