/**
 * Created by Ho on 1/18/2015.
 */

someone.namespace('someone.services');

someone.services.UserResource = (function () {
    'use strict';

    var constructor = function ($q, $http) {
        var root = "http://localhost:3000/api/users";
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

    //Dependency Injection.
    constructor.$inject = ["$q", "$http"];


    return constructor;
}());
