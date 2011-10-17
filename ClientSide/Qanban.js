	// Mise en place des sockets IO
	var socket = io.connect('http://mutualab.org');
	var fileData;
    var idx=1;
    // Recoit les données du serv pour la liste des taches
  	socket.on('task', function (data) {
        console.log('recoit');console.log(data);
        $('.portlet').remove();
		if(data.todo.length != 0) {
console.log('construit todo');
            for ( i=0; i< data.todo.length;i++) {
		         $( "#todo" ).append( "<div class='portlet ui-widget ui-widget-content ui-helper-clearfix ui-corner-all'>" + 
			    "<div class='taskTitle ui-widget-header ui-corner-all'>" +data.todo[i].title + "</div>" + 
			    "<div class='portlet-content'>" + data.todo[i].text + "</div>" + 
			    "<div class='id'>" + data.todo[i].id + "</div>" + 
	   		    "</div>" );
                idx = idx+i;
             }
        }
		if(data.doing.length != 0) {
console.log('construit doin');
            for ( i=0; i< data.doing.length;i++) {
                console.log("data"+i);
		         $( "#doing" ).append( "<div class='portlet ui-widget ui-widget-content ui-helper-clearfix ui-corner-all'>" + 
			    "<div class='taskTitle ui-widget-header ui-corner-all'>" +data.doing[i].title + "</div>" + 
			    "<div class='portlet-content'>" + data.doing[i].text + "</div>" + 
			    "<div class='id'>" + data.doing[i].id + "</div>" + 
	   		    "</div>" );
                idx = idx+i;
             }
        }
		if(data.done.length != 0) {
console.log('construit done');
            for ( i=0; i< data.done.length;i++) {
                console.log('done' + i);
		         $( "#done" ).append( "<div class='portlet ui-widget ui-widget-content ui-helper-clearfix ui-corner-all'>" + 
			    "<div class='taskTitle ui-widget-header ui-corner-all'>" +data.done[i].title + "</div>" + 
			    "<div class='portlet-content'>" + data.done[i].text + "</div>" + 
			    "<div class='id'>" + data.done[i].id+ "</div>" + 
	   		    "</div>" );
                idx = idx+i;
             }
        }
	});
	// Mise en place des listes Sortables jQueryUI
	$(function() {
		$( ".column" ).sortable({
			connectWith: ".column"
		});
		$( ".portlet" ).addClass( "ui-widget ui-widget-content ui-helper-clearfix ui-corner-all" )
			.find( ".taskTitle" )
				.addClass( "ui-widget-header ui-corner-all bite" )
				.prepend( "<span class='ui-icon ui-icon-minusthick couille'></span>")
				.end()
			.find( ".portlet-content" );

		$( ".portlet-header .ui-icon" ).click(function() {
			$( this ).toggleClass( "ui-icon-minusthick" ).toggleClass( "ui-icon-plusthick" );
			$( this ).parents( ".portlet:first" ).find( ".portlet-content" ).toggle();
		});
		// Quand une liste est bougée 
		$(".column").sortable({
		    stop: function(event, ui) {
				// On envoie les données position & texte et le titre dans un socket
                var myId = ui.item.children().next().next().text();
                var myTitle = ui.item.children().first().text();
                var myText = ui.item.children().next().first().text();	
               console.log('envoi');
            	var updateData = {"id":myId, "posx" : ui.position.left,"text": myText,'title': myTitle}
                console.log(updateData);
				var JSONData = JSON.stringify(updateData);
                socket.emit('change',updateData);
			}		
		});                              
		$( ".column" ).disableSelection();
	});
	// Création d'un nouvel element
	$(function() {
		$( "#dialog:ui-dialog" ).dialog( "destroy" );
		
		var name = $( "#name" ),
			desc = $( "#desc" ),
			allFields = $( [] ).add( name ).add( desc ),
			tips = $( ".validateTips" );
		function updateTips( t ) {
			tips
				.text( t )
				.addClass( "ui-state-highlight" );
			setTimeout(function() {
				tips.removeClass( "ui-state-highlight", 1500 );
			}, 500 );
		}

	
		
		$( "#dialog-form" ).dialog({
			autoOpen: false,
			height: 300,
			width: 350,
			modal: true,
			buttons: {
				"Create a new task": function() {
                        var newIdx = idx + 1;
						$( "#todo" ).append( "<div class='portlet ui-widget ui-widget-content ui-helper-clearfix ui-corner-all'>" + 
							"<div class='taskTitle ui-widget-header ui-corner-all'>" + name.val() + "</div>" + 
							"<div class='portlet-content'>" + desc.val() + "</div>" + 
			                "<div class='id'>" + newIdx + "</div>" + 
						"</div>" );
						var objJSON = {
						   	"name" : name.val(), 
							"desc": desc.val()
							};
						var strJSON = encodeURIComponent(JSON.stringify(objJSON));
						allFields.val( "" );
				        var updateData = {id: newIdx, posx : "10", title:objJSON.name, text:objJSON.desc}
						$( this ).dialog( "close" );
                        socket.emit('newTask', updateData);
                        console.log('emit');console.log(updateData);
				},
				Cancel: function() {
					allFields.val( "" );
					$( this ).dialog( "close" );
				},
				close: function() {
					allFields.val( "" ).removeClass( "ui-state-error" );
					$( this ).dialog( "close" );
				}
			}
		});

		$( "#create-task" ).click(function() {
				$( "#dialog-form" ).dialog( "open" );
		});
	});