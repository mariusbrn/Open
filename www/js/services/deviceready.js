(function () {
    'use strict';

    angular
        .module('Open.services')
        .factory('deviceReady', deviceReady);

    deviceReady.$inject = ['$q'];
    /* @ngInject */
    function deviceReady($q) {
        var ready = false;
        var deferred = $q.defer();

        if (typeof window.cordova === 'object' && !ready) {
            document.addEventListener('deviceready', function () {
                ready = true;
                deferred.resolve();
            }, false);
        } else {
            deferred.resolve();
        }

        return deferred.promise;      
    }
})();
