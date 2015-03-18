// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'rter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'some.controllers' is found in controllers.js

//register global namespace.


someone.app.$app = (function () {
    'use strict';

    var app = angular.module('someone', [
            'ionic',
            'ngCordova',
            'someone.controllers',
            'someone.services'
        ]),
        run, config;
    console.log(app);
    //app config: run block.

    run = [
        '$ionicPlatform',
        '$localStorage',
        '$location',
        '$cordovaSplashscreen',
        'PushNotificationHelper',
        '$rootScope',
        function ($ionicPlatform, $localStorage, $location, $cordovaSplashscreen, PushNotificationHelper, $rootScope) {
debugger;
            $ionicPlatform.ready(function () {
                // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                // for form inputs)
                if (window.cordova && window.cordova.plugins.Keyboard) {
                    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

                    setTimeout(function () {
                      $cordovaSplashscreen.hide();
                    }, 5000);
                }

                //register notification service for android
                if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
                    PushNotificationHelper.registerOnReady();
                }


                if (window.StatusBar) {
                    // org.apache.cordova.statusbar required
                    StatusBar.styleDefault();
                }
                console.log($localStorage.get('firsttimeSetup'));
                if ($localStorage.get('firsttimeSetup')!== 'true') {
                    console.log('goto first time setup');
                    setTimeout(function () {
                        $location.path('/firsttime/userinfo');
                    });
                }


            });
        }

    ];
    //#end run block.

    //config block.

    config = [
        '$stateProvider', '$urlRouterProvider',
        function ($stateProvider, $urlRouterProvider) {
            $stateProvider

                .state('app', {
                    url: "/app",
                    abstract: true,
                    templateUrl: "templates/app/main.html",
                    controller: 'AppCtrl'
                })


                .state('app.home', {
                    url: "/home",

                    views: {
                        'home-tab': {
                          controller: 'HomeCtrl as ctrl',
                            templateUrl: "templates/app/home.html"
                        }
                    }
                })

                .state('app.apt', {
                    url: '/apt',
                    views: {
                        'apt-tab': {
                            templateUrl: 'templates/app/apt.html',
                            controller:'AptController as ctrl'
                        }
                    }
                })
                .state('app.history', {
                    url: '/history',
                    views: {
                        'history-tab': {
                            templateUrl: 'templates/app/history.html'
                        }
                    }
                })
                .state('app.add_friend', {
                    url: '/friends/add',
                    views: {
                        'add_friend-tab': {
                            templateUrl: 'templates/app/add_friend.html'
                        }
                    }
                })
                .state('app.settings', {
                    url: '/settings',
                    views: {
                        'settings-tab': {
                            templateUrl: 'templates/app/settings.html'
                        }
                    }
                });

            $stateProvider.state('firsttime', {
                url: '/firsttime',
                abstract: true,
                templateUrl: 'templates/firsttime/firsttime.html',
                controller: 'FirstTimeCtrl',
                controllerAs: 'uInfo'
            })

                .state('firsttime.userinfo', {
                    url: '/userinfo',
                    templateUrl: 'templates/firsttime/firsttime-userinfo.html'

                })
                .state('firsttime.interestgender', {
                    url: '/interestgender',
                    templateUrl: 'templates/firsttime/firsttime-interest-gender.html'

                })
                .state('firsttime.availabletimes', {
                    url: '/availabletimes',
                    templateUrl: 'templates/firsttime/firsttime-available-times.html'
                });

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
