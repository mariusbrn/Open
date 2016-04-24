
(function () {
    'use strict';

    angular.module('Open')
      .run(function($ionicPlatform, FriendsFactory, SettingsFactory, AmplitudeFactory) {
 
      $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
          cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
          // org.apache.cordova.statusbar required
          StatusBar.styleDefault();
        }
      });

      SettingsFactory.init();

      AmplitudeFactory.init();

      FriendsFactory.load();
    })

    .constant('appConfig', {
      // app version number
      'version': '0.6.1',

      // api key for tracking
      'amplitudeApiKey': '868bce7777d5c7fef2e1cd586a0dc33d'
    })
    
    // lodash
    .constant('_', window._);

})();