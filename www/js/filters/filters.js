(function () {
    'use strict';

    angular.module('Open.filters', [])
     .filter('digicode', DigicodeFormatter)
     .filter('distance', DistanceFormatter)
     .filter('address', AddressFormatter);

    DigicodeFormatter.$inject = ['$sce'];
    /* @ngInject */
    function DigicodeFormatter ($sce) {
      return function(input) {    
        return $sce.trustAsHtml(input.toUpperCase().split('').join('<span>.</span>'));
      };
    }

    function DistanceFormatter () {
      return function(input) {
        if(angular.isNumber(input)) {
            if(input < 100) {
              return Math.round(input) + ' m';
            } else {
              return (input/1000).toFixed(1) + ' km';
            }
        } else {
            return input;
        }
      };
    }

    function AddressFormatter () {
      return function(input) {    
        return input
                .split(',')
                .slice(0,2)
                .join();

      };
    }
})();