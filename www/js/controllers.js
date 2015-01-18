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
