'use strict';

angular.module('Open.controllers', ['ionic', 'uiGmapgoogle-maps'])

.config(['uiGmapGoogleMapApiProvider', function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        //    key: 'your api key',
        v: '3.17',
        libraries: 'weather,geometry,visualization,places'
      });
  }])

.controller('AppCtrl', ['$scope', '$ionicModal', '$timeout', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});


  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
}])


.controller('SearchCtrl', ['$scope', '$state', '$log', 'locationFactory', 'FriendsFactory', 'configFactory', function($scope, $state, $log, locationFactory, FriendsFactory, configFactory) {
    var config = configFactory.get();
    $scope.radius = config.radius;
    $scope.radiusEnabled = config.radiusEnabled;

    $scope.$on('$ionicView.enter', function(e) {
      locationFactory.getCurrentPosition(20000).then( function(position){
          FriendsFactory.calculateDistance(position.coords);
          $state.go('app.friends');  

        }, function (msg) {
          $scope.error = msg;
        });
    });

  }])


.controller('FriendsCtrl', ['$scope', '$state', '$timeout', 'ionicMaterialInk', 'ionicMaterialMotion', 'locationFactory', 'FriendsFactory', 'uiGmapGoogleMapApi', function($scope, $state, $timeout, ionicMaterialInk, ionicMaterialMotion, locationFactory, FriendsFactory, uiGmapGoogleMapApi) {

  if(locationFactory.currentPosition === null) {
    $state.go('search'); 
  }

  $scope.predicate = 'distance';

  // Set Motion
  $timeout(function () {
      ionicMaterialMotion.fadeSlideInRight();
  }, 300);

  // Set Ink
  ionicMaterialInk.displayEffect();

  $scope.friends = FriendsFactory.friends;
  $scope.friends.forEach(function(f) { f.icon = 'img/contacts.png';});

  var mapAPI;
  uiGmapGoogleMapApi.then(function(maps) { 
      mapAPI = maps;        
  });

  var myLocation = locationFactory.currentPosition;
  $scope.myMarker = {
    coords: { latitude: myLocation.coords.latitude , longitude: myLocation.coords.longitude },
    id: "me"
  };

  $scope.map = { 
      center: { latitude: myLocation.coords.latitude , longitude: myLocation.coords.longitude }, 
      zoom: 14,
      control: {}, 
      options: {
            disableDefaultUI: true
      }
  };

  $scope.showMap = function() {
    this.predicate = 'map';
    var controlGmap = $scope.map.control.getGMap();
    $timeout(function(){    
      mapAPI.event.trigger(controlGmap, 'resize');
      controlGmap.setCenter(new mapAPI.LatLng(myLocation.coords.latitude, myLocation.coords.longitude));   
    },400);  
  };
                                     
}])

.controller('FriendCtrl', ['$scope', '$stateParams', function($scope, $stateParams) {
}]);
