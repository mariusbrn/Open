(function () {
    'use strict';

    angular
        .module('Open.controllers')
        .config(configAppCtrl)
        .controller('AppController', AppController);

    configAppCtrl.$inject = ['uiGmapGoogleMapApiProvider'];
    /* @ngInject */
    function configAppCtrl (uiGmapGoogleMapApiProvider) {
        uiGmapGoogleMapApiProvider.configure({
            //    key: 'your api key',
            v: '3.17',
            libraries: 'weather,geometry,visualization,places'
        });
    }

    AppController.$inject = ['$scope', '$ionicModal', '$timeout'];
    /* @ngInject */
    function AppController($scope, $ionicModal, $timeout) {
        var main = this;
        
        // Form data for the login modal
        main.loginData = {};

        main.closeLogin = closeLogin;
        main.login      = login;
        main.doLogin    = doLogin;

        activate();

        function activate() {
            // Create the login modal that we will use later
            $ionicModal.fromTemplateUrl('templates/login.html', {
                scope: $scope
            }).then(function(modal) {
                main.modal = modal;
            });
        }

        // Triggered in the login modal to close it
        function closeLogin() {
            main.modal.hide();
        }

        // Open the login modal
        function login() {
            main.modal.show();
        }

        // Perform the login action when the user submits the login form
        function doLogin() {
            console.log('Doing login', main.loginData);

            // Simulate a login delay. Remove this and replace with your login
            // code if using a login system
            $timeout(function() {
                main.closeLogin();
            }, 1000);
        }        
    }
})();