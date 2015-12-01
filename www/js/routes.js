(function () {
    'use strict';

	angular.module('Open')
		.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {


		$ionicConfigProvider.navBar.alignTitle('center');

		if (ionic.Platform.isAndroid())
		    $ionicConfigProvider.scrolling.jsScrolling(false);

		$stateProvider

		.state('app', {
			url: '/app',
			abstract: true,
			templateUrl: 'templates/menu.html',
			controller: 'AppController as main'
		})

		.state('search', {
			url: '/search',
			templateUrl: 'templates/search.html',
			controller: 'SearchController as vm'
		})
		.state('app.friends', {
			url: '/friends',
			resolve: {
			    location:
			      function(locationFactory) {
			        return locationFactory.getCurrentPosition(20000);
			      }
		    },
			views: {
				'menuContent': {
				 	templateUrl: 'templates/friends.html',
				 	controller: 'FriendsController as vm'
				}
			}
		})

		.state('app.single', {
			url: '/friends/:friendId',
			views: {
				'menuContent': {
					templateUrl: 'templates/friend.html',
					controller: 'FriendController as vm'
				}
			}
		})

		.state('app.new', {
			url: '/new',
			views: {
				'menuContent': {
					templateUrl: 'templates/new.html',
					controller: 'NewFriendController as vm'
				}
			}
		});		
		// if none of the above states are matched, use this as the fallback
		$urlRouterProvider.otherwise('/search');
	});

})();