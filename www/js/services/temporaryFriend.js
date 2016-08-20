(function () {
    'use strict';

    angular
        .module('Open.services')
        .factory('TemporaryFriend', TemporaryFriend);

    TemporaryFriend.$inject = [];
    /* @ngInject */
    function TemporaryFriend() {
        let tempFriend;
        let service = {
            store: tempFriend
        };

        return service;
    }
})();
