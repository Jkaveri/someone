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

  /***
   * Create method for String. that help to make capitalize word
   * @returns {string}
   */
  String.prototype.toCapitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
  };

  window.someone = someone;
}());

/**
 * Created by Ho on 3/8/2015.
 */

//register namespace someone.
someone.namespace("someone");
//register namespace someone.controllers
someone.namespace("someone.controllers");
//register namespace someone.services
someone.namespace("someone.services");
//register namespace someone.app
someone.namespace('someone.app');

/**
 * Created by Ho on 3/8/2015.
 */


someone.configuration = (function () {
    return {
        apiBaseUrl: "http://henry.com:3000/api",
        gcm: {
            api_key: "",
            app_id: ""
        }
    };
}());
/**
 * Created by Ho on 1/18/2015.
 */
someone.services.CollectionUtil = (function() {
    'use strict';

    var constructor = function() {
        return {
            filter: function(array, criteria) {
                var results = [];
                for(var i  = 0; i < array.length ; i++){
                    if(criteria(array[i])){
                        results.push(array[i])
                    }
                }
                return results;
            },
            map:function(array, fnc){
                var results = [];
                for(var i  = 0; i < array.length ; i++){
                    var newItem = fnc(array[i]);
                    results.push(newItem)
                }
                return results;
            }
        };
    };

    //Dependency Injection.
    constructor.$inject = [];


    return constructor;
}());

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
         try{
           return JSON.parse($window.localStorage[key] || '{}');
         }catch(e){
           console.log(e);
           return null;
         }
      }
    };
  };

  //Dependency Injection.
  constructor.$inject = ["$window"];


  return constructor;
}());

/**
 * Created by Ho on 1/18/2015.
 */

someone.services.MockData = (function() {
    'use strict';

    var constructor = function() {
        return {
          profile:{
            id:"1",
            userId:"123",
            firstName:"Ho",
            lastName:"Nguyen",
            age: 18,
            address:{
              latitude:10,
              longitude: 10,
              address: "2/142 Thien Phuoc, P.9, Q. Tan Binh, Tp. Ho Chi Minh",
            },
            gender: "Male",
            interestGenders:["female", "male"],
          },
          appointment:{
            id:"1"
          },
        };
    };

    //Dependency Injection.
    constructor.$inject = [];


    return constructor;
}());

/**
 * Created by Ho on 3/8/2015.
 */
someone.services.PushNotificationHelper = (function () {
    'use strict';


    constructor.$inject = ["$cordovaPush", "$ionicPlatform", "$rootScope"];

    function constructor($cordovaPush, $ionicPlatform, $rootScope) {
        debugger;
        var registerConfig = {}, registerCallBack, iosNotificationReceiver, androidNotificationReceiver;

        if (ionic.Platform.isAndroid()) {
            registerConfig = {
                senderID: someone.configuration.gcm.app_id
            };

            //register callback when user on android device.
            registerCallBack = function (result) {
                console.log(result);
            };

            //handle when user get notification on anroid device.
            androidNotificationReceiver = function(event, notification){

            };

        } else if (ionic.Platform.isIOS()) {
            registerConfig = {
                "badge": true,
                "sound": true,
                "alert": true
            };
            //@TODO: register callback when user on ios device
            registerCallBack = function (result) {
                throw "Need implement callback for ios devices";
            };
            //@TODO: handle when user get notification on ios device.
            iosNotificationReceiver = function(event, notification){
                throw "Need implement callback for ios devices";
            };
        }

        return {
            registerOnReady: function () {
                $cordovaPush.register(registerConfig).then(registerCallBack);
            },
            registerReceiver: function () {
                if (ionic.Platform.isAndroid()) {
                    $rootScope.on("$cordovaPush:notificationReceived", androidNotificationReceiver);
                } else if (ionic.Platform.isIOS()) {
                    $rootScope.on("$cordovaPush:notificationReceived", iosNotificationReceiver);
                }
            }
        };
    }


    return constructor;
}());
/**
 * Created by Ho on 3/8/2015.
 */

someone.services.UserDeviceResource = (function () {
    'use strict';

    //injection
    constructor.$inject = ["$q", "$http"];


    function constructor($q, $http) {
        var root = someone.configuration.apiBaseUrl + "/UserDevices";

        return {
            save: function (entity) {
                var deferred = $q.defer();
                $http.post(root, entity)
                    .success(function (data, status) {
                        deferred.resolve(data, status);
                    })
                    .error(function (data, status) {
                        deferred.reject(data, status);
                    });
                console.log(deferred);

                return deferred.promise;
            }
        };

    }


    return constructor;
}());
/**
 * Created by Ho on 1/18/2015.
 */

