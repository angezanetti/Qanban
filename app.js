/*
Server code for Qanban

AngeZanetti- 2011

*/
// import modules
var fs = require('fs');
var app = require('express').createServer();
var io = require('socket.io').listen(app);

var task; // liste des taches en cours
var jsonString; 	
// Parse the JSON 
var parseJSON = function (jsonFile,callback) {
	var data = fs.readFile(jsonFile, onReadFile);
	function onReadFile(err, data) {
		if (err) return onError(err);
	list = JSON.parse(data);
	callback(list);
	}
}
// Ecrit le JSON
var ecritJSON = function(jsonFile, newtask, callback) {
	fs.writeFile(jsonFile, newtask, function (err) {
	  if (err) throw err;
	  console.log('It\'s saved!');
	});
	
}
//Rajoute une valeur au tableau des taches
var addObj = function (obj, data, callback) {
    if (data.posx<300) { console.log('pushtodo');
        obj.todo.push({"id":data.id, "title":data.title, "text":data.text});
    }	
    if (data.posx >300 && data.posx < 700) {console.log('pushdoing'); 
        obj.doing.push({"id":data.id,"title":data.title, "text":data.text});
    }
    if (data.posx > 700) { console.log('oushdone');
        obj.done.push({"id":data.id,"title":data.title, "text":data.text});
    } 
    return obj;
} 
// Nettoie le tableau des anciennes valeurs
var cleanItUp = function(myObj,data,callback) {
    var tabtodo = myObj.todo;
    var tabdoing = myObj.doing;
    var tabdone = myObj.done;
        for( var i=0; i<tabtodo.length; i++) { 
             if(tabtodo[i].id == data.id) {
console.log('vire todo');     
                tabtodo.splice(i,1);
                console.log(tabtodo);
                myObj.todo = tabtodo;
            }
        }
        for( var i=0; i<tabdone.length; i++) {      
            if(tabdone[i].id == data.id) {
console.log('vire done');     
                tabdone.splice(i,1);
                myObj.done = tabdone;
            }
        }
        for(var i=0; i<tabdoing.length; i++) {      
            if(tabdoing[i].id == data.id) {
console.log('vire doin');     
                tabdoing.splice(i,1);
                myObj.doing = tabdoing;
            }
        }
        return myObj;   
}
// Setup the server with Express 
app.listen(300);
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

parseJSON('task.json',function(list) {
	task = list;
});

// Open the websocket connection 
io.sockets.on('connection', function (socket) {	
    console.log('connection ouverte');
  	// Envoi le JSON à la creation de la page
	socket.emit('task',task);
    console.log('envoi task');
    // REcoit les donnée des nouvelles tâches
    socket.on('newTask', function (data) {
        task = addObj(task,data);
        console.log('newtaskdata');console.log(data);
        jsonString = JSON.stringify(task); 
        console.log('new JSON');console.log(jsonString);
        ecritJSON('task2.json', jsonString);
        console.log('ecrit new tache');
        socket.broadcast.emit('task',task);
    });
	// Recoit les données position & texte du client qd on change la pos
  	socket.on('change', function (data) {
        // On vire l'ancinne version du tableau
        console.log('changedata');console.log(data);
        task = cleanItUp(task, data);
        task = addObj(task,data);
        jsonString = JSON.stringify(task); 
        console.log('changement position');console.log(jsonString);
        ecritJSON('task2.json', jsonString);
        socket.broadcast.emit('task',task);
   	}); 
});
