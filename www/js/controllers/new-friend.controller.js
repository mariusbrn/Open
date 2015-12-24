(function () {
    'use strict';

    angular
        .module('Open.controllers')
        .controller('NewFriendController', NewFriendController);

    NewFriendController.$inject = ['$scope', '$ionicHistory', 'FriendsFactory'];
    /* @ngInject */
    function NewFriendController($scope, $ionicHistory, FriendsFactory) {
        var vm = this;
        var emptyFriend = {
            name: '',
            location: {},
            codes: [{id: 1, label: ''}],
            notes: ''
        };

        vm.addCode     = addCode;
        vm.removeCode  = removeCode;
        vm.isFormValid = isFormValid;
        vm.save        = save;
        vm.cancel      = cancel;

        activate();

        function activate () {
            vm.newFriend = emptyFriend;

            $scope.$watch('newFriend', function(newFriend){
                console.log('newFriend', vm.newFriend);
            });
        } 

        function addCode () {
            vm.newFriend.codes.push({id: vm.newFriend.codes.length+1,label: ''});
        } 

        function removeCode (index) {
            vm.newFriend.codes.splice(index, 1);
            vm.newFriend.codes.forEach(function(c, i) {c.id = i+1;});
        }  

        function isFormValid () {
           return vm.newForm.$valid;
        } 

        function save () {
            console.log(vm.newFriend)
            FriendsFactory.create(vm.newFriend);
            $ionicHistory.goBack();
        } 

        function cancel (index) {
            console.log("cancel");
            vm.newFriend = emptyFriend; 
            $ionicHistory.goBack();
        }                          
    }
})();