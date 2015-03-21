/**
 * Created by Ho on 3/20/2015.
 */
(function(){
    angular
        .module('someone.initialsetup')
        .controller('InitialSetup', InitialSetup);

    InitialSetup.$inject = ['UserService'];

    /* @ngInject */
    function InitialSetup(UserService) {
        /* jshint validthis: true */
        var vm = this;

        vm.activate = activate;
        vm.title = 'InitialSetup';

        activate();

        ////////////////

        function activate() {
        }


    }
}());