
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
