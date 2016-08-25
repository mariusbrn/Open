
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
    '$cordovaSocialSharing',
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
    $cordovaSocialSharing,
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

        $ionicPlatform.ready(function() {

            if(! $window.cordova) return;

            $cordovaLocalNotification.hasPermission().then(function(result) {
                //console.log(result);
            });

            $rootScope.$on('$cordovaLocalNotification:schedule',
            function(event, notification, state) {
              console.log('schedule');
            });

            $rootScope.$on('$cordovaLocalNotification:trigger',
            function(event, notification, state) {
              console.log('trigger');
            });

            // ========== Scheduling
            $scope.scheduleNotification = function() {
              $cordovaLocalNotification.schedule({
                id: 1,
                title: 'My notification title 71A37',
                text: 'bla bla bla... Zzz...Zzz..',
                icon: 'file://img/ionic.png'
              }).then(function(result) {
                console.log('gogo notif');
              });
            };

            //$scope.scheduleNotification();
            if (navigator.splashscreen) {
                $scope.$on('$ionicView.loaded', function(e) {
                    $timeout(function() {
                        $cordovaSplashscreen.hide();
                        // Set Ink
                        ionicMaterialInk.displayEffect();
                        ionicMaterialMotion.fadeSlideInRight();
                    }, 600);
                });
            }
        });
    }

    function reload() {
        locationFactory.getCurrentPosition(20000).then(function(position) {
            FriendsFactory.calculateDistance(locationFactory.currentPosition.coords);
        }, function(msg) {
            vm.error = msg;
        })
        .finally(function() {
            $scope.$broadcast('scroll.refreshComplete');
        });
    }

    function editFriend (friend) {
        $ionicListDelegate.closeOptionButtons();
        $state.go('edit.details', {id: friend.id}, {location: 'replace'});
    }

    function shareFriend (friend) {
        var formattedSharingContent = formatForSharing(friend);

        $cordovaSocialSharing
        .share(formattedSharingContent.content, formattedSharingContent.subject)
        .then(function(result) {
            console.log(result);
        }, function(err) {
            console.log('Sharing', err);
        });
    }

    function formatForSharing (friend) {
        var contentInfos = [
            friend.name,
            friend.location.formatted_address,
            'Codes: ' + _(friend.codes).map('label').join(' - '),
        ];

        if (friend.notes) contentInfos.push('Notes: ' + friend.notes);
        contentInfos.push('Shared with Open http://getopen.co/');

        var content = contentInfos.join('\n');

        var subject = friend.name + '\'s code  - shared with Open';

        return {
            subject: subject,
            content: content
        };
    }
}

