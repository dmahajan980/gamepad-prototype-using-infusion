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

    /**
     *
     * Execute the gamepad update method/invoker in regular, fixed intervals.
     * 
     * @param {Function} intervalFunction - The function that updates the model.
     * @param {Object} that - The gamepad event handler component.
     *
     */
    gamepad.handlers.runEveryInterval = function (intervalFunction, that) {
        that.options.interval = setInterval(intervalFunction, that.options.frequency);
    };

    /**
     *
     * Passes every input to the event handler function.
     * 
     * @param {Object} object - The object containing the button/axes input key-value pairs.
     * @param {Function} handlerFunction - The function that handles the input's navigation event.
     *
     */
    gamepad.handlers.passEachInput = function (object, handlerFunction) {
        const keyStrings = fluid.keys(object);
        const keys = fluid.transform(keyStrings, fluid.parseInteger);
        for (const key of keys) {
            handlerFunction(key, object[key]);
        };
    };

})(fluid);
