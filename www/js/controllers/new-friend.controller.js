(function () {
    'use strict';

    angular
        .module('Open.controllers')
        .controller('NewFriendController', NewFriendController);

    NewFriendController.$inject = ['$scope', '$ionicHistory'];
    /* @ngInject */
    function NewFriendController($scope, $ionicHistory) {
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
        vm.save       = save;
        vm.cancel     = cancel;

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

        function save () {
            console.log("save");

        } 

        function cancel (index) {
            console.log("cancel");
            $ionicHistory.goBack();
        }                          
    }
})();