someone.services.UserResource = (function () {
    'use strict';

    //Dependency Injection.
    constructor.$inject = ["$q", "$http"];
    //constructor
    function constructor ($q, $http) {
        var root = someone.configuration.apiBaseUrl + "/users";
        return {
            list: function () {
            },
            get: function () {
            },
            save: function (user) {
                var deferred = $q.defer();
                $http.post(root, user)
                    .success(function (data, status) {
                        deferred.resolve(data, status);
                    })
                    .error(function (data, status) {
                        deferred.reject(data, status);
                    });
                console.log(deferred);
                return deferred.promise;
            }
        };
    };




    return constructor;
}());

someone.services.$module = (function () {
    'use strict';

    var m = angular.module('someone.services', ["ionic", "ngCordova"]);

    //register LocalStorage service.
    m.factory('$localStorage', someone.services.LocalStorage);

    //register LocalStorage service.
    m.factory('$collectionUtil', someone.services.CollectionUtil);
    //register LocalStorage service.
    m.factory('UserResource', someone.services.UserResource);
    //register LocalStorage service.
    m.factory('UserDeviceResource', someone.services.UserDeviceResource);
    debugger;
    console.log(someone.services.PushNotificationHelper);
    //register PushNotificationHelper service.
    m.factory('PushNotificationHelper', someone.services.PushNotificationHelper);


    return m;
}());



someone.controllers.AddFriendCtrl = (function(){
  'use strict';

  var constructor = function($scope){
    var self = $scope;
  

  };

  constructor.$inject = ["$scope"];

  return constructor;
}());


someone.controllers.AppCtrl = (function() {
  'use strict';

  var constructor = function($scope, $ionicModal, $timeout, $location) {
    this.home_title = "Home";
    console.log('AptCtrl');
  //  $location.path('/firsttime/userinfo');
  };

  //Dependency Injection.
  constructor.$inject = ["$scope", "$ionicModal", "$timeout", "$location"];

  return constructor;
}());


someone.controllers.AptCtrl = (function() {
  'use strict';

  /**
   * Appointment controller
   */
  var constructor = function($scope, $timeout, $q) {
    var self = this;



    var init = function() {
      get();
    };

    var get = function() {
      var defered = $q.defer();

      self.isLoading = true;

      $timeout(function() {
        self.apt = {
           time: moment().add(2, 'd'),
           location: {
             latitude:10,
             longitude:108,
             address:'Toa Nha Internation Plaza - 343 pham ngu lao, P. pham ngu lao, Quan 1, tp. Ho Chi Minh'
           }
        };

        self.isLoading = false;
        defered.resolve();
      }, 5000);

      return defered;
    };



    /**
     * Appointment instance.
     */
    self.apt = null;

    /**
     * Determine is loading dat
     */
    self.isLoading = false;






  };

  constructor.$inject = ["$scope", "$timeout", "$q"];

  return constructor;
}());


