(function () {
    'use strict';

    angular
        .module('Open.controllers')
        .controller('FriendController', FriendController);

    FriendController.$inject = ['$scope',
        '$state',
        '$stateParams',
        '$ionicPlatform',
        '$ionicHistory',
        '$cordovaCamera',
        'FriendsFactory'];
    /* @ngInject */
    function FriendController($scope,
        $state,
        $stateParams,
        $ionicPlatform,
        $ionicHistory,
        $cordovaCamera,
        FriendsFactory)
    {
        var vm = this;
        var action = 'new';
        var emptyFriend = {
            name: '',
            location: {},
            codes: [{id: 1, label: ''}],
            notes: '',
            picture: 'https://pbs.twimg.com/profile_images/451007105391022080/iu1f7brY_400x400.png'
        };

        vm.addCode     = addCode;
        vm.removeCode  = removeCode;
        vm.getPicture  = getPicture;
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

         function getPicture () {

            var options = {
                quality: 50,
                // targetWidth: 120,
                // targetHeight: 120,
                destinationType: Camera.DestinationType.FILE_URI,
                sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
                mediaType: Camera.MediaType.PICTURE,
                saveToPhotoAlbum: true
            };

            $ionicPlatform.ready(function () {
                $cordovaCamera.getPicture(options).then(function(imageData) {
                    console.log("img URI= " + imageData);        
                    vm.newFriend.picture = imageData;
                }, function(err) {
                    alert("Failed because: " + err);
                    console.log('Failed because: ' + err);
                });
            });

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