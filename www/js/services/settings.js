(function () {
    'use strict';

    angular
        .module('Open.services')
        .factory('SettingsFactory', SettingsFactory);

    SettingsFactory.$inject = ['$window', '$localstorage'];
    /* @ngInject */
    function SettingsFactory($window, $localstorage) {
        var service = {
            getFromStorage: getFromStorage,
            setInStorage: setInStorage,
            get: get,
            set: set,
            init: init
        };

        var defaultUserConfig = {
          radius: 50,
          radiusEnabled: true
        };

        return service;

        // ====================================

        function setInStorage(config) {
            $localstorage.setObject( 'config', config);           
        }

        function getFromStorage() {
          var config = $localstorage.getObject( 'config' );

          return config;
        }

        function get() {
          return defaultUserConfig;
        }

        function set(config) {
            if( config !== null && config !== undefined) {
              defaultUserConfig = config;   
              setInStorage(config);
            }           
        }

        function init() {
            var c = getFromStorage();
            if( c === null || c === undefined) {
              setInStorage(defaultUserConfig);
            } else {
              defaultUserConfig = c;
            }
        }
    }
})();
