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
var parseJSON = function (jsonFile,callback) {
	var data = fs.readFile(jsonFile, onReadFile);
	function onReadFile(err, data) {
		if (err) return onError(err);
	list = JSON.parse(data);
	callback(list);
	}
	
}
var ecritJSON = function(jsonFile, newtask, callback) {
	fs.writeFile(jsonFile, newtask, function (err) {
	  if (err) throw err;
	  console.log('It\'s saved!');
	});
	
}
// Setup the server with Express 
app.listen(300);
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});


parseJSON('task.json',function(list) {
	task = list;
	console.log(task.todo.length);
});

// Open the websocket connection 
io.sockets.on('connection', function (socket) {	
  	// Envoi le JSON à la creation de la page
	//socket.emit('task', list);
	
	// Recoit les données position & texte du client
  	socket.on('change', function (data) {
		if (data.posx < 300) {
			if (task.todo.indexOf(data.title) != -1) {
				task.todo.push({"title": data.title, "text":data.text});
				console.log(task);
				var jsonString = JSON.stringify(task); 
				ecritJSON('task2.json', jsonString);
			}
		}else if (data.posx < 700) {
			if (task.doing.indexOf(data.title) != -1) {
				task.doing.push({"title": data.title, "text":data.text});
				console.log(task);
				var jsonString = JSON.stringify(task);
				ecritJSON('task2.json', jsonString);
			}
		}else {
			if (task.doing.indexOf(data.title) != -1) {
				task.done.push({"title": data.title, "text":data.text});
				console.log(task);
				var jsonString = JSON.stringify(task);
				ecritJSON('task2.json', jsonString);
			}
		}
				
   	});
});
