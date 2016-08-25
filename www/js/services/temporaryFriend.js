(function () {
    'use strict';

    angular
        .module('Open.services')
        .factory('TemporaryFriend', TemporaryFriend);

    TemporaryFriend.$inject = [];
    /* @ngInject */
    function TemporaryFriend() {
        var tempFriend;
        var service = {
            store: tempFriend
        };

        return service;
    }
})();
