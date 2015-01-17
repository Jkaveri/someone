someone.namespace('someone.controllers');

someone.controllers.FirstTimeCtrl = (function() {
  'use strict';

  var constructor = function($scope, $ionicModal, $timeout, $location,$localStorage) {

    var self = $scope;

    self.user = {};

    self.next = function(step){
      if(step == 'interest'){
        $location.path('/firsttime/interestwith');
      }else if(step == 'available_time'){
        $location.path('/firsttime/availabletimes');
      }else if(step == 'userinfo'){
        $location.path('/firsttime/userinfo');
      }

    };

    self.saveUserInfo = function(){
        var user = $localStorage.get('user');

        user = angular.extend(user, self.user);


        $localStorage.set('user', user);
    };

  };

  //Dependency Injection.
  constructor.$inject = ["$scope", "$ionicModal", "$timeout", "$location", "$localStorage"];

  return constructor;
}());