someone.controllers.FirstTimeCtrl = (function () {
    'use strict';

    var constructor = function ($scope, $ionicModal, $timeout, $location, $localStorage, $state, userRes) {

        var self = $scope;
        var step_prefix = "firsttime.";
        var steps = ["userinfo", "interestgender", "availabletimes"];
        var current_index = 0;
        var lorem = new Lorem();


        //#region private functions.
        /***
         * go to a step by index
         * @param index
         */
        var goto = function (index) {
            var step = steps[index];
            var stateName = step_prefix + step;
            //goto state
            $state.go(stateName);
        };
        /***
         * help to determine can go to back.
         * @returns {boolean}
         */
        var isCanGoBack = function () {
            return current_index > 0;
        };
        /***
         * help to determine can go to next.
         * @returns {boolean}
         */
        var isCanGoNext = function () {

            return current_index < steps.length - 1;
        };

        /***
         * reset the navigation (back|next) state.
         */
        var refreshNavState = function () {
            //determine is can go next
            self.canGoNext = isCanGoNext();
            self.canGoBack = isCanGoBack();

            //determine this is last step.
            self.isLastStep = current_index == steps.length - 1;

        };

        /***
         * init days of week array with default value.
         * can use to reset.
         * Sun as 0, Sat as 6
         */
        var initDaysOW = function () {
            self.daysOW = [
                {title: "Sun", select: false, value: 0},
                {title: "Mon", select: false, value: 1},
                {title: "Tue", select: false, value: 2},
                {title: "Wed", select: false, value: 3},
                {title: "Thu", select: false, value: 4},
                {title: "Fri", select: false, value: 5},
                {title: "Sat", select: false, value: 6}
            ];
        };


        /***
         * serialize data from daysOW array to available-time item.
         * @param availableTime
         */
        var saveSelectedDaysOW = function (availableTime) {
            var str = "", count = self.daysOW.length, item;
            if (!self.daysOW || count < 1) return "";

            availableTime.daysOW = [];

            for (var i = 0; i < count; i++) {
                item = self.daysOW[i];
                if (item.selected) {
                    str += item.title + ",";
                    //save selected value
                    availableTime.daysOW.push(item.value);
                }
            }
            //set days of week string (present to user).
            availableTime.daysOWStr = str.substr(0, str.length - 1);
        };

        /***
         * Save interest genders to user.
         */
        var saveInterestGenders = function (user) {
            var count = self.interestGenders.length;
            user.interestGenders = [];
            for (var i = 0; i < count; i++) {
                if (self.interestGenders[i].selected) {
                    //add selected item's value to user.
                    user.interestGenders.push(self.interestGenders[i].value);
                }
            }
        };
        /***
         * Help to save available times to user.
         * Convert from: {
         *   daysOWStr:"Mon,Thu",
         *   daysOW:[1, 4],
         *   time: 19:30,
         *   duration: 1
         * }
         * to: [
         *    {
         *      dayOW: 1,
         *      items:[
         *          {time: 19*60+30, duration: 1}
         *      ]
         *    },
         *    {
         *      dayOW: 4,
         *      items:[
         *          {time: 19*60+30, duration: 1}
         *      ]
         *    }
         * ]
         */
        var saveFreeTimes = function (user) {
            var count = self.freeTimes.length, item, timeRange, daysOW,freeTime,
                freeTimes =[], time, cached = [];
            //loop over free times (user's input).
            for (var i = 0; i < count; i++) {
                //get item
                item = self.freeTimes[i];
                //day of weeks of this item.
                daysOW = item.daysOW;
                //no need to do any thing if user not select day of week.
                if (!daysOW || daysOW.length < 1) continue;

                //parse time to moment.
                time = moment(item.time);
                 //convert time to interger.
                //to minutes.
                time = time.hours()*60+time.minutes();

                timeRange = {time: time, duration: item.duration};

                for (var j = 0; j < daysOW.length; j++) {
                    var dayOW = daysOW[j], index = j;
                    if(cached[dayOW] > -1){
                        freeTime = freeTimes[cached[dayOW]];
                    }else{
                        freeTime = {
                            dayOW: daysOW[j],
                            items: []
                        };
                    }

                    //push time range into item.
                    freeTime.items.push(timeRange);

                    freeTimes.push(freeTime);
                }

            }

            user.freeTimes = freeTimes;
        };

        // #endregion private methods


        //#region public properties;
        self.freeTimes = [{
            daysOWStr: "Fri,Sat",
            daysOW: [5,6],
            time: new Date(2015, 1, 1, 18, 30, 0, 0),
            duration: 1
        }];

        //user data.
        self.user = {
            firstName: lorem.createText(1,Lorem.TYPE.WORD).toCapitalize(),
            lastName: lorem.createText(1,Lorem.TYPE.WORD).toCapitalize(),
            birthday: new Date( Date.UTC(1992, 0, 8) ),
            gender: "male",
            interestGenders: [],
            /***
             * this field contain all available item. it map
             */
            freeTimes:[],
            address: lorem.createText(5, Lorem.TYPE.WORD),
            email: lorem.createText(2, Lorem.TYPE.WORD).replace(" ","_") + "@local.com",
            phone: 123456789,
            password:123

        };

        //determine user can go to previous step.
        self.canGoBack = false;

        //determine user can go to next step.
        self.canGoNext = true;

        //determine current step is last step.
        self.isLastStep = false;


        //day of month collection
        self.daysOW = [];

        //cache current editting times item.
        self.current_available_time = null;

        //interest genders
        self.interestGenders = [
            {title: "Male", selected: false, value: "male"},
            {title: "Female", selected: true, value: "female"}
        ];

        //#endregion public properties.

        //#region initialize


        //init dayOMs

        initDaysOW();

        //init ionicModal
        $ionicModal.fromTemplateUrl("templates/modal/select-days-of-week.html", {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            self.modal = modal;
        });


        //#endregion init dayOMs.


        //#region public methods.

        //go back.
        self.back = function () {

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
        self.next = function (step) {

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
        self.save = function () {
            var user = $localStorage.getObject('user') || {};
            //retrieve old value from database.
            user = angular.extend(user, self.user);
            //set interest value.
            saveInterestGenders(user);
            //save available times.
            saveFreeTimes(user);

            userRes.save(user).then(
                //success
                function (u) {
                    $localStorage.setObject('user', u);
                    $localStorage.set('firsttimeSetup', true);
                    $timeout(function () {
                        $location.path('/app/home');
                    });
                },
                //error.
                function () {
                    alert('err');
                }
            );


            console.log(user);
        };


        self.addAvailableTime = function () {
            self.freeTimes.push({
                time: null,
                duration: 0
            });
        };

        self.removeAvailableTime = function (item) {
            var index = self.freeTimes.indexOf(item);
            if (index > -1) {
                self.freeTimes.splice(index, 1);
            }
        };


        self.getItemHeight = function (item, index) {
            //Make evenly indexed items be 10px taller, for the sake of example
            return (index % 2) === 0 ? 150 : 160;
        };


        self.selectDaysOW = function (item) {

            self.current_available_time = item;

            if (item && item.daysOW.length > 0) {
                //deserialize selected item form available time.
                for (var i = 0; i < self.daysOW.length; i++) {
                    self.daysOW[i].selected = item.daysOW.indexOf(self.daysOW[i].value) > -1;
                }
            }


            $scope.modal.show();
        };

        self.closeSelectDaysOWModal = function (param) {
            if (param === "ok") {
                saveSelectedDaysOW(self.current_available_time);
            }
            //reset daysOW
            initDaysOW();
            self.modal.hide();
        };


        self.addItem = function(){
          self.freeTimes.push({
              daysOWStr: "Fri, Sat",
              daysOW: [5,6],
              time: null,
              duration: 1
          });
        };

        self.removeItem = function(item){
            var index = self.freeTimes.indexOf(item);
            if(index > -1){
                self.freeTimes.splice(index, 1);
            }
        };

        //#endregion public methods.


        //#region events
        //Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function () {
            $scope.modal.remove();
        });
        //#endregion events.
    };

    //Dependency Injection.
    constructor.$inject = ["$scope", "$ionicModal", "$timeout", "$location", "$localStorage", "$state", "UserResource"];

    return constructor;
}());


