/*global someone*/
someone.namespace('someone.controllers');

someone.controllers.$module = (function () {

    'use strict';

    //create angular 'someone.controllers' module.
    var module = angular.module('someone.controllers', []);

    //reigster app controller.
    module.controller('AppCtrl', someone.controllers.AppCtrl);
    //register user info controller.
    module.controller('HomeCtrl', someone.controllers.HomeCtrl);
    //register firstime user info.
    module.controller('FirstTimeCtrl', someone.controllers.FirstTimeCtrl);
    //register
    module.controller('AddFriendCtrl', someone.controllers.AddFriendCtrl);
    //register firstime user info.
    module.controller('SettingsCtrl', someone.controllers.SettingsCtrl);

    //register firstime user info.
    module.controller('AptController', someone.controllers.AptCtrl);

    return module;
}());
