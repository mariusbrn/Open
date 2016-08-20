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
        geocodeAddress: geocodeAddress,
        reverseGeocode: reverseGeocode
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
 
      var req = {};

      if (searchEventTimeout) $timeout.cancel(searchEventTimeout);
      searchEventTimeout = $timeout(function() {

        if(!query || query.length < 3)  {
          d.reject("too short");
          return d.promise;
        }

        //d.resolve(dummyResult);

        locationFactory.getCurrentPosition(20000).then( function(position){
          var center =new service.maps.LatLng(position.coords.latitude, position.coords.longitude);
          //var center = new service.maps.LatLng(48.8813872, 2.3414853);

          req.address = query;
          req.bounds = new service.maps.Circle({
           center: center,
           radius: 10000
          }).getBounds();

          geocodeRequest(req).then(function (res) { 
            d.resolve(res)
          });
        });

      }, QUERY_PAUSE);

      return d.promise;
    }

    function reverseGeocode () {
      var d = $q.defer();

      locationFactory.getCurrentPosition(20000).then( function(position){
        var latlng = new service.maps.LatLng(position.coords.latitude, position.coords.longitude);
        
        geocodeRequest({ 'latLng': latlng }).then(function (res) { 
          d.resolve(res)
        });
      });

      return d.promise; 
    }

    function geocodeRequest (req) {
      var d = $q.defer();

      service.geocoder.geocode(req, function(results, status) {

        if (status == service.maps.GeocoderStatus.OK) {
          d.resolve(results);
        } else if (status === service.maps.GeocoderStatus.ZERO_RESULTS) {
          d.reject({
            type: 'zero',
            message: 'Zero results for geocoding: ' + req.address || req.latLng
          });
        } else if (status === service.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
          d.reject({
            type: 'busy',
            message: 'Geocoding server is busy can not process: ' + req.address || req.latLng
          });            
        } else if (status === service.maps.GeocoderStatus.REQUEST_DENIED) {
          d.reject({
            type: 'denied',
            message: 'Request denied for geocoding: ' + req.address || req.latLng
          });
        } else {
          d.reject({
            type: 'invalid',
            message: 'Invalid request for geocoding: status=' + status + ', query=' + req.address || req.latLng
          });
        }
      });

      return d.promise;    
    }
    
  }

})();