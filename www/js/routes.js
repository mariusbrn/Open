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
		})

		.state('search', {
			url: '/search',
			templateUrl: 'templates/search.html',
			controller: 'SearchController as vm'
		})
		.state('friends', {
			url: '/friends',
			resolve: {
			    location:
			      function(locationFactory) {
			        return locationFactory.getCurrentPosition(20000);
			      }
		    },
		 	templateUrl: 'templates/friends.html',
		 	controller: 'FriendsController as vm'
		})

		.state('single', {
			url: '/friends/:friendId',
			templateUrl: 'templates/friend.html',
			controller: 'FriendController as vm'
		})

		.state('new', {
			url: '/new',
			templateUrl: 'templates/new.html',
			controller: 'NewFriendController as vm'
		});		
		// if none of the above states are matched, use this as the fallback
		$urlRouterProvider.otherwise('/search');
	});

})();