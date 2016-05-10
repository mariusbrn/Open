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
        '$cordovaSplashscreen',
        '_',
        'ionicMaterialInk',
        'ionicMaterialMotion',
        'locationFactory',
        'FriendsFactory',
        'AmplitudeFactory',
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
        $cordovaSplashscreen,
        _,
        ionicMaterialInk,
        ionicMaterialMotion,
        locationFactory,
        FriendsFactory,
        AmplitudeFactory,
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
        vm.share   = shareFriend;
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

            $scope.$parent.dragContent = false;

            //FriendsFactory.clear();
            vm.friends = FriendsFactory.friends;

            $scope.$on('$ionicView.enter', function(e) {
                FriendsFactory.calculateDistance(locationFactory.currentPosition.coords);
            });

            $rootScope.$on('$stateChangeStart',
                function(event, toState, toParams, fromState, fromParams) {
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

                //$scope.scheduleNotification();
                if (navigator.splashscreen) {
                    $timeout(function () {
                        $cordovaSplashscreen.hide();
                        // Set Ink
                        ionicMaterialInk.displayEffect();
                        ionicMaterialMotion.fadeSlideInRight();
                    }, 600);
                }                
            });
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

        function editFriend (friend) {
            $ionicListDelegate.closeOptionButtons();
            $state.go('edit', {id: friend.id}, {location: 'replace'});
        }

        function shareFriend (friend) {

        }        
    }
})();
