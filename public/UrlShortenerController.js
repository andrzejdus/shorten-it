(function () {
    'use strict';

    var log = debug('UrlShortenerController:log');

    function getRandomString() {
        var randomString = '';
        var allowedChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (var i = 0; i < 5; i++) {
            randomString += allowedChars.charAt(Math.floor(Math.random() * allowedChars.length));
        }

        return randomString;
    }

    angular.module('urlShortener').controller('UrlShortenerController', ['$scope', '$location', '$firebase',
        function ($scope, $location, $firebase) {
            var shortUrlsRef = new Firebase('https://blazing-inferno-199.firebaseio.com/shortUrls');
            var sync = $firebase(shortUrlsRef.orderByChild('addedTimestamp'));

            var shortPath = getRandomString();
            $scope.shortPath = shortPath;

            $scope.addUrl = function () {
                var originalUrl = $scope.originalUrl;

                log('Saving URL', originalUrl, shortPath);

                shortUrlsRef.child(shortPath).set({
                    addedTimestamp: Firebase.ServerValue.TIMESTAMP,
                    originalUrl: originalUrl,
                    visitsCount: 0
                });

                shortPath = getRandomString();
                $scope.shortPath = shortPath;
            };

            $scope.urlLengthLimit = 30;
            $scope.host =
                $location.protocol() + '://' +
                $location.host() +
                ($location.port() !== 80 ? ':' + $location.port() : '') + '/';

            $scope.urls = sync.$asArray();
        }
    ]);
})();

