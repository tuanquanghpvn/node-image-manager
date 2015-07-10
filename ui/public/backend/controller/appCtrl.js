var app = angular.module("myapp", ['ngFileUpload', 'ui.router', 'ui.bootstrap', 'oc.lazyLoad']);

/////////////////////////////////////////////////////
// Controller app
app.controller('appCtrl', function($scope, $http, $modal, $location, $state) {
    $scope.state = $state;
    $scope.$watch('state.current', function(v) {
        $scope.nameState = v.name;
    }, true);
});

app.config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/gallery');

    $stateProvider                     
        .state('gallery', {
            url: '/gallery',
            templateUrl: '/admin/gallery/store',
            controller: 'galleryCtrl',
            resolve: { // Any property in resolve should return a promise and is executed before the view is loaded
                // factory: checkSession,
                loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                    // you can lazy load files for an existing module
                    return $ocLazyLoad.load({
                        name: 'myapp',
                        files: ['/backend/controller/galleryCtrl.js']
                    });
                }]
            }
        })
        .state('popup', {
            url: '/popup',
            templateUrl: '/admin/gallery/popup',
            controller: 'galleryBoxCtrl',
            resolve: { // Any property in resolve should return a promise and is executed before the view is loaded
                // factory: checkSession,
                loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                    // you can lazy load files for an existing module
                    return $ocLazyLoad.load({
                        name: 'myapp',
                        files: ['/backend/controller/galleryBoxCtrl.js']
                    });
                }]
            }
        })        
});

app.filter('toArray', function() {
    'use strict';
    return function(obj) {
        if (!(obj instanceof Object)) {
            return obj;
        }

        return Object.keys(obj).map(function(key) {
            return Object.defineProperty(obj[key], '$key', {
                __proto__: null,
                value: key
            });
        });
    }
});