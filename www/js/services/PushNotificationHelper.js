/**
 * Created by Ho on 3/8/2015.
 */
someone.services.PushNotificationHelper = (function () {
    'use strict';


    constructor.$inject = ["$cordovaPush", "$ionicPlatform", "$rootScope"];

    function constructor($cordovaPush, $ionicPlatform, $rootScope) {
        debugger;
        var registerConfig = {}, registerCallBack, iosNotificationReceiver, androidNotificationReceiver;

        if (ionic.Platform.isAndroid()) {
            registerConfig = {
                senderID: someone.configuration.gcm.app_id
            };

            //register callback when user on android device.
            registerCallBack = function (result) {
                console.log(result);
            };

            //handle when user get notification on anroid device.
            androidNotificationReceiver = function(event, notification){

            };

        } else if (ionic.Platform.isIOS()) {
            registerConfig = {
                "badge": true,
                "sound": true,
                "alert": true
            };
            //@TODO: register callback when user on ios device
            registerCallBack = function (result) {
                throw "Need implement callback for ios devices";
            };
            //@TODO: handle when user get notification on ios device.
            iosNotificationReceiver = function(event, notification){
                throw "Need implement callback for ios devices";
            };
        }

        return {
            registerOnReady: function () {
                $cordovaPush.register(registerConfig).then(registerCallBack);
            },
            registerReceiver: function () {
                if (ionic.Platform.isAndroid()) {
                    $rootScope.on("$cordovaPush:notificationReceived", androidNotificationReceiver);
                } else if (ionic.Platform.isIOS()) {
                    $rootScope.on("$cordovaPush:notificationReceived", iosNotificationReceiver);
                }
            }
        };
    }


    return constructor;
}());