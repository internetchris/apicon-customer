// here's the App ID value from the portal:
var appid = "cead35c7-ad9b-46dc-9094-721186413931";
var clients = new Object(); // or var map = {};
var clientId ;

// create a client object using the App ID value from Step 2
var client = new brightstream.Client({
    appId: appid,
    developmentMode: true
});

// listen for the 'connect' event
client.listen('connect', function() {
    $("#status").html("Your Session is Connected");
});

function sendMessageFromSalesAgent(message){
	sendMessage(clientId, message);
}

// listen for incoming messages
client.listen('message', function(evt) {
	var ep = clients[evt.message.endpointId];
	if(evt.message.endpointId=="SalesAgent"){
		sendMessageFromSalesAgent(evt.message.message);
		return;
	}
	
	if(ep == undefined){
		ep = new Object();
		ep.state = "initialized"; //other states "live_chat", "closed"
		ep.id = evt.message.endpointId;
		ep.messages = [];
		clients[evt.message.endpointId] = ep;
		clientId = ep.id;//hardcoding for one client
	}
	if(ep.state == "live_chat"){//TODO passing the client id
		sendMessage("SalesAgent", evt.message.message);
	}else{
		ep.messages.push(evt.message.message);
		sendMessageToWit(evt.message.endpointId, evt.message.message);
	}
    $("#messages").append("<li> message from client "+evt.message.endpointId+" and the message is :: "+evt.message.message+"</li>");
});

function pushMessage(epId, message){
	var ep = clients[epId];
	ep.messages.push(message);
	sendMessage(epId, message);
	$("#messages").append("<li> reply from wit :: " + message + "</li>");
}

function initializeSalesChat(epId, message) {
	var ep = clients[epId];
	ep.state = "live_chat";
	if(ep != undefined){
		for(var i = 0; i < ep.messages.length; i++){
			sendMessage("SalesAgent", ep.messages[i]);
		}
	}
	//sendMessage("SalesAgent", message);
}

function getRelevantMessage(resp){
	
	if(resp.outcome != undefined && resp.outcome.intent != undefined && resp.outcome.intent == "sweaters"){
		if(resp.outcome != undefined && resp.outcome.entities != undefined && resp.outcome.entities.color != undefined ){
			if(resp.outcome.entities.color.value == "red"){
				return "You can find these at <a target='_blank' href='http://"+window.location.host+"?color=red'>"+'http://'+window.location.host+'?color=red </a>';
			}else if (resp.outcome.entities.color.value == "black"){
				return "You can find these at <a target='_blank' href='http://"+window.location.host+"?color=black'>"+'http://'+window.location.host+'?color=black </a>';
			}
		}
	}
}

function sendMessageToWit(epId, message){
	$.ajax({        
		url: "/wit?Body="+message ,
		type: 'GET',
		success: function (resp) {
			var relevantMessage = getRelevantMessage(resp);
			if (relevantMessage != undefined){
				pushMessage(epId, relevantMessage);
			} else{
				initializeSalesChat(epId, message);
			}
		},
		error: function(e){
			alert('Error: '+e);
		}  
	});	
}


function sendMessage(to, message){
    // make an endpoint for that recipient
    var endpoint = client.getEndpoint({"id" : to});
    // send it
    endpoint.sendMessage({"message" : message})
}

$("#sendMessage").click(function(){
    // get the recipient name
    var remote = $("#remoteId").val();
    // grab the text to send
    var messageText = $("#textToSend").val();

	sendMessage(remote, messageText);
});

// now connect when the user clicks the 'Connect' button
$("#doLogin").click(function() {
    var endpoint =  $("#endpoint").val();
    client.connect({
         endpointId: endpoint
    });
});
