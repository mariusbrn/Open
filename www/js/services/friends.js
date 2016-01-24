(function () {
    'use strict';

    angular
        .module('Open.services')
        .factory('FriendsFactory', FriendsFactory);

    FriendsFactory.$inject = ['$localstorage', '_', 'locationFactory', 'SettingsFactory'];
    /* @ngInject */
    function FriendsFactory($localstorage, _, locationFactory, SettingsFactory) {
        var service = {
            friends: [],
            load: loadFriends,
            save: saveFriends,
            create: createFriend,
            clear: clearFriends,
            delete: deleteFriend,
            calculateDistance: calculateDistance,
            closeTo: closeTo
        };

        return service;

        // ====================================

        function loadFriends() {
          var storageFriends = $localstorage.getObject('friends');
          service.friends = (_.isEmpty(storageFriends)) ? [] : storageFriends;

          console.log(service.friends)
        }

        function saveFriends() {
          $localstorage.setObject('friends', service.friends);
        }

        function getFriend(id) {
          return _.where(service.friends, { 'id': parseInt(id) })[0];
        }

        function createFriend(friend) {
          var newId = (service.friends.length > 0) ? _.max(service.friends, 'id').id+1 : 1;
          friend.id = newId; 
          service.friends.push(friend);
          service.save();
        }

        function deleteFriend(friend) {
          _.remove(service.friends, function (f) { return f.id === parseInt(friend.id); });
          service.save();
        }

        function clearFriends() {
          service.friends = [];
          service.save();
        }

        function calculateDistance(coords) {
          service.friends.map(function (f) {
            if(f.location) {
              f.distance = locationFactory.distanceBetween(f.location.coords, coords);
            } else {
              f.distance = '∞';
            }

            return f;
          });
        }

        function closeTo() {
          return service.friends.filter(function (f) {
            return angular.isNumber(f.distance) && (f.distance <= SettingsFactory.get().radius);
          });
        }

    }
})();
