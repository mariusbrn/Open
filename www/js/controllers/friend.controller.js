(function () {
    'use strict';

    angular
        .module('Open.controllers')
        .controller('FriendController', FriendController);

    FriendController.$inject = ['$scope', '$state', '$stateParams', '$ionicHistory', 'FriendsFactory'];
    /* @ngInject */
    function FriendController($scope, $state, $stateParams, $ionicHistory, FriendsFactory) {
        var vm = this;
        var action = 'new';
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

        $scope.$on('$ionicView.enter', function(e) {
            activate();         
        }); 

        function activate () {
            if ($stateParams.id) {
                action = 'edit';
                vm.newFriend = FriendsFactory.get($stateParams.id);
                vm.title = 'EDIT CONTACT';
            } else {
                vm.newFriend = emptyFriend;
                vm. title = 'NEW CONTACT';
            }
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
            if(action === 'edit'){
                FriendsFactory.update(vm.newFriend);
            } else {
                FriendsFactory.create(vm.newFriend);
            }
            $ionicHistory.goBack();
        } 

        function cancel (index) {
            console.log("cancel");
            vm.newFriend = emptyFriend; 
            $ionicHistory.goBack();
        }                          
    }
})();