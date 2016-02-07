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
        '$ionicListDelegate',
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
        $ionicListDelegate,
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