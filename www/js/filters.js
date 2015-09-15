'use strict';

angular.module('Open.filters', [])

.filter('digicode', function() {
  return function(input) {
    return input.toUpperCase().split('').join('.');
  };
})

.filter('distance', function() {
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
});