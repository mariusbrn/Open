(function () {
    'use strict';

    angular
        .module('Open.controllers')
        .controller('FriendController', FriendController);

    FriendController.$inject = ['$scope', '$stateParams'];
    /* @ngInject */
    function FriendController($scope, $stateParams) {
        var vm = this;

        activate();

        function activate() {

        }      
    }
})();