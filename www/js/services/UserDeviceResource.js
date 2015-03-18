/**
 * Created by Ho on 3/8/2015.
 */

someone.services.UserDeviceResource = (function () {
    'use strict';

    //injection
    constructor.$inject = ["$q", "$http"];


    function constructor($q, $http) {
        var root = someone.configuration.apiBaseUrl + "/UserDevices";

        return {
            save: function (entity) {
                var deferred = $q.defer();
                $http.post(root, entity)
                    .success(function (data, status) {
                        deferred.resolve(data, status);
                    })
                    .error(function (data, status) {
                        deferred.reject(data, status);
                    });

                return deferred.promise;
            }
        };

    }


    return constructor;
}());