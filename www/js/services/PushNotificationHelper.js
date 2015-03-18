/**
 * Created by Ho on 3/8/2015.
 */
someone.services.PushNotificationHelper = function () {
    'use strict';

    var androidNotificationReceiver, iosNotificationReceiver;

    constructor.$inject = [];

    constructor.static = {
        onNotification: function (e) {
            if (ionic.Platform.isAndroid()) {
                androidNotificationReceiver(e);
            } else if (ionic.Platform.isIOS()) {
                iosNotificationReceiver(e);
            }
        }
    };

    function constructor() {
        debugger;
        var registerConfig = {}, registerCallBack, registerError,
            pushNotification;


        if (ionic.Platform.isAndroid()) {
            registerConfig = {
                "senderID": someone.configuration.gcm.app_id,
                "ecb": "someone.services.PushNotificationHelper.static.onNotification"
            };

            //register callback when user on android device.
            registerCallBack = function (result) {
                console.log(result);
            };

            //handle when user get notification on anroid device.
            androidNotificationReceiver = function (notification) {
                debugger;
                switch (notification.event) {
                    case 'registered':
                        if (notification.regid.length > 0) {
                            alert('registration ID = ' + notification.regid);
                        }
                        break;

                    case 'message':
                        // this is the actual push notification. its format depends on the data model from the push server
                        alert('message = ' + notification.message + ' msgCount = ' + notification.msgcnt);
                        break;

                    case 'error':
                        alert('GCM error = ' + notification.msg);
                        break;

                    default:
                        alert('An unknown GCM event has occurred');
                        break;
                }
            };

            //
            registerError = function () {
                alert('could not reigster notification');
            }

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
            iosNotificationReceiver = function (event, notification) {
                throw "Need implement callback for ios devices";
            };

            registerError = function () {
                alert('could not reigster notification');
            }
        }

        function getPushNotification() {
            return window.plugins ? window.plugins.pushNotification : null;
        }

        return {
            registerOnReady: function () {

                pushNotification = getPushNotification();

                if (pushNotification) {
                    pushNotification.register(registerCallBack, registerError, registerConfig);
                } else {
                    alert("Missing Push Notification Plugin");
                }
            }
        };
    }


    return constructor;

}();