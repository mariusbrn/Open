(function () {
    'use strict';

    angular
        .module('Open.controllers')
        .controller('NewFriendController', NewFriendController);

    NewFriendController.$inject = ['$scope'];
    /* @ngInject */
    function NewFriendController($scope) {
        var vm = this;
        vm.user = {
            name: '',
            address: '', 
            codes: [{label: ''}],
            notes: ''
        };

        vm.locateMe   = locateMe;
        vm.addCode    = addCode;
        vm.removeCode = removeCode;

        activate();

        function activate () {
            console.log(vm.user);
        } 

        function locateMe () {

        } 

        function addCode () {
            vm.user.codes.push({label: ''});
        } 

        function removeCode (index) {
            vm.user.codes.splice(index, 1);
        }           
    }
})();