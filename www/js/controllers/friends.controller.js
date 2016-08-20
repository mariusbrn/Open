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
        let vm = this;
        let mapAPI, myLocation, myMarker, map;

        vm.$state = $state;
        vm.predicate = 'distance';
        vm.friends = [];
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

            $scope.$on('$ionicParentView.enter', (e) => {
                FriendsFactory.calculateDistance(locationFactory.currentPosition.coords);
            });

            $ionicPlatform.ready(() => {

                if(! $window.cordova) return;

                console.log('check permission');
                $cordovaLocalNotification.hasPermission().then((result) => {
                    console.log(result);
                });

                $rootScope.$on('$cordovaLocalNotification:schedule',
                (event, notification, state) => {
                  console.log('schedule');
                });

                $rootScope.$on('$cordovaLocalNotification:trigger',
                (event, notification, state) => {
                  console.log('trigger');
                });

                // ========== Scheduling
                $scope.scheduleNotification = () => {
                  $cordovaLocalNotification.schedule({
                    id: 1,
                    title: 'My notification title 71A37',
                    text: 'bla bla bla... Zzz...Zzz..',
                    icon: 'file://img/ionic.png'
                  }).then((result) => {
                    console.log('gogo notif');
                  });
                };

                //$scope.scheduleNotification();
                if (navigator.splashscreen) {
                    $timeout(() => {
                        $cordovaSplashscreen.hide();
                        // Set Ink
                        ionicMaterialInk.displayEffect();
                        ionicMaterialMotion.fadeSlideInRight();
                    }, 600);
                }                
            });
        }

        function reload() {
            locationFactory.getCurrentPosition(20000).then((position) => {
                FriendsFactory.calculateDistance(locationFactory.currentPosition.coords);
            }, (msg) => {
                vm.error = msg;
            })
            .finally(() => {
                $scope.$broadcast('scroll.refreshComplete');
            });
        }

        function editFriend (friend) {
            $ionicListDelegate.closeOptionButtons();
            $state.go('edit.details', {id: friend.id}, {location: 'replace'});
        }

        function shareFriend (friend) {

        }        
    }
})();
