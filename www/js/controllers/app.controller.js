(function () {
    'use strict';

    angular
        .module('Open.controllers')
        .controller('AppController', AppController);


    AppController.$inject = ['$scope', '$state'];
    /* @ngInject */
    function AppController($scope, $state) {
        var main = this;
        
        main.state = $state; 
    }
})();