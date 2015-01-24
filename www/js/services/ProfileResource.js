/**
 * Created by Ho on 1/18/2015.
 */

someone.namespace('someone.services');

someone.services.ProfileResource = (function() {
    'use strict';

    var constructor = function($q, $timeout) {
        return {
          list:function(){},
          get:function(){
          var defered = $q.defer();

          $timeout(function(){
            
          }, 5000);

          return defered;
          }
        };
    };

    //Dependency Injection.
    constructor.$inject = ["$q","$timeout"];


    return constructor;
}());
