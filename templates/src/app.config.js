(function() {
  'use strict';

  angular.module('app').config(config)

  config.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider']

  function config($stateProvider, $urlRouterProvider, $locationProvider){

    // this line is optional
    $locationProvider.html5Mode(true)

    $stateProvider
      .state({
        name: 'home',
        url: '/',
        component: 'home',
      })
      .state({
        name: 'csvmanage',
        url: '/csvmanage',
        component: 'csvmanage',
      })
      .state({
        name: 'regression',
        url: '/regression',
        component: 'regression',
        params: {
          matrixObj: {
            C: 'no data',
            bHat: 'no data',
            X: 'no data',
            y: 'no data',
            n: 'no data',
            k: 'no data',
            p: 'no data'
          }
        },
      });
  }

}());
