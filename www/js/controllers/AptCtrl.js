someone.namespace('someone.controllers');

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
