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
