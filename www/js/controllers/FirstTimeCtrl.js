someone.namespace('someone.controllers');

someone.controllers.FirstTimeCtrl = (function () {
    'use strict';

    var constructor = function ($scope, $ionicModal, $timeout, $location, $localStorage, $state, $collectionUtil) {

        var self = $scope;
        var step_prefix = "firsttime.";
        var steps = ["userinfo", "interestgender", "availabletimes"];
        var current_index = 0;


        //#region private functions.
        /***
         * go to a step by index
         * @param index
         */
        var goto = function (index) {
            var step = steps[index];
            var stateName = step_prefix + step;
            //goto state
            $state.go(stateName);
        };
        /***
         * help to determine can go to back.
         * @returns {boolean}
         */
        var isCanGoBack = function () {
            return current_index > 0;
        };
        /***
         * help to determine can go to next.
         * @returns {boolean}
         */
        var isCanGoNext = function () {

            return current_index < steps.length - 1;
        };

        /***
         * reset the navigation (back|next) state.
         */
        var refreshNavState = function () {
            //determine is can go next
            self.canGoNext = isCanGoNext();
            self.canGoBack = isCanGoBack();

            //determine this is last step.
            self.isLastStep = current_index == steps.length - 1;

        };

        /***
         * init days of week array with default value.
         * can use to reset.
         */
        var initDaysOW = function () {
            self.daysOW = [
                {title: "Mon", select: false, value: 0},
                {title: "Tue", select: false, value: 1},
                {title: "Wed", select: false, value: 2},
                {title: "Thu", select: false, value: 3},
                {title: "Fri", select: false, value: 4},
                {title: "Sat", select: false, value: 5},
                {title: "Sun", select: false, value: 6}
            ];
        };


        /***
         * serialize data from daysOW array to available-time item.
         * @param availableTime
         */
        var saveSelectedDaysOW = function (availableTime) {
            var str = "", count = self.daysOW.length, item;
            if (!self.daysOW || count < 1) return "";

            availableTime.daysOW = [];

            for (var i = 0; i < count; i++) {
                item = self.daysOW[i];
                if (item.selected) {
                    str += item.title + ",";
                    //save selected value
                    availableTime.daysOW.push(item.value);
                }
            }
            //set days of week string (present to user).
            availableTime.daysOWStr = str.substr(0, str.length - 1);
        };

        /***
         * Save interest genders to user.
         */
        var saveInterestGenders = function(){
          var count = self.interest_genders.length;
            for(var i = 0; i< count; i++){
                if(self.interest_genders[i].selected){
                    //add selected item's value to user.
                    self.user.interest_genders.push(self.interest_genders[i].value);
                }
            }
        };
        /***
         * Help to save available times to user.
         */
        var saveAvailableTimes = function(){
           var count = self.available_times.length, item, obj, daysOW,
                available_times = self.user.available_times || {};

              for(var i = 0; i < count ; i++){
                item = self.available_times[i];
                daysOW = item.daysOW;
                //no need to do any thing if user not select day of week.
                if(!daysOW || daysOW.length < 1) continue;

                obj = {time: item.time, duration: item.duration};

                for(var j = 0; j < daysOW.length; j++){
                    if(available_times[daysOW[j]] == null){
                        //init array
                        available_times[daysOW[j]] = [];
                    }
                    //set available time.
                    //key is day of week.
                    available_times[daysOW[j]].push(obj);
                }
            }

            self.user.available_times = available_times;
        };

        // #endregion private methods


        //#region public properties;
        self.available_times = [{
            daysOWStr: "",
            daysOW: [],
            time: null,
            duration: 0
        }];

        //user data.
        self.user = {
            first_name: "",
            last_name: "",
            age: null,
            gender: "male",
            interest_genders:[],
            /***
             * this field contain all available item. it map
             */
            available_times: {}
        };

        //determine user can go to previous step.
        self.canGoBack = false;

        //determine user can go to next step.
        self.canGoNext = true;

        //determine current step is last step.
        self.isLastStep = false;


        //day of month collection
        self.daysOW = [];

        //cache current editting times item.
        self.current_available_time = null;

        //interest genders
        self.interest_genders =  [
            {title: "Male", selected: false, value:"male"},
            {title: "Female", selected: true, value: "female"}
        ];

        //#endregion public properties.

        //#region initialize


        //init dayOMs

        initDaysOW();

        //init ionicModal
        $ionicModal.fromTemplateUrl("templates/modal/select-days-of-week.html", {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            self.modal = modal;
        });


        //#endregion init dayOMs.


        //#region public methods.

        //go back.
        self.back = function () {

            if (!self.canGoBack) {
                return;
            }

            current_index = current_index - 1;


            //refresh naviagtion state.
            refreshNavState();

            try {

                goto(current_index);

            } catch (e) {
                console.log(e);
                return false;
            }

            return true;
        };

        //go next
        self.next = function (step) {

            if (!self.canGoNext) {
                return;
            }

            current_index++;

            //refresh naviagtion state.
            refreshNavState();

            try {
                goto(current_index);
            } catch (e) {
                console.log(e);
                return false;
            }

            return true;

        };


        //send user's info to server.
        self.save = function () {
            var user = $localStorage.getObject('user') || {};
            //retrieve old value from database.
            user = angular.extend(user, self.user);
            //set interest value.
            saveInterestGenders();
            //save available times.
            saveAvailableTimes();


            $localStorage.setObject('user', user);

            console.log(user);
        };


        self.addAvailableTime = function () {
            self.available_times.push({
                time: null,
                duration: 0
            });
        };

        self.removeAvailableTime = function (item) {
            var index = self.available_times.indexOf(item);
            if (index > -1) {
                self.available_times.splice(index, 1);
            }
        };


        self.getItemHeight = function (item, index) {
            //Make evenly indexed items be 10px taller, for the sake of example
            return (index % 2) === 0 ? 150 : 160;
        };


        self.selectDaysOW = function (item) {

            self.current_available_time = item;

            if(item && item.daysOW.length > 0){
                //deserialize selected item form available time.
                for(var i = 0; i <self.daysOW.length; i++){
                    self.daysOW[i].selected = item.daysOW.indexOf(self.daysOW[i].value) > -1;
                }
            }


            $scope.modal.show();
        };

        self.closeSelectDaysOWModal = function (param) {
            if (param === "ok") {
                saveSelectedDaysOW(self.current_available_time);
            }
            //reset daysOW
            initDaysOW();
            self.modal.hide();
        };

        //#endregion public methods.


        //#region events
        //Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function () {
            $scope.modal.remove();
        });
        //#endregion events.
    };

    //Dependency Injection.
    constructor.$inject = ["$scope", "$ionicModal", "$timeout", "$location", "$localStorage", "$state", "$collectionUtil"];

    return constructor;
}());
