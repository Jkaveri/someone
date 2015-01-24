/**
 * Created by Ho on 1/18/2015.
 */

someone.namespace('someone.services');

someone.services.MockData = (function() {
    'use strict';

    var constructor = function() {
        return {
          profile:{
            id:"1",
            userId:"123",
            firstName:"Ho",
            lastName:"Nguyen",
            age: 18,
            address:{
              latitude:10,
              longitude: 10,
              address: "2/142 Thien Phuoc, P.9, Q. Tan Binh, Tp. Ho Chi Minh",
            },
            gender: "Male",
            interestGenders:["female", "male"],
          },
          appointment:{
            id:"1"
          },
        };
    };

    //Dependency Injection.
    constructor.$inject = [];


    return constructor;
}());
