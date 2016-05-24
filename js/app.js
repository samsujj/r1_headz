'use strict';

/* App Module */
var r1headzappvar = angular.module('r1headzapp', ['ui.router','angularValidator','ngCookies','ui.bootstrap']);

r1headzappvar.run(['$rootScope', function($rootScope){
    $rootScope.$on('$stateChangeStart', function () {
        $rootScope.stateIsLoading = true;
    });

    $rootScope.$on('$stateChangeSuccess',function(){
        $rootScope.stateIsLoading = false;
    });





}]);

r1headzappvar.config(function($stateProvider, $urlRouterProvider,$locationProvider) {
    $urlRouterProvider
        .otherwise("/index");


    $stateProvider
        .state('index',{
            url:"/index",
            views: {

                'content': {
                    templateUrl: 'partial/home.html' ,
                    controller: 'home'
                },
            }
        }
    )



    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false,
        hashPrefix:'!'
    });
});


r1headzappvar.controller('home', function($scope,$state,$cookieStore,$rootScope) {

});
