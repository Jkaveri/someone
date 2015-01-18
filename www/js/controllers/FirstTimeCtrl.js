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
