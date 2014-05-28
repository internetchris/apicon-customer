var https = require('https');
var Future = require('futures').future;

var request_wit = function(user_text) {
    var future = Future.create();
    var options = {
        host: 'api.wit.ai',
        path: '/message?q=' + encodeURIComponent(user_text),
        // the Authorization header allows you to access your Wit.AI account
        // make sure to replace it with your own
        // the Accept header allows to request a specific version of the API
        // make sure to replace the YYYYMMDD with the version date you wanted
        headers: {'Authorization': 'Bearer WMMHARA4XQWSZJD4YLTZQLGQDOTE6VZE',
                  'Accept': 'application/vnd.wit.20140527'}
    };

    https.request(options, function(res) {
        var response = '';

        res.on('data', function (chunk) {
            response += chunk;
        });

        res.on('end', function () {
            future.fulfill(undefined, JSON.parse(response));
        });
    }).on('error', function(e) {
        future.fulfill(e, undefined);
    }).end();

    return future;
}

module.exports.request_wit = request_wit;