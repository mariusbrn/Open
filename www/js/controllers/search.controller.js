(function () {
    'use strict';

    angular
        .module('Open.controllers')
        .controller('SearchController', SearchController);

    SearchController.$inject = ['$scope', '$state', '$timeout', '$ionicHistory', '$cordovaSplashscreen', 'locationFactory', 'SettingsFactory'];
    /* @ngInject */
    function SearchController($scope, $state, $timeout, $ionicHistory, $cordovaSplashscreen, locationFactory, SettingsFactory) {
        var vm = this;

        vm.radius = 50;
        vm.radiusEnabled = true;
        vm.loaded = false;

        activate();

        function activate() {
            var config = SettingsFactory.get();
            vm.radius = config.radius;
            vm.radiusEnabled = config.radiusEnabled;

            $ionicHistory.nextViewOptions({
              disableBack: true,
              historyRoot: true
            });

            $scope.$on('$ionicView.enter', function(e) {
                locationFactory.getCurrentPosition(20000).then( function(position){
                    console.log("location found");
                    $state.go('friends.nearby', null, {location: 'replace'});
                    $timeout(function(){
                        $cordovaSplashscreen.hide();
                    }, 500);
                }, function (msg) {
                    vm.error = msg;
                });
            });
        }
    }
})();
