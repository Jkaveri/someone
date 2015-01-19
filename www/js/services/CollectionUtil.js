/**
 * Created by Ho on 1/18/2015.
 */

someone.namespace('someone.services');

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
