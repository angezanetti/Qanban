/*

Server code for Qanban

AngeZanetti - 2011

*/

// import modules
var fs = require('fs');
var app = require('express').createServer();
var  io = require('socket.io').listen(app);

var task = {}; // liste des taches en cours
	
// Parse the JSON 
function parseJSON () {
	var data = fs.readFile('task.json', onReadFile);
	function onReadFile(err, data) {
		if (err) return onError(err);
	console.log('data '+ data);		
	this.list = JSON.parse(data);
	}
	
}
function editJSN() {
	JSON.stringyfy();
}

// Setup the server with Express 
app.listen(300);
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

// Open the websocket connection 
io.sockets.on('connection', function (socket) {	
	//task = parseJSON();
  	// Envoi le JSON à la creation de la page
	//socket.emit('task', list);
	// Recoit les données position & texte du client
  	socket.on('change', function (data) {
		// console.log('text ' + data.text);
		// console.log('title ' + data.title);
		// 	console.log('posx  ' + data.posx);
		if (data.posx < 300) {
			console.log('colonne1');
			
		}else if (data.posx < 700) {
			console.log('colonne 2');
		}else {
			console.log('colonne 3');
		}
				
   	});
});
console.log('list ' + parseJSON.list);