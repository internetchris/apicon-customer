var http = require('http');
var wit = require('./wit');
var url = require('url');

http.createServer(function (req, res) {
    if (req.url === '/favicon.ico') {
        return;
    }
    var queryObject = url.parse(req.url,true).query;
    var wit_request = wit.request_wit(queryObject.Body);

    wit_request.when(function(err, response) {
        if (err) console.log(err); // handle error here
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(response));
    });
}).listen(8766);

console.log('Server running at http://127.0.0.1:8766/');