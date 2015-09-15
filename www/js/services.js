'use strict';

if (typeof(Number.prototype.toRad) === 'undefined') {
  Number.prototype.toRad = function() {
    return this * Math.PI / 180;
  };
}

angular.module('Open.services', ['Open.utils'])

.factory('deviceReadyFactory', function($q){
  var ready = false;
  var deferred = $q.defer();
  if (typeof window.cordova === 'object' && !ready) {
    document.addEventListener('deviceready', function () {
      ready = true;
      deferred.resolve();
    }, false);
  } else {
    deferred.resolve();
  }

  return deferred.promise;

})


.factory('locationFactory', function(deviceReadyFactory, $document, $window, $q){
    var self = this;

    self.currentPosition = null;
    
    self.getCurrentPosition = function(timeout) {

      var deferred = $q.defer();

      deviceReadyFactory.then(function(){
        navigator.geolocation.getCurrentPosition(function(position){
            self.currentPosition = position;
            deferred.resolve(position);
          }, function(error){
            deferred.reject(error);
          },
          { maximumAge: 3000, timeout: timeout, enableHighAccuracy: true }); 
        }); 

        return deferred.promise;   
    };


    /**
     * Calculates geodetic distance between two points specified by latitude/longitude using 
     * Vincenty inverse formula for ellipsoids
     *
     * @param   {Number} lat1, lon1: first point in decimal degrees
     * @param   {Number} lat2, lon2: second point in decimal degrees
     * @returns (Number} distance in metres between points
     */
    
    self.distVincenty = function (lat1, lon1, lat2, lon2) {
      var a = 6378137,
          b = 6356752.314245,
          f = 1 / 298.257223563; // WGS-84 ellipsoid params
      var L = (lon2 - lon1).toRad();
      var U1 = Math.atan((1 - f) * Math.tan(lat1.toRad()));
      var U2 = Math.atan((1 - f) * Math.tan(lat2.toRad()));
      var sinU1 = Math.sin(U1),
          cosU1 = Math.cos(U1);
      var sinU2 = Math.sin(U2),
          cosU2 = Math.cos(U2);
    
      var lambda = L, iterLimit = 100,
          lambdaP, sigma, cosSigma, cosSqAlpha, cos2SigmaM, sinSigma;

      do {
        var sinLambda = Math.sin(lambda),
            cosLambda = Math.cos(lambda);
        sinSigma = Math.sqrt((cosU2 * sinLambda) * (cosU2 * sinLambda) + (cosU1 * sinU2 - sinU1 * cosU2 * cosLambda) * (cosU1 * sinU2 - sinU1 * cosU2 * cosLambda));
        if (sinSigma === 0) {
          return 0; // co-incident points
        }
        cosSigma = sinU1 * sinU2 + cosU1 * cosU2 * cosLambda;
        sigma = Math.atan2(sinSigma, cosSigma);
        var sinAlpha = cosU1 * cosU2 * sinLambda / sinSigma;
        cosSqAlpha = 1 - sinAlpha * sinAlpha;
        cos2SigmaM = cosSigma - 2 * sinU1 * sinU2 / cosSqAlpha;
        if (isNaN(cos2SigmaM)) {
          cos2SigmaM = 0; // equatorial line: cosSqAlpha=0 (§6)
        }
        var C = f / 16 * cosSqAlpha * (4 + f * (4 - 3 * cosSqAlpha));
        lambdaP = lambda;
        lambda = L + (1 - C) * f * sinAlpha * (sigma + C * sinSigma * (cos2SigmaM + C * cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM)));
      } while (Math.abs(lambda - lambdaP) > 1e-12 && --iterLimit > 0);
    
      if (iterLimit === 0) {
        return NaN;// formula failed to converge
      }
      var uSq = cosSqAlpha * (a * a - b * b) / (b * b);
      var A = 1 + uSq / 16384 * (4096 + uSq * (-768 + uSq * (320 - 175 * uSq)));
      var B = uSq / 1024 * (256 + uSq * (-128 + uSq * (74 - 47 * uSq)));
      var deltaSigma = B * sinSigma * (cos2SigmaM + B / 4 * (cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM) - B / 6 * cos2SigmaM * (-3 + 4 * sinSigma * sinSigma) * (-3 + 4 * cos2SigmaM * cos2SigmaM)));
      var s = b * A * (sigma - deltaSigma);
    
      s = s.toFixed(3); // round to 1mm precision
      return parseFloat(s);
    };

    self.distanceBetween = function (loc1, loc2){
      var distance = self.distVincenty(loc1.latitude, loc1.longitude, loc2.latitude, loc2.longitude);

      return distance;
    };

    self.isInBounds = function (loc1, loc2, radius){
      var distance = self.distVincenty(loc1.latitude, loc1.longitude, loc2.latitude, loc2.longitude);

      return (distance <= radius);
    };

    return self;
})


