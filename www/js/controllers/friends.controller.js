(function () {
    'use strict';

    angular
        .module('Open.controllers')
        .controller('FriendsController', FriendsController);

    FriendsController.$inject = [
        '$scope',
        '$rootScope', 
        '$state', 
        '$timeout',
        '$window',
        '$ionicPlatform',
        '$ionicListDelegate',
        '$cordovaLocalNotification',
        '_',
        'ionicMaterialInk',
        'ionicMaterialMotion',
        'locationFactory', 
        'FriendsFactory',
        'uiGmapGoogleMapApi'];

    /* @ngInject */
    function FriendsController(
        $scope,
        $rootScope,
        $state,
        $timeout,
        $window,
        $ionicPlatform,
        $ionicListDelegate,
        $cordovaLocalNotification,
        _,
        ionicMaterialInk,
        ionicMaterialMotion,
        locationFactory,
        FriendsFactory,
        uiGmapGoogleMapApi) 
    {
        var vm = this;     
        var mapAPI, myLocation, myMarker, map;

        vm.$state = $state;
        vm.predicate = 'distance';
        vm.friends = [];
        vm.showMap = showMap;
        vm.reload  = reload;
        vm.edit    = editFriend;
        vm.delete  = deleteFriend;
        vm.myMarker = {
            coords: {},
            id: "me"
        };
        vm.map = { 
          center: {}, 
          zoom: 14,
          control: {}, 
          options: {
                disableDefaultUI: true
          }
        };

        activate();

        function activate() {
            // if(locationFactory.currentPosition === null) 
            //     return $state.go('search'); 
            
            $scope.$parent.dragContent = false;


            // Set Ink
            ionicMaterialInk.displayEffect();

            //FriendsFactory.clear();
            vm.friends = FriendsFactory.friends;
            console.log("FRIENDS",vm.friends)
            //             //Set Motion
            // $timeout(function () {
            //   if(!_.isEmpty(vm.friends)) ionicMaterialMotion.fadeSlideInRight();
            // }, 400);

            $scope.$on('$ionicView.enter', function(e) {
                console.log(locationFactory.currentPosition.coords)
                FriendsFactory.calculateDistance(locationFactory.currentPosition.coords);           
            });        

            $rootScope.$on('$stateChangeStart', 
                function(event, toState, toParams, fromState, fromParams){ 
                    switch (toState.name) {
                        case 'friends.nearby': 
                            vm.predicate = 'distance';
                            break;
                        case 'friends.byname':
                            vm.predicate = 'name';
                            break;
                    }

                    console.log(vm.predicate)
            });

            // uiGmapGoogleMapApi.then(function(maps) { 
            //     mapAPI = maps;        
            // });

            // myLocation = locationFactory.currentPosition;

            // if(!_.isNull(myLocation) ) {
            //     vm.myMarker.coords.latitude = myLocation.coords.latitude;                       
            //     vm.myMarker.coords.longitude = myLocation.coords.longitude;

            //     vm.map.center.latitude = myLocation.coords.latitude;                       
            //     vm.map.center.longitude = myLocation.coords.longitude;
            // }   
            $ionicPlatform.ready(function () {

                if(! $window.cordova) return;

                console.log('check permission');
                $cordovaLocalNotification.hasPermission().then(function (result) {
                    console.log(result)
                });

                $rootScope.$on('$cordovaLocalNotification:schedule',
                function (event, notification, state) {
                  console.log('schedule');
                });

                $rootScope.$on('$cordovaLocalNotification:trigger',
                function (event, notification, state) {
                  console.log('trigger');
                });

                // ========== Scheduling
                $scope.scheduleNotification = function () {
                  $cordovaLocalNotification.schedule({
                    id: 1,
                    title: 'My notification title 71A37',
                    text: 'bla bla bla... Zzz...Zzz..',
                    icon: 'file://img/ionic.png'
                  }).then(function (result) {
                    console.log('gogo notif')
                  });
                };

                $scope.scheduleNotification();
            });

            // $scope.scheduleMultipleNotifications = function () {
            //   $cordovaLocalNotification.schedule([
            //     {
            //       id: 1,
            //       title: 'Title 1 here',
            //       text: 'Text 1 here',
            //       data: {
            //         customProperty: 'custom 1 value'
            //       }
            //     },
            //     {
            //       id: 2,
            //       title: 'Title 2 here',
            //       text: 'Text 2 here',
            //       data: {
            //         customProperty: 'custom 2 value'
            //       }
            //     },
            //     {
            //       id: 3,
            //       title: 'Title 3 here',
            //       text: 'Text 3 here',
            //       data: {
            //         customProperty: 'custom 3 value'
            //       }
            //     }
            //   ]).then(function (result) {
            //     // ...
            //   });
            // };

            // $scope.scheduleDelayedNotification = function () {
            //   var now = new Date().getTime();
            //   var _10SecondsFromNow = new Date(now + 10 * 1000);

            //   $cordovaLocalNotification.schedule({
            //     id: 1,
            //     title: 'Title here',
            //     text: 'Text here',
            //     at: _10SecondsFromNow
            //   }).then(function (result) {
            //     // ...
            //   });
            // };

            // $scope.scheduleEveryMinuteNotification = function () {
            //   $cordovaLocalNotification.schedule({
            //     id: 1,
            //     title: 'Title here',
            //     text: 'Text here',
            //     every: 'minute'
            //   }).then(function (result) {
            //     // ...
            //   });
            // };                              
        } 

        function reload() {
            locationFactory.getCurrentPosition(20000).then( function(position){
                console.log('reloaded');
                FriendsFactory.calculateDistance(locationFactory.currentPosition.coords);
            }, function (msg) {
                vm.error = msg;
            })
            .finally(function () {
                $scope.$broadcast('scroll.refreshComplete');
            });
        }

        function showMap() {

            vm.predicate = 'map';

            // var controlGmap = vm.map.control.getGMap();

            // $timeout(function(){    
            //   mapAPI.event.trigger(controlGmap, 'resize');
            //   controlGmap.setCenter(new mapAPI.LatLng(myLocation.coords.latitude, myLocation.coords.longitude));   
            // },400);  

        }

        function deleteFriend (friend) {
            $ionicListDelegate.closeOptionButtons();
            FriendsFactory.delete(friend);
        }  

        function editFriend (friend) {
            $ionicListDelegate.closeOptionButtons();
            $state.go('edit', {id: friend.id}, {location: 'replace'}); 
        }          
    }
})();