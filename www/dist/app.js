(function() {

  'use strict';
  var someone = window.someone || {};

  /***
   * register a name space in someone.
   * @string namespace
   */
  someone.namespace = function(namespace) {
    var parts = namespace.split('.'),
      parent = someone,
      i;
    // strip redundant leading global
    if (parts[0] === "someone") {
      parts = parts.slice(1);
    }
    for (i = 0; i < parts.length; i += 1) {
      // create a property if it doesn't exist
      if (typeof parent[parts[i]] === "undefined") {
        parent[parts[i]] = {};
      }
      parent = parent[parts[i]];
    }
    return parent;
  };


  /***
   * Extend object properties.
   */
  someone.extend = function(parent, child) {
    var i;
    child = child || {};
    for (i in parent) {
      if (parent.hasOwnProperty(i) && !child.hasOwnProperty(i)) {
        child[i] = parent[i];
      }
    }
    return child;
  };


  someone.override = function(base, method) {


    if (typeof(base) !== 'function') {
      //define noop function.
      base = function() {};
    }

    if (typeof(method) !== 'function')
      throw "Invalid operation!";

    return function() {
      var args = Array.prototype.slice.call(arguments);
      args = [base].concat(args);
      //console.log(args);
      return method.apply(this, args);
    };
  };

  /**
   * Encode html.
   */
  someone.htmlEncode = function(html) {
    return document.createElement('a').appendChild(
      document.createTextNode(html)).parentNode.innerHTML;
  };
  /**
   * Decode html.
   */
  someone.htmlDecode = function(html) {
    var a = document.createElement('a');
    a.innerHTML = html;
    return a.textContent;
  };


  /**
   * A method that help to remove first item of arguments.
   * @object arguments
   */
  someone.removeFirstArgument = function(args) {
    if (args.length > 0) {
      return Array.prototype.slice.call(args, 1);
    }
    return [];
  };

  window.someone = someone;
}());

someone.namespace('someone.services');

someone.services.LocalStorage = (function() {
  'use strict';

  var constructor = function($window) {
    return {
      set: function(key, value) {
        $window.localStorage[key] = value;
      },
      get: function(key, defaultValue) {
        return $window.localStorage[key] || defaultValue;
      },
      setObject: function(key, value) {
        $window.localStorage[key] = JSON.stringify(value);
      },
      getObject: function(key) {
        return JSON.parse($window.localStorage[key] || '{}');
      }
    };
  };

  //Dependency Injection.
  constructor.$inject = ["$window"];


  return constructor;
}());

someone.namespace('someone.services');

someone.services.$module = (function(){
  'use strict';

  var module = angular.module('someone.services',[]);

  //register LocalStorage service.
  module.factory('$localStorage',someone.services.LocalStorage);


  return module;
}());

someone.namespace('someone.controllers');

someone.controllers.AppCtrl = (function() {
  'use strict';

  var constructor = function($scope, $ionicModal, $timeout, $location) {
    console.log('AptCtrl');
  //  $location.path('/firsttime/userinfo');
  };

  //Dependency Injection.
  constructor.$inject = ["$scope", "$ionicModal", "$timeout", "$location"];

  return constructor;
}());

someone.namespace('someone.controllers');

