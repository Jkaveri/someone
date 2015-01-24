someone.namespace('someone.controllers');

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
