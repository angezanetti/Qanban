/*

Server code for Qanban

09/2011
*/

var fs = require('fs');
var app = require('express').createServer()
  , io = require('socket.io').listen(app);

// Parse le JSON 
// @@ Mettre le nom du fichier en arg de la fonction
function parseJSON () {
	var data = fs.readFile('task.json', onReadFile);
	
	function onReadFile(err, data) {
		if (err) return onError(err);
	console.log("data "+ data);		
	var list = JSON.parse(data);
	return list;
	}
	
}

// Port d'écoute du serv
app.listen(300);


app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});


io.sockets.on('connection', function (socket) {
	var task = parseJSON();
  	// Envoi le JSON à la creation de la page
	socket.emit('task', task);
	
	// Recoit les données position & texte du client
  	socket.on('change', function (data) {
		console.log("text " + data.text);		
   	});
	// socket.emit('change', { pos: ui.position, text: ui.item.text() });

});

