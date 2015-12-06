(function() {
    'use strict';

    angular
        .module('Open.directives')
        .directive('addressInput', addressInput);

    /* @ngInject */
    function addressInput() {

        var directive = {
            scope: {
                'newFriend': '='
            },
            templateUrl: 'js/directives/address-input/address-input.html',
            restrict: 'EA',
            link: linkAddressInput
        };
        return directive;
    }

    function linkAddressInput (scope) {

        scope.locateMe = function () {

        };
    } 
})();