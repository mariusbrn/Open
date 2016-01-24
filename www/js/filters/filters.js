(function () {
    'use strict';

    angular.module('Open.filters', [])
     .filter('digicode', DigicodeFilter)
     .filter('distance', DistanceFilter);

    DigicodeFilter.$inject = ['$sce'];
    /* @ngInject */
    function DigicodeFilter ($sce) {
      return function(input) {    
        return $sce.trustAsHtml(input.toUpperCase().split('').join('<span>.</span>'));
      };
    }

    function DistanceFilter () {
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

})();