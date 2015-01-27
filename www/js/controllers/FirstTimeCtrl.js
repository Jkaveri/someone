someone.namespace('someone.controllers');

someone.controllers.FirstTimeCtrl = (function () {
    'use strict';

    var constructor = function ($scope, $ionicModal, $timeout, $location, $localStorage, $state, userRes) {

        var self = $scope;
        var step_prefix = "firsttime.";
        var steps = ["userinfo", "interestgender", "availabletimes"];
        var current_index = 0;
        var lorem = new Lorem();


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
         * Sun as 0, Sat as 6
         */
        var initDaysOW = function () {
            self.daysOW = [
                {title: "Sun", select: false, value: 0},
                {title: "Mon", select: false, value: 1},
                {title: "Tue", select: false, value: 2},
                {title: "Wed", select: false, value: 3},
                {title: "Thu", select: false, value: 4},
                {title: "Fri", select: false, value: 5},
                {title: "Sat", select: false, value: 6}
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
        var saveInterestGenders = function (user) {
            var count = self.interestGenders.length;
            user.interestGenders = [];
            for (var i = 0; i < count; i++) {
                if (self.interestGenders[i].selected) {
                    //add selected item's value to user.
                    user.interestGenders.push(self.interestGenders[i].value);
                }
            }
        };
        /***
         * Help to save available times to user.
         * Convert from: {
         *   daysOWStr:"Mon,Thu",
         *   daysOW:[1, 4],
         *   time: 19:30,
         *   duration: 1
         * }
         * to: [
         *    {
         *      dayOW: 1,
         *      items:[
         *          {time: 19*60+30, duration: 1}
         *      ]
         *    },
         *    {
         *      dayOW: 4,
         *      items:[
         *          {time: 19*60+30, duration: 1}
         *      ]
         *    }
         * ]
         */
        var saveFreeTimes = function (user) {
            var count = self.freeTimes.length, item, timeRange, daysOW,freeTime,
                freeTimes =[], time, cached = [];
            //loop over free times (user's input).
            for (var i = 0; i < count; i++) {
                //get item
                item = self.freeTimes[i];
                //day of weeks of this item.
                daysOW = item.daysOW;
                //no need to do any thing if user not select day of week.
                if (!daysOW || daysOW.length < 1) continue;

                //parse time to moment.
                time = moment(item.time);
                 //convert time to interger.
                //to minutes.
                time = time.hours()*60+time.minutes();

                timeRange = {time: time, duration: item.duration};

                for (var j = 0; j < daysOW.length; j++) {
                    var dayOW = daysOW[j], index = j;
                    if(cached[dayOW] > -1){
                        freeTime = freeTimes[cached[dayOW]];
                    }else{
                        freeTime = {
                            dayOW: daysOW[j],
                            items: []
                        };
                    }

                    //push time range into item.
                    freeTime.items.push(timeRange);

                    freeTimes.push(freeTime);
                }

            }

            user.freeTimes = freeTimes;
        };

        // #endregion private methods


        //#region public properties;
        self.freeTimes = [{
            daysOWStr: "Fri,Sat",
            daysOW: [5,6],
            time: new Date(2015, 1, 1, 18, 30, 0, 0),
            duration: 1
        }];

        //user data.
        self.user = {
            firstName: lorem.createText(1,Lorem.TYPE.WORD).toCapitalize(),
            lastName: lorem.createText(1,Lorem.TYPE.WORD).toCapitalize(),
            birthday: new Date( Date.UTC(1992, 0, 8) ),
            gender: "male",
            interestGenders: [],
            /***
             * this field contain all available item. it map
             */
            freeTimes:[],
            address: lorem.createText(5, Lorem.TYPE.WORD),
            email: lorem.createText(2, Lorem.TYPE.WORD).replace(" ","_") + "@local.com",
            phone: 123456789,
            password:123

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
        self.interestGenders = [
            {title: "Male", selected: false, value: "male"},
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
            saveInterestGenders(user);
            //save available times.
            saveFreeTimes(user);

            userRes.save(user).then(
                //success
                function (u) {
                    $localStorage.setObject('user', u);
                    $localStorage.set('firsttimeSetup', true);
                    $timeout(function () {
                        $location.path('/app/home');
                    });
                },
                //error.
                function () {
                    alert('err');
                }
            );


            console.log(user);
        };


        self.addAvailableTime = function () {
            self.freeTimes.push({
                time: null,
                duration: 0
            });
        };

        self.removeAvailableTime = function (item) {
            var index = self.freeTimes.indexOf(item);
            if (index > -1) {
                self.freeTimes.splice(index, 1);
            }
        };


        self.getItemHeight = function (item, index) {
            //Make evenly indexed items be 10px taller, for the sake of example
            return (index % 2) === 0 ? 150 : 160;
        };


        self.selectDaysOW = function (item) {

            self.current_available_time = item;

            if (item && item.daysOW.length > 0) {
                //deserialize selected item form available time.
                for (var i = 0; i < self.daysOW.length; i++) {
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


        self.addItem = function(){
          self.freeTimes.push({
              daysOWStr: "Fri, Sat",
              daysOW: [5,6],
              time: null,
              duration: 1
          });
        };

        self.removeItem = function(item){
            var index = self.freeTimes.indexOf(item);
            if(index > -1){
                self.freeTimes.splice(index, 1);
            }
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
    constructor.$inject = ["$scope", "$ionicModal", "$timeout", "$location", "$localStorage", "$state", "UserResource"];

    return constructor;
}());
