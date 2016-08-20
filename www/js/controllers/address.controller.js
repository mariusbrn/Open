
angular
    .module('Open.controllers')
    .controller('AddressController', AddressController);

AddressController.$inject = [
    '$scope', 
    '$state', 
    '$stateParams', 
    '_',
    '$timeout',
    '$ionicHistory',
    'Geocoder',
    'locationFactory',
    'TemporaryFriend'
];
/* @ngInject */
function AddressController(
    $scope, 
    $state, 
    $stateParams, 
    _,
    $timeout, 
    $ionicHistory,
    Geocoder,
    locationFactory,
    TemporaryFriend
) {
    let vm = this;

    vm.locations = [];
    vm.fetchingAddress = false;
    vm.searchQuery = '';
    vm.locations = [];   
    vm.locateMe = locateMe;
    vm.selectLocation = selectLocation;
    vm.onSearchQuery = onSearchQuery;
    vm.cancel = cancel;
    vm.clear = clear;

    activate();

    function activate() {
        if (TemporaryFriend.store && !_.isEmpty(TemporaryFriend.store.location)) {
            vm.searchQuery = TemporaryFriend.store.location.formatted_address;
            onSearchQuery();
        }           
    }

    function locateMe() {
        vm.fetchingAddress = true;
        Geocoder.reverseGeocode().then((res) => {
            if (res.length > 0) {
                let infos = locationFactory.formatLocation(res[0]);
                vm.searchQuery = infos.formatted_address;
                onSearchQuery();
            }                       
        }, (e) => {
            console.log(e);
        })
        .finally(() => {
            vm.fetchingAddress = false;
        });          
    }

    function selectLocation(location) {
        TemporaryFriend.store.location = locationFactory.formatLocation(location);
        clear();
        $ionicHistory.goBack();
    }

    function onSearchQuery() {
        if (vm.searchQuery.length > 2) {
            Geocoder.geocodeAddress(vm.searchQuery).then((res) => {
                vm.locations = res;
            }, (e) => {
                vm.locations = [];   
            });
        }
    }

    function cancel() {
        vm.searchQuery = '';
        $ionicHistory.goBack();
    }

    function clear() {
        console.log("clear");
        vm.searchQuery = '';
        vm.locations = [];
    }                                          
}
