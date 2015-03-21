/*global someone*/
someone.controllers.AppCtrl = (function () {
    'use strict';

    //Dependency Injection.
    Constructor.$inject = ['$ionicModal', '$timeout', '$location'];

    function Constructor($ionicModal, $timeout, $location) {
        var vm = this;
        vm.homeTitle = 'Home';

        //  $location.path('/firsttime/userinfo');
    }

    return Constructor;

}());
