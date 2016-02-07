
(function () {
    'use strict';

    angular.module('Open')
      .run(function($ionicPlatform, FriendsFactory, SettingsFactory) {
 
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

      FriendsFactory.load();
    })

    .constant('_', window._);
})();