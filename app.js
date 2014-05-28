var express = require("express"),
  app = express(),
  server = app.listen(process.env.PORT || 3000);


var wit = require('./client/js/wit');
var url = require('url');
var request = require('request');
var db = require('orchestrate')("d930f037-8028-4643-9fd7-b521cd6f6788");


  app.set("view options", {layout: false});
  app.engine("html", require("ejs").renderFile);
  app.use(express.static(__dirname + "/client"));

app.get("/", function(req, res) {
  res.render("../client/index.ejs");
});

app.get("/broker", function(req, res) {
  res.render("../client/broker.ejs");
});

app.get("/agent", function(req, res) {
  res.render("../client/agent.ejs");
});

app.get("/wit", function(req, res){
  var queryObject = url.parse(req.url,true).query;
    var wit_request = wit.request_wit(queryObject.Body);

    wit_request.when(function(err, response) {
        if (err) console.log(err); // handle error here
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(response));
    });
});

app.get("/message", function(req, res) {
  db.put('collection', 'latestChat', {
  "message": req.query.message,
  }).then(function (result) {
    console.log("successful orchestrate post");
    }).fail(function (err) {

  })
})


app.get("/getty", function(req, res) {
  var options = {
    url: 'http://connect.gettyimages.com/cr1/images?phrase='+req.query.search.replace(" ", "%20"),
    headers: {
        'Api-Key': 'mzqtmcrk8bpsx9jfr9c9y47x'
    }
  };
  function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
        var info = JSON.parse(body);
        res.json(info);
    }
  }
  request(options, callback);
});

console.log('Server running at http://turle.com:3000/');