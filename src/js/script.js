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
        components: {
            trackGamepad: {
                type: "gamepad.tracker",
                container: "body",
                options: {
                    model: {
                        properties: "{gamepad}.model.properties"
                    },
                    listeners: {
                        "{gamepad}.events.onCreate": "{that}.connectionListener"
                    }
                }
            },
            inputHandlers: {
                type: "gamepad.handlers",
                options: {
                    modelRelay: {
                        buttonsArrayToObject: {
                            target: "buttons",
                            singleTransform: {
                                type: "gamepad.arrayToObject",
                                input: "{gamepad}.model.properties.buttons"
                            }
                        },
                        axesArrayToObject: {
                            target: "axes",
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
        let inputObject = {};
        fluid.each(array, function (input) {
            let keyName = array.indexOf(input);
            inputObject[keyName] = typeof input === "object" ? input.value : input;
        });
        return inputObject;
    };

    let newGamepad = gamepad();

})(fluid, jQuery);
