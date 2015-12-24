(function () {
    'use strict';

    angular
        .module('Open.controllers', ['ionic', 'uiGmapgoogle-maps', 'Open.directives'])
        .config(configAppCtrl);

    configAppCtrl.$inject = ['uiGmapGoogleMapApiProvider'];
    /* @ngInject */
    function configAppCtrl (uiGmapGoogleMapApiProvider) {
        uiGmapGoogleMapApiProvider.configure({
            //    key: 'your api key',
            v: '3.22',
            libraries: 'weather,geometry,visualization'
        });
    }      
})();