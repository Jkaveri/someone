// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'rter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'some.controllers' is found in controllers.js

//register global namespace.
someone.namespace('someone.app');

someone.app.$app = (function() {
  'use strict';

  var app = angular.module('someone', ['ionic', 'someone.controllers']),
    run, config;
  console.log(app);
  //app config: run block.

  run = [
    '$ionicPlatform',
    function($ionicPlatform) {
      $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
          // org.apache.cordova.statusbar required
          StatusBar.styleDefault();
        }
      });
    }

  ];
  //#end run block.

  //config block.

  config = [
    '$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
      $stateProvider

        .state('app', {
        url: "/app",
        abstract: true,
        templateUrl: "templates/menu.html",
        controller: 'AppCtrl'
      })


      .state('app.home', {
        url: "/home",
        views: {
          'menuContent': {
            templateUrl: "templates/home.html",
            controller: 'HomeCtrl'
          }
        }
      })

      // if none of the above states are matched, use this as the fallback
      $urlRouterProvider.otherwise('/app/home');
    }
  ];
  //#end config block.







  //register run block.
  app.run(run);

  //register config block.
  app.config(config);



  return app;
}());
