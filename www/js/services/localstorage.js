(function () {
    'use strict';

    angular
        .module('Open.utils')
        .factory('$localstorage', $localstorage);

    $localstorage.$inject = ['$window'];
    /* @ngInject */
    function $localstorage($window) {
        var service = {
            getObject: getObject,
            setObject: setObject,
            get: get,
            set: set
        };

        return service;

        // ====================================

        function set(key, value) {
            $window.localStorage[key] = value;
        }
        function get(key, defaultValue) {
          return $window.localStorage[key] || defaultValue;
        }
        function setObject(key, value) {
          $window.localStorage[key] = JSON.stringify(value);
        }
        function getObject(key) {
          return JSON.parse($window.localStorage[key] || '{}');
        }
    }
})();
