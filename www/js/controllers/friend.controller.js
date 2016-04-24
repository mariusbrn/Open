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
        '$ionicPopup',
        '$cordovaCamera',
        '$cordovaToast',
        'AmplitudeFactory',
        'FriendsFactory'];
    /* @ngInject */
    function FriendController($scope,
        $state,
        $stateParams,
        $ionicPlatform,
        $ionicHistory,
        $ionicPopup,
        $cordovaCamera,
        $cordovaToast,
        AmplitudeFactory,
        FriendsFactory)
    {
        var vm = this;
        var emptyFriend = {
            name: '',
            location: {},
            codes: [{id: 1, label: ''}],
            notes: ''
        };

        vm.action = 'new';
        vm.addCode     = addCode;
        vm.removeCode  = removeCode;
        vm.getPicture  = getPicture;
        vm.save        = save;
        vm.cancel      = cancel;
        vm.delete      = showConfirm;
        vm.isSaving = false;

        $scope.$on('$ionicView.enter', function(e) {
            activate();         
        }); 

        function activate () {
            if ($stateParams.id) {
                vm.action = 'edit';
                vm.newFriend = angular.copy(FriendsFactory.get($stateParams.id));
                vm.title = 'EDIT CONTACT';
            } else {
                vm.newFriend = emptyFriend;
                vm. title = 'NEW CONTACT';
            }
        } 

        function addCode () {
            vm.newFriend.codes.push({id: vm.newFriend.codes.length+1,label: ''});
            AmplitudeFactory.logEvent('user:add:code');
        } 

        function removeCode (index) {
            if (index === 0) {
                vm.newFriend.codes[0].label = '';
            } else {    
                vm.newFriend.codes.splice(index, 1);
                vm.newFriend.codes.forEach(function(c, i) {c.id = i+1;});
            }
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
                    vm.newFriend.picture = imageData;
                    AmplitudeFactory.logEvent('user:add:picture');
                }, function(err) {
                    console.log('Failed because: ' + err);
                });
            });
        }

        function save () {
            vm.isSaving = true;
            console.log(vm.newForm.$valid);
            if(vm.newForm.$valid) {                
                if(vm.action === 'edit'){
                    FriendsFactory.update(vm.newFriend);
                    AmplitudeFactory.logEvent('user:edit');
                } else {
                    FriendsFactory.create(vm.newFriend);
                    AmplitudeFactory.logEvent('user:new', {'quantity': FriendsFactory.friends.length});
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

        function deleteFriend () {
            FriendsFactory.delete(vm.newFriend);
            $ionicHistory.goBack();
        }  

        function showConfirm () {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Delete contact?',
                buttons: [{
                    text: 'No', 
                    type:'button-light'
                }, { 
                    text: 'Yes',
                    type: 'button-balanced', 
                    onTap: function(e) {
                        return true}
                    }
                ]
            });

            confirmPopup.then(function(res) {
                console.log(res);
             if(res) {
               deleteFriend();
             } 
            });
        }                             
    }
})();