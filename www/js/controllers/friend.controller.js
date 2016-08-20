angular
    .module('Open.controllers')
    .controller('FriendController', FriendController);

FriendController.$inject = ['$scope',
    '$state',
    '$stateParams',
    '_',
    '$ionicPlatform',
    '$ionicHistory',
    '$ionicPopup',
    '$cordovaCamera',
    '$cordovaToast',
    'AmplitudeFactory',
    'Geocoder',
    'FriendsFactory',
    'locationFactory',    
    'TemporaryFriend'];
/* @ngInject */
function FriendController($scope,
    $state,
    $stateParams,
    _,
    $ionicPlatform,
    $ionicHistory,
    $ionicPopup,
    $cordovaCamera,
    $cordovaToast,
    AmplitudeFactory,
    Geocoder,
    FriendsFactory,
    locationFactory,    
    TemporaryFriend)
{
    let vm = this;
    const emptyFriend = {
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
    vm.editAddress = editAddress;
    vm.locateMe    = locateMe;
    vm.fetchingAddress = false;
    vm.isSaving = false;

    $scope.$on('$ionicView.enter', (e) => {
        activate();         
    }); 

    function activate () {
        if ($stateParams.id) {
            vm.action = 'edit';
            vm.newFriend = _.cloneDeep(FriendsFactory.get($stateParams.id));
            vm.title = 'EDIT CONTACT';
        } else {
            vm.newFriend = _.cloneDeep(emptyFriend);
            vm. title = 'NEW CONTACT';
        }

        if (TemporaryFriend.store) {
           vm.newFriend = TemporaryFriend.store;
        }     
    } 

    function addCode () {
        vm.newFriend.codes.push({ id: vm.newFriend.codes.length + 1, label: '' });
        AmplitudeFactory.logEvent('user:add:code');
    } 

    function removeCode (index) {
        if (index === 0) {
            vm.newFriend.codes[0].label = '';
        } else {    
            vm.newFriend.codes.splice(index, 1);
            vm.newFriend.codes.forEach((c, i) => {c.id = i+1;});
        }
    }  

    function getPicture () {

        const options = {
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

        $ionicPlatform.ready(() => {
            $cordovaCamera.getPicture(options).then((imageData) => {        
                vm.newFriend.picture = imageData;
                AmplitudeFactory.logEvent('user:add:picture');
            }, (err) => {
                console.log('Failed because: ' + err);
            });
        });
    }

    function save () {
        console.log('save');
        vm.isSaving = true;
        if(vm.newForm.$valid) {                
            if(vm.action === 'edit'){
                FriendsFactory.update(vm.newFriend);
                AmplitudeFactory.logEvent('user:edit');
            } else {
                FriendsFactory.create(vm.newFriend);
                AmplitudeFactory.logEvent('user:new', {'quantity': FriendsFactory.friends.length});
            }
            TemporaryFriend.store = null;
            $ionicHistory.goBack();
        } else {
            vm.isSaving = false;
            let msg = 'Informations required';
            if (vm.newForm.$error.required) {
                msg = vm.newForm.$error.required[0].$name + ' required';        
            } 
            $cordovaToast.showShortBottom(msg);
        }
    } 

    function cancel (index) {
        console.log("cancel");
        vm.newFriend = _.cloneDeep(emptyFriend); 
        TemporaryFriend.store = null;
        $ionicHistory.goBack();
    } 

    function deleteFriend () {
        FriendsFactory.delete(vm.newFriend);
        $ionicHistory.goBack();
    }  

    function editAddress() {
        let params = { location: vm.newFriend.location };

        if ($stateParams.id) params.id = $stateParams.id;

        TemporaryFriend.store = vm.newFriend;       

        $state.go('^.address', params);
    }

    function locateMe() {
        vm.fetchingAddress = true;
        Geocoder.reverseGeocode().then((res) => {
            if (res.length > 0) {
                vm.newFriend.location = locationFactory.formatLocation(res[0]);
            }                       
        }, (e) => {
            console.log(e);
        })
        .finally(() => {
            vm.fetchingAddress = false;
        });               
    }

    function showConfirm () {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Delete contact?',
            buttons: [{
                text: 'No', 
                type:'button-light'
            },
            { 
                text: 'Yes',
                type: 'button-balanced', 
                onTap: function(e) {
                    return true;
                }
            }]
        });

        confirmPopup.then(function(res) {
            if(res) {
                deleteFriend();
            } 
        });
    }                             
}
