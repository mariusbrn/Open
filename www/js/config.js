
angular.module('Open')
  .run(($ionicPlatform, $state, FriendsFactory, SettingsFactory, AmplitudeFactory) => {

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

    $ionicPlatform.registerBackButtonAction(function(e){
      if($state.current.name == 'friends') {
        backAsHome.trigger();
        e.preventDefault();
      } else {
        navigator.app.backHistory();
      }
    },101);     
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

