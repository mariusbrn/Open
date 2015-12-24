(function () {
    'use strict';

angular
  .module('geocoder', ['uiGmapgoogle-maps'])
  .factory('Geocoder', GeocoderFactory);

  GeocoderFactory.$inject = ['$q', '$timeout', 'uiGmapGoogleMapApi', 'locationFactory'];
  /* @ngInject */  
  function GeocoderFactory ($q, $timeout, uiGmapGoogleMapApi, locationFactory) {
    
    var searchEventTimeout;
    var QUERY_PAUSE = 350;
      
    var service = {
        geocodeAddress: geocodeAddress
    };

    uiGmapGoogleMapApi.then(function(maps) {
        service.maps = maps;
        service.geocoder = new maps.Geocoder();        
    });

    // var dummyResult = [
    //   {formatted_address: '1 rue Martin Bob, Paris 75002'},
    //   {formatted_address: '7 rue Machin truc, Paris 75001'},
    //   {formatted_address: '12 Avenue du coin, Paris 75018'},
    //   {formatted_address: '2 impasse coupe gorge, Paris 75001'}
    // ];


    return service;

    // ====================================

    function geocodeAddress (query) {
      var d = $q.defer();

      if (searchEventTimeout) $timeout.cancel(searchEventTimeout);
      searchEventTimeout = $timeout(function() {

        if(!query || query.length < 3) d.reject("too short");

        //d.resolve(dummyResult);

        var center = new service.maps.LatLng(locationFactory.currentPosition.coords.latitude,
          locationFactory.currentPosition.coords.longitude
        );
        //var center = new service.maps.LatLng(48.8813872, 2.3414853);
 
        var req = {};
        req.address = query;
        req.bounds = new service.maps.Circle({
         center: center,
         radius: 10000
        }).getBounds();

        service.geocoder.geocode(req, function(results, status) {

          if (status == service.maps.GeocoderStatus.OK) {
            d.resolve(results);
          } else if (status === service.maps.GeocoderStatus.ZERO_RESULTS) {
            d.reject({
              type: 'zero',
              message: 'Zero results for geocoding address ' + query
            });
          } else if (status === service.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
            d.reject({
              type: 'busy',
              message: 'Geocoding server is busy can not process address ' + query
            });            
          } else if (status === service.maps.GeocoderStatus.REQUEST_DENIED) {
            d.reject({
              type: 'denied',
              message: 'Request denied for geocoding address ' + query
            });
          } else {
            d.reject({
              type: 'invalid',
              message: 'Invalid request for geocoding: status=' + status + ', address=' + query
            });
          }
        });
      }, QUERY_PAUSE);

      return d.promise;
    }
    
  }

})();