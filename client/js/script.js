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


  var html,
  images,
  url;
 
if (window.location.search.indexOf('color=black') > -1) {
    url = "/getty?search=black%20winter%20sweater";
    $(".heading1").html("Black is the new black");
    $(".heading2").html("MIB Sexy");
    $(".heading3").html("When you go black...");
} else if (window.location.search.indexOf('color=red') > -1) {
    url = "/getty?search=red%20turtle%20neck%20sweater";
    $(".heading1").html("Henry's Special");
    $(".heading2").html("Rabbit Trap");
    $(".heading3").html("Turtle by the Bay");
}else {
    url = "/getty?search=red%20turtle%20neck%20sweater";
    $(".heading1").html("Turtle What?!");
    $(".heading2").html("Turtle please?!");
    $(".heading3").html("Check Yo Neck!");
}

  $.ajax({
    type: "GET",
    url: url,
    dataType: "json",
    success: function (data) {
      images = data.Images;
      var randomize = function(arr) {
        for(var j, x, i = arr.length; i; j = parseInt(Math.random() * i), x = arr[--i], arr[i] = arr[j], arr[j] = x);
        return arr;
      };
      $.map(randomize(images), function( val, i ) {
        console.log(val.ThumbnailUrl);
        $("#red" + i).append("<img src='" + val.ThumbnailUrl + "'>");
      });
    },
    error: function (err) {
      console.err("error", err);
    }
  });
 
 



