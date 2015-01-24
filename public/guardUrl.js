(function () {
    'use strict';

    var filterName = 'guardUrl';

    var log = debug(filterName + ':log');

    angular.module('urlShortener')
        .filter(filterName, function () {
            return function (input) {
                var out = input;

                if (!out.match(/http:\/\/|https:\/\//)) {
                    out = 'http://' + out;
                }

                return out;
            };
        });
})();