(function () {
    'use strict';

    angular
        .module('Open.controllers')
        .controller('SearchController', SearchController);

    SearchController.$inject = ['$scope', '$state', 'locationFactory', 'FriendsFactory', 'SettingsFactory'];
    /* @ngInject */
    function SearchController($scope, $state, locationFactory, FriendsFactory, SettingsFactory) {
        var vm = this;

        vm.radius = 50;
        vm.radiusEnabled = true;

        activate();

        function activate() {
            var config = SettingsFactory.get();
            vm.radius = config.radius;
            vm.radiusEnabled = config.radiusEnabled;

            $scope.$on('$ionicView.enter', function(e) {
                locationFactory.getCurrentPosition(20000).then( function(position){

                    FriendsFactory.calculateDistance(position.coords);

                    $state.go('app.friends'); 

                }, function (msg) {
                    vm.error = msg;
                });
            });
        }      
    }
})();