(function() {
    'use strict';

    angular
        .module('Open.directives')
        .directive('friendItem', friendItem);

    /* @ngInject */
    function friendItem() {

        var directive = {
            scope: {
                'friend' : '='
            },
            templateUrl: 'js/directives/friend-item/friend-item.html',
            restrict: 'EA'
        };
        return directive;
    }
})();