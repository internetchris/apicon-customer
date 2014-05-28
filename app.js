var express = require("express"),
  app = express(),
  server = app.listen(process.env.PORT || 8766);


var wit = require('./client/js/wit');
var url = require('url');
var curl = require('node-curl');
var request = require('request');



  app.set("view options", {layout: false});
  app.engine("html", require("ejs").renderFile);
  app.use(express.static(__dirname + "/client"));

app.get("/", function(req, res) {
  res.render("../client/index.ejs");
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

console.log('Server running at http://127.0.0.1:8766/');