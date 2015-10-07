
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'open.controllers' is found in controllers.js
angular.module('Open', ['ionic', 'ionic-material', 'Open.controllers', 'Open.services', 'Open.filters'])

.run(function($ionicPlatform, FriendsFactory, configFactory) {
  'use strict'; 
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

  configFactory.init();

  FriendsFactory.load();  
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
  'use strict';

  $ionicConfigProvider.navBar.alignTitle('center');

  if (ionic.Platform.isAndroid())
         $ionicConfigProvider.scrolling.jsScrolling(false);

  $stateProvider

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('search', {
    url: '/search',
    templateUrl: 'templates/search.html',
    controller: 'SearchCtrl'
  })

  .state('app.browse', {
      url: '/browse',
      views: {
        'menuContent': {
          templateUrl: 'templates/browse.html'
        }
      }
    })
    .state('app.friends', {
      url: '/friends',
      views: {
        'menuContent': {
          templateUrl: 'templates/friends.html',
          controller: 'FriendsCtrl'
        }
      }
    })

  .state('app.single', {
    url: '/friends/:friendId',
    views: {
      'menuContent': {
        templateUrl: 'templates/friend.html',
        controller: 'FriendCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/search');
})

.constant('_', window._);