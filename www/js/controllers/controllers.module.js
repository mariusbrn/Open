(function () {
    'use strict';

    angular
        .module('Open.controllers', ['ionic', 'uiGmapgoogle-maps'])
        .config(configAppCtrl);

    configAppCtrl.$inject = ['uiGmapGoogleMapApiProvider'];
    /* @ngInject */
    function configAppCtrl (uiGmapGoogleMapApiProvider) {
        uiGmapGoogleMapApiProvider.configure({
            //    key: 'your api key',
            v: '3.17',
            libraries: 'weather,geometry,visualization,places'
        });
    }      
})();