someone.controllers.HomeCtrl = (function() {
  'use strict';

  var constructor = function($scope) {

    var self = this;
    var fapN = 1;

    
    self.fap = function() {
      console.log('fap' + fapN++);
    };


  };

  constructor.$inject = ["$scope"];

  return constructor;
}());



someone.controllers.SettingsCtrl = (function(){
  'use strict';

  var constructor = function($scope){
    var self = $scope;
    

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
  module.controller('HomeCtrl', someone.controllers.HomeCtrl);
  //register firstime user info.
  module.controller('FirstTimeCtrl',someone.controllers.FirstTimeCtrl);
  //register
  module.controller('AddFriendCtrl',someone.controllers.AddFriendCtrl);
  //register firstime user info.
  module.controller('SettingsCtrl',someone.controllers.SettingsCtrl);

  //register firstime user info.
  module.controller('AptController',someone.controllers.AptCtrl);

  return module;
}());

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
        function ($ionicPlatform, $localStorage, $location, $cordovaSplashscreen, PushNotificationHelper) {
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

                //register notification service for android.
                console.log(ionic.Platform.isWebView());
                if(!ionic.Platform.isWebView()){
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
                            templateUrl: "templates/app/home.html",

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
                templateUrl: 'templates/firsttime.html',
                controller: 'FirstTimeCtrl',
                controllerAs: 'uInfo'
            })

                .state('firsttime.userinfo', {
                    url: '/userinfo',
                    templateUrl: 'templates/firsttime-userinfo.html'

                })
                .state('firsttime.interestgender', {
                    url: '/interestgender',
                    templateUrl: 'templates/firsttime-interest-gender.html'

                })
                .state('firsttime.availabletimes', {
                    url: '/availabletimes',
                    templateUrl: 'templates/firsttime-available-times.html'
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
