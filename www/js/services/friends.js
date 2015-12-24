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
            delete: deleteFriend,
            calculateDistance: calculateDistance,
            closeTo: closeTo
        };

        return service;

        // ====================================

        function loadFriends() {
          
          //$localstorage.setObject('friends', {});
          var storageFriends = $localstorage.getObject('friends');
          service.friends = (_.isEmpty(storageFriends)) ? [] : storageFriends;

          console.log(service.friends)

          // service.friends = [
          //   { id: 1, name: 'Ludo',  digicode: [{value: '12B34'}],  location: {latitude: 48.876695, longitude: 2.3528297}, comments: "43 rue Bidon 75010 Paris" },
          //   { id: 2, name: 'Marius',  digicode: [{value: 'XX1XX'}],  location: {latitude: 48.8812946, longitude: 2.34185370} },
          //   { id: 3, name: 'Flo',  digicode: [{value: 'bite'}],  location: {latitude: 47.322047, longitude: 5.0414799} },
          //   { id: 4, name: 'Montparnasse',  digicode: [{value: '*TGV*'}],  location: {latitude: 48.840607, longitude: 2.319468}, comments: "Quai 12 Voiture 7" },
          //   { id: 5, name: 'Roger',  digicode: [{value: 'XX1XX'}],  location: {latitude: 48.862449, longitude: 2.249167} },
          //   { id: 6, name: 'Notre-Dame',  digicode: [{value: 'JESUS'}],  location: {latitude: 48.85267, longitude: 2.349292}, comments: "6 Parvis Notre-Dame - Pl. Jean-Paul II, 75004 Paris" },
          //   { id: 7, name: 'Pompidou',  digicode: [{value: 'POMPI'}],  location: {latitude: 48.860642, longitude: 2.351675}, comments: "Place Georges-Pompidou, 75004 Paris" },
          //   { id: 8, name: 'Eiffel',  digicode: [{value: 'tower'}],  location: {latitude: 48.858887, longitude: 2.294486}, comments: "Champ de Mars, 5 Avenue Anatole France, 75007 Paris" }
          // ];
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
