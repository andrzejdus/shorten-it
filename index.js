var Firebase = require('firebase');
var express = require('express');

var app = express();
var shortUrlsRef = new Firebase('https://blazing-inferno-199.firebaseio.com/shortUrls');

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/custom_components'));

app.get('*', function (request, response) {
    console.log(request.path);
    var shortPath = request.path.replace('/', '');
    console.log('Requested short path is: ' + shortPath);

    shortUrlsRef.child(shortPath).once('value', function (snapshot) {
        if (!snapshot.exists()) {
            var message = 'Short ' + shortPath + ' not found';

            console.log(message);
            response.send(message);

            return;
        }

        var orginalUrl = snapshot.val().originalUrl;
        var visitsCount = parseInt(snapshot.val().visitsCount);

        if (!orginalUrl.match(/http:\/\/|https:\/\//)) {
            orginalUrl = 'http://' + orginalUrl;
        }

        shortUrlsRef.child(shortPath).update({
            visitsCount: ++visitsCount
        });

        console.log('Redirecting to: ' + orginalUrl);
        response.writeHead(301, {
            'Location': orginalUrl,
            'Cache-Control': 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0'
        });
        response.end();
    }, function (errorObject) {
        var message = 'The read failed: ' + errorObject.code;

        console.log(message);
        response.send(message);
    });
});

app.listen(app.get('port'), function () {
    console.log('App is running at port ' + app.get('port'));
});