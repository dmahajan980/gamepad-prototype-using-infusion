"use strict";

(function (fluid) {

    fluid.registerNamespace("gamepad.handlers");

    fluid.defaults("gamepad.handlers", {
        gradeNames: ["fluid.modelComponent"],
        model: {
            axes: {},
            buttons: {}
        },                                           // Use event listener for onCreate to display input values
        components: {                                // Or inject listeners to it using subcomponents
            buttonsHandler: {
                type: "gamepad.handlers.button",
                options: {
                    model: {
                        buttons: "{handlers}.model.buttons"
                    }
                }
            },
            axesHandler: {
                type: "gamepad.handlers.axes",
                options: {
                    model: {
                        axes: "{handlers}.model.axes"
                    }
                }
            }
        }
    });

    fluid.defaults("gamepad.handlers.button", {
        gradeNames: ["fluid.modelComponent"],
        model: {
            buttons: {}
        },
        modelListeners: {                                           // Remove this once we add the eventListener above
            "buttons.*": {
                funcName: "{that}.displayButtons",
                args: ["{that}.model.buttons"]
            }
        },
        invokers: {
            displayButtons: {                                       // Remove this once we add the eventListener above
                "this": "console",
                method: "log",
                args: ["{arguments}.0"]
            }
        }
    });

    fluid.defaults("gamepad.handlers.axes", {
        gradeNames: ["fluid.modelComponent"],
        model: {
            axes: {}
        },
        modelListeners: {                                           // Remove this once we add the eventListener above
            "axes.*": {
                funcName: "{that}.displayAxes",
                args: ["{that}.model.axes"]
            }
        },
        invokers: {
        displayAxes: {                                              // Remove this once we add the eventListener above
                "this": "console",
                method: "log",
                args: ["{arguments}.0"]
            }
        }
    });

})(fluid);

        // buttonInputHandlers: {                       // Add some priority or createAfter
        //     type: "gamepad.handlers.button",
        //     container: ".value-box",
        //     options: {
        //         modelRelay: {
        //             buttonsArrayToObject: {
        //                 target: "buttons",
        //                 singleTransform: {
        //                     type: "gamepad.arrayToObject",
        //                     input: "{gamepad}.model.properties.buttons"
        //                 }
        //             }
        //         }
        //     }
        // },

        // modelListeners: {
        //     "buttons.*": "{that}.x"
        // },

            // x: {
            //     "this": "console",
            //     method: "log",
            //     args: ["{that}.model.buttons"]
            // }
