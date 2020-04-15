"use strict";

(function (fluid) {

    fluid.registerNamespace("gamepad");

    fluid.defaults("gamepad", {
        gradeNames: ["fluid.modelComponent"],
        model: {
            label: "Gamepad not connected",
            index: null,
            connected: false,
            axes: [],
            buttons: []
        },
        frequency: 100,
        components: {
            trackGamepad: {
                type: "gamepad.tracker",
                container: "body",
                options: {
                    frequency: "{gamepad}.options.frequency",
                    model: {
                        label: "{gamepad}.model.label",
                        index: "{gamepad}.model.index",
                        connected: "{gamepad}.model.connected",
                        axes: "{gamepad}.model.axes",
                        buttons: "{gamepad}.model.buttons"
                    },
                    listeners: {
                        "{gamepad}.events.onCreate": "{that}.connectionListener"
                    }
                }
            },
            buttonsHandler: {
                type: "gamepad.handlers.button",
                options: {
                    frequency: "{gamepad}.options.frequency",
                    modelRelay: {
                        buttonsArrayToObject: {
                            target: "values",
                            singleTransform: {
                                type: "gamepad.arrayToObject",
                                input: "{gamepad}.model.buttons"
                            }
                        }
                    }
                }
            },
            axesHandler: {
                type: "gamepad.handlers.axes",
                options: {
                    frequency: "{gamepad}.options.frequency",
                    modelRelay: {
                        axesArrayToObject: {
                            target: "values",
                            singleTransform: {
                                type: "gamepad.arrayToObject",
                                input: "{gamepad}.model.axes"
                            }
                        }
                    }
                }
            }
        }
    });

    /**
     *
     * Converts the input array into an object with the keys as the index of the corresponding element.
     *
     * @param {Array} array - The buttons and axes array to be converted into an object.
     *
     */
    gamepad.arrayToObject = function (array) {        
        const inputObject = {};
        for (let index = 0; index < array.length; index++) {
            inputObject[index] = typeof array[index] === "object" ? array[index].value : array[index];
        };
        return inputObject;
    };

    // Create an instance of the gamepad component
    let newGamepad = gamepad();

})(fluid);
