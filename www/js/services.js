someone.services.$module = (function () {
    'use strict';

    var m = angular.module('someone.services', ["ionic", "ngCordova"]);

    //register LocalStorage service.
    m.factory('$localStorage', someone.services.LocalStorage);

    //register LocalStorage service.
    m.factory('$collectionUtil', someone.services.CollectionUtil);
    //register LocalStorage service.
    m.factory('UserResource', someone.services.UserResource);
    //register LocalStorage service.
    m.factory('UserDeviceResource', someone.services.UserDeviceResource);
    debugger;
    console.log(someone.services.PushNotificationHelper);
    //register PushNotificationHelper service.
    m.factory('PushNotificationHelper', someone.services.PushNotificationHelper);


    return m;
}());
