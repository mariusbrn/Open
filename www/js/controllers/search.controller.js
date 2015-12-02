(function () {
    'use strict';

    angular
        .module('Open.controllers')
        .controller('SearchController', SearchController);

    SearchController.$inject = ['$scope', '$state', '$timeout', 'locationFactory', 'FriendsFactory', 'SettingsFactory'];
    /* @ngInject */
    function SearchController($scope, $state, $timeout, locationFactory, FriendsFactory, SettingsFactory) {
        var vm = this;

        vm.radius = 50;
        vm.radiusEnabled = true;
        vm.loaded = false;

        activate();

        function activate() {
            var config = SettingsFactory.get();
            vm.radius = config.radius;
            vm.radiusEnabled = config.radiusEnabled;

            $scope.$on('$ionicView.enter', function(e) {
                locationFactory.getCurrentPosition(20000).then( function(position){
                    console.log("location found");
                    FriendsFactory.calculateDistance(position.coords);
                    vm.loaded = true;
                    $timeout(function(){
                        console.log("gogo");
                        $state.go('friends'); 
                    },1200);  

                }, function (msg) {
                    vm.error = msg;
                });
            });
        }      
    }
})();