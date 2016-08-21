
angular
    .module('Open.directives')
    .directive('friendItem', friendItem);

/* @ngInject */
function friendItem() {
    var directive = {
        scope: {
            'friend' : '=',
            'edit': '=',
            'share': '='
        },
        templateUrl: 'js/directives/friend-item/friend-item.html',
        restrict: 'EA',
        link: function (scope) {
            scope.more = false;
        }
    };
    return directive;
}
