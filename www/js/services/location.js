
if (typeof(Number.prototype.toRad) === 'undefined') {
  Number.prototype.toRad = function() {
    return this * Math.PI / 180;
  };
}

angular
    .module('Open.services')
    .factory('locationFactory', locationFactory);

locationFactory.$inject = ['$document', '$window', '$q', '$timeout', '$ionicPlatform', '$cordovaGeolocation'];
/* @ngInject */
function locationFactory($document, $window, $q, $timeout, $ionicPlatform, $cordovaGeolocation) {
    var service = {
        currentPosition: null,
        getCurrentPosition: getCurrentPosition,
        distanceBetween: distanceBetween,
        isInBounds: isInBounds,
        formatLocation: formatLocation
    };

    return service;

    // ====================================

    function getCurrentPosition(timeout) {
        var deferred = $q.defer();
        var options = {
          maximumAge: 3000,
          timeout: timeout, enableHighAccuracy: true
        };

        $ionicPlatform.ready(function() {
            $cordovaGeolocation.getCurrentPosition(options).then(function(position) {
                service.currentPosition = position;
                deferred.resolve(position);
            }, function(error) {
                deferred.reject(error);
            });
        });

        // $timeout(function () {
        //   var position = {coords: {latitude: 48.8813872, longitude: 2.3414853}};
        //   service.currentPosition = position;
        //   deferred.resolve(position);
        // }, 3000);

        return deferred.promise;
    }

    /**
    */
    function distanceBetween(loc1, loc2) {
      var distance = distVincenty(loc1.lat, loc1.lng, loc2.latitude, loc2.longitude);
      return distance;
    }

    /**
    */
    function isInBounds(loc1, loc2, radius) {
      var distance = distVincenty(loc1.latitude, loc1.longitude, loc2.latitude, loc2.longitude);

      return (distance <= radius);
    }

    /**
    */
    function formatLocation (location) {
        return {
            formatted_address: location.formatted_address,
            coords: {
                lat:location.geometry.location.lat(),
                lng:location.geometry.location.lng()
            }
        };
    }

    /**
     * Calculates geodetic distance between two points specified by latitude/longitude using
     * Vincenty inverse formula for ellipsoids
     *
     * @param   {Number} lat1, lon1: first point in decimal degrees
     * @param   {Number} lat2, lon2: second point in decimal degrees
     * @returns (Number} distance in metres between points
     */

    function distVincenty(lat1, lon1, lat2, lon2) {
      lat1 = Number(lat1);
      lon1 = Number(lon1);
      lat2 = Number(lat2);
      lon2 = Number(lon2);

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
        sinSigma = Math.sqrt((cosU2 * sinLambda) * (cosU2 * sinLambda) +
            (cosU1 * sinU2 - sinU1 * cosU2 * cosLambda) *
            (cosU1 * sinU2 - sinU1 * cosU2 * cosLambda));
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
        lambda = L + (1 - C) * f * sinAlpha * (sigma + C * sinSigma *
            (cos2SigmaM + C * cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM)));
      } while (Math.abs(lambda - lambdaP) > 1e-12 && --iterLimit > 0);

      if (iterLimit === 0) {
        return NaN;// formula failed to converge
      }
      var uSq = cosSqAlpha * (a * a - b * b) / (b * b);
      var A = 1 + uSq / 16384 * (4096 + uSq * (-768 + uSq * (320 - 175 * uSq)));
      var B = uSq / 1024 * (256 + uSq * (-128 + uSq * (74 - 47 * uSq)));
      var deltaSigma = B * sinSigma * (cos2SigmaM + B / 4 * (cosSigma *
        (-1 + 2 * cos2SigmaM * cos2SigmaM) - B / 6 *
        cos2SigmaM * (-3 + 4 * sinSigma * sinSigma) *
        (-3 + 4 * cos2SigmaM * cos2SigmaM)));
      var s = b * A * (sigma - deltaSigma);

      s = s.toFixed(3); // round to 1mm precision
      return parseFloat(s);
    }
}