someone.controllers.FirstTimeCtrl = (function() {
  'use strict';

  var constructor = function($scope, $ionicModal, $timeout, $location, $localStorage, $state) {

    var self = $scope;
    var step_prefix = "firsttime.";
    var steps = ["userinfo", "interestgender", "availabletimes"];
    var current_step = "userinfo";
    var current_index = 0;

    //#region public properties;

    //user data.
    self.user = {};

    //determine user can go to previous step.
    self.canGoBack = false;

    //determine user can go to next step.
    self.canGoNext = true;

    //determine current step is last step.
    self.isLastStep = false;
    
    //#endregion public properties.


    //#region private functions.

    var goto = function(index) {
      var step = steps[index];
      var stateName = step_prefix + step;
      //goto state
      $state.go(stateName);
    };

    var isCanGoBack = function() {
      return current_index > 0;
    };

    var isCanGoNext = function() {

      return current_index < steps.length - 1;
    };

    var refreshNavState = function() {
      //determine is can go next
      self.canGoNext = isCanGoNext();
      self.canGoBack = isCanGoBack();

      //determine this is last step.
      self.isLastStep = current_index == steps.length - 1;

    };

    // #endregion private methods

    //#region public methods.

    //go back.
    self.back = function() {

      if (!self.canGoBack) {
        return;
      }

      current_index = current_index - 1;


      //refresh naviagtion state.
      refreshNavState();

      try {

        goto(current_index);

      } catch (e) {
        console.log(e);
        return false;
      }

      return true;
    };

    //go next
    self.next = function(step) {

      if (!self.canGoNext) {
        return;
      }

      current_index++;

      //refresh naviagtion state.
      refreshNavState();

      try {
        goto(current_index);
      } catch (e) {
        console.log(e);
        return false;
      }

      return true;

    };


    //send user's info to server.
    self.save = function() {
      var user = $localStorage.get('user');

      user = angular.extend(user, self.user);


      $localStorage.set('user', user);

      console.log(user);
    };

    //#endregion public methods.

  };

  //Dependency Injection.
  constructor.$inject = ["$scope", "$ionicModal", "$timeout", "$location", "$localStorage", "$state"];

  return constructor;
}());


someone.namespace('someone.controllers');

someone.controllers.HomeCtrl = (function(){
  'use strict';

  var constructor = function($scope){


  };

  constructor.$inject = ["$scope"];

  return constructor;
}());


someone.namespace('someone.controllers');

someone.controllers.UserInfoCtrl = (function(){
  'use strict';

  var constructor = function($scope){


  };

  constructor.$inject = ["$scope"];

  return constructor;
}());

someone.namespace("someone.controllers");

someone.controllers.$module = (function() {

  'use strict';

  console.log(someone);
  //create angular 'someone.controllers' module.
  var module = angular.module('someone.controllers', []);

  //reigster app controller.
  module.controller('AppCtrl', someone.controllers.AppCtrl);
  //register user info controller.
  module.controller('UserInfoCtrl', someone.controllers.UserInfoCtrl);
  //register user info controller.
  module.controller('HomeCtrl', someone.controllers.HomeCtrl);

  //register firstime user info.
  module.controller('FirstTimeCtrl',someone.controllers.FirstTimeCtrl);

  return module;
}());

// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'rter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'some.controllers' is found in controllers.js

//register global namespace.
someone.namespace('someone.app');

someone.app.$app = (function() {
  'use strict';

  var app = angular.module('someone', [
    'ionic',
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
    function($ionicPlatform, $localStorage, $location) {
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

        if(!$localStorage.get('firstTimeSetup')){
          console.log('goto first time setup');
          $location.path('/firsttime/userinfo');
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
        templateUrl: "templates/app/main.html",
        controller: 'AppCtrl'
      })


      .state('app.home', {
        url: "/home",
        views: {
          'home-tab': {
            templateUrl: "templates/app/home.html",
            controller: 'HomeCtrl'
          }
        }
      })

      .state('app.apt', {
          url: '/apt',
          views: {
            'apt-tab': {
              templateUrl: 'templates/app/apt.html'
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
          abstract:true,
          templateUrl: 'templates/firsttime.html',
          controller: 'FirstTimeCtrl',
          controllerAs:'uInfo'
        })

        .state('firsttime.userinfo', {
          url: '/userinfo',
          templateUrl: 'templates/firsttime-userinfo.html',

        })
        .state('firsttime.interestgender',{
          url:'/interestgender',
          templateUrl: 'templates/firsttime-interest-gender.html',

        })
        .state('firsttime.availabletimes', {
         url:'/availabletimes',
         templateUrl: 'templates/firsttime-available-times.html',
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
