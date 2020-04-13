"use strict";

(function (fluid) {

    fluid.registerNamespace("gamepad.handlers");

    fluid.defaults("gamepad.handlers", {
        gradeNames: ["fluid.modelComponent"],
        frequency: null,
        interval: null,
        model: {
            values: {}
        },
        listeners: {
            "onCreate.inputEvents": "{that}.runEveryInterval",
        },
        invokers: {
            runEveryInterval: {
                funcName: "gamepad.handlers.runEveryInterval",
                args: ["{that}.passEachInput", "{that}"]
            },
            passEachInput: {
                funcName: "gamepad.handlers.passEachInput",
                args: ["{that}.model.values", "{that}.inputEvents"]
            },            
            inputEvents: "fluid.notImplemented"
        }
    });

    gamepad.handlers.runEveryInterval = function (intervalFunction, that) {
        that.options.interval = setInterval(intervalFunction, that.options.frequency);
    };

    gamepad.handlers.passEachInput = function (object, handlerFunction) {
        const keyStrings = fluid.keys(object);
        const keys = fluid.transform(keyStrings, fluid.parseInteger);
        for (const key of keys) {
            handlerFunction(key, object[key]);
        };
    };

})(fluid);
