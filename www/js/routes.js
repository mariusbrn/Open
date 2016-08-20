(function () {
    'use strict';

	angular.module('Open')
		.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

		$ionicConfigProvider.navBar.alignTitle('center');

		if (ionic.Platform.isAndroid())
		    $ionicConfigProvider.scrolling.jsScrolling(false);

		$stateProvider

		.state('search', {
			url: '/search',
			templateUrl: 'templates/search.html',
			controller: 'SearchController as vm'
		})
		.state('friends', {
			url: '/friends',
			resolve: {
			     location:
			      function($q, locationFactory) {
					if (locationFactory.currentPosition)
						return $q.when();
					else
						return locationFactory.getCurrentPosition(20000);
			      }
		    },
		 	templateUrl: 'templates/friends.html',
		 	controller: 'FriendsController as vm'
		})

		.state('edit', {
			url: '', 
			abstract: true, 
			template: '<ion-nav-view/>', 
		})

		.state('edit.details', {
			url: '/friend/:id',
			templateUrl: 'templates/new.html',
			controller: 'FriendController as vm'
		})

		.state('edit.address', {
			url: '/friend/:id/address',
			parent:'edit',
			templateUrl: 'templates/address-input.html',
			controller: 'AddressController as vm'
		})		

		.state('new', {
			url: '', 
			abstract: true, 
			template: '<ion-nav-view/>', 
		})

		.state('new.details', {
			url: '/new',
			templateUrl: 'templates/new.html',
			controller: 'FriendController as vm'
		})		

		.state('new.address', {
			url: '/new/address',
			parent:'new',
			templateUrl: 'templates/address-input.html',
			controller: 'AddressController as vm'
		});		

		// if none of the above states are matched, use this as the fallback
		$urlRouterProvider.otherwise('/friends');
	});

})();