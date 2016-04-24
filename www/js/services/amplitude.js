(function () {
  'use strict';

  angular
      .module('Open.services')
      .factory('AmplitudeFactory', AmplitudeFactory);

  AmplitudeFactory.$inject = ['$amplitude', '$rootScope', '$ionicPlatform', '$cordovaDevice', 'appConfig'];
  /* @ngInject */
  function AmplitudeFactory($amplitude, $rootScope, $ionicPlatform, $cordovaDevice, appConfig) {
    var service = {
      init: init,
      logEvent: logEvent,
      identifyUser: identifyUser
    };

    return service;

    // ====================================

    function init() {

      $ionicPlatform.ready(function(){

        try {
          var deviceProperties = $cordovaDevice.getDevice(); 
          $amplitude.init(appConfig.amplitudeApiKey, deviceProperties.UUID, null, function() {
            var identify = new amplitude.Identify();
            $amplitude.identify(identify);
            $amplitude.setUserProperties(deviceProperties);
            $amplitude.setVersionName(appConfig.version);
          });

          $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
            logEvent('state', {toState: toState.name, fromState: fromState.name});
          }); 
        }
        catch (err) {
          console.log(err);
        }
      });     
    }

    function identifyUser(userId, userProperties) {
      $amplitude.setUserId(userId);
      $amplitude.setUserProperties(userProperties);
    }

    function logEvent(eventName, params) {
      $amplitude.logEvent(eventName, params);
    }
  }
})();
