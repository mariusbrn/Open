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
        '$cordovaToast',
        'FriendsFactory'];
    /* @ngInject */
    function FriendController($scope,
        $state,
        $stateParams,
        $ionicPlatform,
        $ionicHistory,
        $cordovaCamera,
        $cordovaToast,
        FriendsFactory)
    {
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
        vm.getPicture  = getPicture;
        vm.save        = save;
        vm.cancel      = cancel;
        vm.isSaving = false;

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
                targetWidth: 180,
                targetHeight: 180,
                allowEdit : true,
                correctOrientation : true,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
                encodingType: Camera.EncodingType.JPEG,
                mediaType: Camera.MediaType.PICTURE,
                saveToPhotoAlbum: true
            };

            $ionicPlatform.ready(function () {
                $cordovaCamera.getPicture(options).then(function(imageData) {
                    console.log("img URI= " + imageData);        
                    vm.newFriend.picture = imageData;
                }, function(err) {
                    //alert("Failed because: " + err);
                    console.log('Failed because: ' + err);
                });
            });
        }

        function save () {
            vm.isSaving = true;
            console.log(vm.newForm.$valid);
            if(vm.newForm.$valid) {                
                if(action === 'edit'){
                    FriendsFactory.update(vm.newFriend);
                } else {
                    FriendsFactory.create(vm.newFriend);
                }
                $ionicHistory.goBack();
            } else {
                vm.isSaving = false;
                var msg = 'Informations required';
                if (vm.newForm.$error.required) {
                    msg = vm.newForm.$error.required[0].$name + ' required';        
                } 
                $cordovaToast.showShortBottom(msg);
            }
        } 

        function cancel (index) {
            console.log("cancel");
            vm.newFriend = emptyFriend; 
            $ionicHistory.goBack();
        }                          
    }
})();