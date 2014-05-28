// here's the App ID value from the portal:
var appid = "cead35c7-ad9b-46dc-9094-721186413931";
var clients = new Object(); // or var map = {};

// create a client object using the App ID value from Step 2
var client = new brightstream.Client({
    appId: appid,
    developmentMode: true
});

// listen for the 'connect' event
client.listen('connect', function() {
    $("#status").html("Broker connected to Brightstream!");
});

// listen for incoming messages
client.listen('message', function(evt) {
	var ep = clients[evt.message.endpointId];
	if(ep == undefined){
		ep = new Object();
		ep.id = evt.message.endpointId;
		ep.messages = [];
		clients[evt.message.endpointId] = ep;
	}
	ep.messages.push(evt.message.message);
	var returnedMesg = sendMessageToWit(evt.message.message);
	ep.messages.push(returnedMesg)
    $("#messages").append("<li> message from client "+evt.message.endpointId+" and the message is :: "+evt.message.message+"</li>");
	$("#messages").append("<li> reply from wit :: " + returnedMesg + "</li>");
});

function sendMessageToWit(message){
	sendMessage('wit', message);
	return "returned "+ message;
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