.factory('FriendsFactory', function($localstorage, _, locationFactory, configFactory) {
    var self = this;

    self.friends = [];

    self.load = function () {
/*      var storageFriends = $localstorage.getObject('friends');
      self.friends = (_.isEmpty(storageFriends)) ? [] : storageFriends;*/

      self.friends = [
        { name: 'Ludo',  digicode: [{value: '12B34'}],  location: {latitude: 48.876695, longitude: 2.3528297}, comments: "43 rue Bidon 75010 Paris" },
        { name: 'Marius',  digicode: [{value: 'XX1XX'}],  location: {latitude: 48.8812946, longitude: 2.34185370} },
        { name: 'Flo',  digicode: [{value: 'bite'}],  location: {latitude: 47.322047, longitude: 5.0414799} },
        { name: 'Montparnasse',  digicode: [{value: '*TGV*'}],  location: {latitude: 48.840607, longitude: 2.319468}, comments: "Quai 12 Voiture 7" },
        { name: 'Roger',  digicode: [{value: 'XX1XX'}],  location: {latitude: 48.862449, longitude: 2.249167} },
        { name: 'Notre-Dame',  digicode: [{value: 'JESUS'}],  location: {latitude: 48.85267, longitude: 2.349292}, comments: "6 Parvis Notre-Dame - Pl. Jean-Paul II, 75004 Paris" },
        { name: 'Pompidou',  digicode: [{value: 'POMPI'}],  location: {latitude: 48.860642, longitude: 2.351675}, comments: "Place Georges-Pompidou, 75004 Paris" },
        { name: 'Eiffel',  digicode: [{value: 'tower'}],  location: {latitude: 48.858887, longitude: 2.294486}, comments: "Champ de Mars, 5 Avenue Anatole France, 75007 Paris" }
      ];
    };

    self.get = function (id) {
      return _.where(self.friends, { 'id': parseInt(id) })[0];
    };

    self.save = function () {
      $localstorage.setObject('friends', self.friends);
    };

    self.new = function (friend) {
      var newId = (self.friends.length > 0) ? _.max(self.friends, 'id').id+1 : 1;
      friend.id = newId; 
      self.friends.push(friend);
      self.save();
    };

    self.delete = function (friend) {
      _.remove(self.friends, function (f) { return f.id === parseInt(friend.id); });
      self.save();
    };

    self.calculateDistance = function (coords) {
      self.friends.map(function (f) {
        if(f.location) {
          f.distance = locationFactory.distanceBetween(f.location, coords);
          console.log(f.name,"distance",f.distance);
        } else {
          f.distance = '∞';
        }

        return f;
      });
    };

    self.closeTo = function () {
      return self.friends.filter(function (f) {
        return angular.isNumber(f.distance) && (f.distance <= configFactory.get().radius);
      });
    };
 
    return self;
})

.factory('configFactory', function () {
    var self = this;

    var appConfig = {
      radius: 50,
      radiusEnabled: true
    };

    var setInStorage = function (config) {
        if( config !== null && config !== undefined) {   
          config = JSON.stringify(config);
        } 
        window.localStorage.setItem( 'config', config);           
    };

    var getFromStorage = function() {
      var config = window.localStorage.getItem( 'config' );
      if(config !== null) {
        config = JSON.parse(config);
      }
      return config;
    };

    self.get = function() {
      return appConfig;
    };

    self.set = function(config) {
        if( config !== null && config !== undefined) {
          appConfig = config;   
          setInStorage(config);
        }           
    };

    self.init =  function () {
        var c = getFromStorage();
        if( c === null || c === undefined) {
          setInStorage(appConfig);
        } else {
          appConfig = c;
        }
    };

    return self;
});


angular.module('Open.utils', [])

.factory('$localstorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    }
  };
}]);