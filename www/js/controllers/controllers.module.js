(function () {
    'use strict';

    angular
        .module('Open.controllers', ['ionic', 'uiGmapgoogle-maps', 'Open.directives'])
        .config(configAppCtrl);

    configAppCtrl.$inject = ['uiGmapGoogleMapApiProvider'];
    /* @ngInject */
    function configAppCtrl (uiGmapGoogleMapApiProvider) {
        uiGmapGoogleMapApiProvider.configure({
            //key: 'AIzaSyA7JP2MbIs7uzp5fQtglkkZ9FFdfbWoy7E',
            v: '3.22',
            libraries: 'weather,geometry,visualization'
        });
    }      
})();