(function() {
    'use strict';

    angular
        .module('Open.directives')
        .directive('addressInput', addressInput);

    addressInput.$inject = [        
        '$ionicTemplateLoader',
        '$ionicBackdrop',
        '$ionicPlatform',
        '$q',
        '$timeout',
        '$rootScope',
        '$document',
        'Geocoder'];
    /* @ngInject */
    function addressInput(
        $ionicTemplateLoader,
        $ionicBackdrop,
        $ionicPlatform,
        $q,
        $timeout,
        $rootScope,
        $document,
        Geocoder
    ){
        var directive = {
            require: '?ngModel',
            scope: {
                'ngModel': '=?'
            },
            templateUrl: 'js/directives/address-input/address-input.html',
            restrict: 'E',
            link: function(scope, element, attrs, ngModel) {
                var unbindBackButtonAction;
                var inputElement = element.find('input');

                scope.locations = [];

                var popupPromise = $ionicTemplateLoader.compile({
                    templateUrl: 'js/directives/address-input/address-input-modal.html',
                    scope: scope,
                    appendTo: $document[0].body
                });

                popupPromise.then(activate);

                scope.labelCancel = 'Cancel';
                scope.placeholder = 'Enter an address';

                ngModel.$formatters.unshift(function (modelValue) {
                    if (!modelValue) return '';
                    return modelValue;
                });

                ngModel.$parsers.unshift(function (viewValue) {
                    return viewValue;
                });

                ngModel.$render = function(){
                    if(!ngModel.$viewValue){
                        inputElement.val('');
                    } else {
                        inputElement.val(ngModel.$viewValue.formatted_address || '');
                    }
                };

                scope.$on("$destroy", function(){
                    if (unbindBackButtonAction){
                        unbindBackButtonAction();
                        unbindBackButtonAction = null;
                    }
                });

                scope.isSet = function ()  {
                    return inputElement.val().length > 0;
                };

                function activate (el) {
                    var searchInputElement = angular.element(el.element.find('input'));

                    scope.selectLocation = function(location){
                        var infos = {
                            formatted_address: location.formatted_address,
                            coords: { 
                                lat:location.geometry.location.lat(),
                                lng:location.geometry.location.lng()
                            }
                        };

                        ngModel.$setViewValue(infos);
                        ngModel.$render();
                        el.element.css('display', 'none');
                        $ionicBackdrop.release();

                        if (unbindBackButtonAction) {
                            unbindBackButtonAction();
                            unbindBackButtonAction = null;
                        }

                        scope.searchQuery = ngModel.$viewValue.formatted_address || '';
                    };

                    scope.$watch('searchQuery', function(query){
                        if(query) {
                            Geocoder.geocodeAddress(query).then(function(latlng){
                                scope.locations = latlng;
                            }, function (e) {
                                scope.locations = [];   
                            });
                        }
                    });

                    inputElement.bind('click', onClick);
                    inputElement.bind('touchend', onClick);

                    el.element.find('button').bind('click', onCancel);
                
                    function onClick (e){
                        e.preventDefault();
                        e.stopPropagation();

                        $ionicBackdrop.retain();
                        unbindBackButtonAction = $ionicPlatform.registerBackButtonAction(closeOnBackButton, 250);

                        el.element.css('display', 'block');
                        searchInputElement[0].focus();
                        setTimeout(function(){
                            searchInputElement[0].focus();
                        },0);
                    }

                    function onCancel (e){
                        scope.searchQuery = '';
                        $ionicBackdrop.release();
                        el.element.css('display', 'none');

                        if (unbindBackButtonAction){
                            unbindBackButtonAction();
                            unbindBackButtonAction = null;
                        }
                    }

                    function closeOnBackButton (e){
                        e.preventDefault();

                        el.element.css('display', 'none');
                        $ionicBackdrop.release();

                        if (unbindBackButtonAction){
                            unbindBackButtonAction();
                            unbindBackButtonAction = null;
                        }
                    } 
                }                   
            }
        };

        return directive;        
    }
   
})();