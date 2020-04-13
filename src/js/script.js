"use strict";

(function (fluid, $) {

    fluid.registerNamespace("gamepad");

    fluid.defaults("gamepad", {
        gradeNames: ["fluid.modelComponent"],
        model: {
            properties: {
                label: "Gamepad not connected",
                index: null,
                connected: false,
                axes: [],
                buttons: []
            }
        },
        frequency: 100,
        components: {
            trackGamepad: {
                type: "gamepad.tracker",
                container: "body",
                options: {
                    frequency: "{gamepad}.options.frequency",
                    model: {
                        properties: "{gamepad}.model.properties"
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
                                input: "{gamepad}.model.properties.buttons"
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
                                input: "{gamepad}.model.properties.axes"
                            }
                        }
                    }
                }
            }
        }
    });

    gamepad.arrayToObject = function (array) {        
        const inputObject = {};
        for (let index = 0; index < array.length; index++) {
            inputObject[index] = typeof array[index] === "object" ? array[index].value : array[index];
        };
        return inputObject;
    };

    let newGamepad = gamepad();

})(fluid, jQuery);
