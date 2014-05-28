// here's the App ID value from the portal:
var appid = "cead35c7-ad9b-46dc-9094-721186413931";

// create a client object using the App ID value from Step 2
var client = new brightstream.Client({
  appId: appid,
  developmentMode: true,
  onCall: function (evt) {
     if (evt.call.initiator === true) {return;}
     var call = evt.call;
     evt.call.answer({constraints: {audio: true, video: true}});
  }
});

// listen for the 'connect' event
client.listen('connect', function() {
    $("#status").html("You are now connected Sweater Support!");
});

// listen for incoming messages
client.listen('message', function(evt) {
    $("#messages").append("<li>"+evt.message.message+"</li>");
});
console.log("loaded");

// now connect when the user clicks the 'Connect' button
$("#doLogin").click(function() {
    var endpoint =  $("#endpoint").val();
    client.connect({
     	endpointId: endpoint
    });
});


// send a message to the far-end party
$("#sendMessage").click(function(){
    // get the recipient name
    var remote = $("#remoteId").val();
    // make an endpoint for that recipient
    var endpoint = client.getEndpoint({"id" : remote});
    // grab the text to send
    var messageText = $("#textToSend").val();
    // send it
    endpoint.sendMessage({"message" : messageText});
});

// Create a call
$("#makeCall").click(function() {
    var endpoint = client.getEndpoint({"id" : $("#remoteId").val()});
    endpoint.call({constraints: {audio: true, video: false}});
});

// Hang up the call
$("#endCall").click(function() {
    var call = client.getCalls()[0];
    call.hangup();
});