"use strict";

(function (fluid, $) {

    fluid.registerNamespace("gamepad");
    fluid.registerNamespace("gamepad.scanGamepad");

    // fluid.registerNamespace("gamepad.listeners");

    gamepad.scanGamepad.connectivityIntervalReference = null;

    // Break into subcomponents
    fluid.defaults("gamepad", {
        gradeNames: ["fluid.modelComponent"],
        model: {
            name: null,
            index: null,
            connected: false,   // Consider removing this if not required
            axes: [],
            buttons: []
        },
        components: {
            scanGamepad: {
                type: "gamepad.scanGamepad",
                options: {
                    model: "{gamepad}.model",
                    listeners: {
                        "{gamepad}.events.onCreate": "{that}.connectionListener"
                    }
                }
            }
        }
    });

    // Scan gamepad data from the API
    fluid.defaults("gamepad.scanGamepad", {
        gradeNames: ["fluid.modelComponent"],
        model: {
            connected: false
        },
        modelListeners: {
            connected: {
                funcName: "{that}.displayMessage",
                args: ["{that}.model"]
            }
        },
        frequency: 100,
        invokers: {
            connectionListener: {
                funcName: "gamepad.scanGamepad.connectionListener",
                args: ["{that}"]
            },
            displayMessage: {
                "this": "console",
                method: "log",
                args: ["{arguments}.0"]
            },
            scanGamepadProperties: {
                funcName: "gamepad.scanGamepad.executeInIntervals",
                args: ["{that}.updateGamepadProperties", "{arguments}.0", "{that}.options.frequency"]
            },
            updateGamepadProperties: {
                changePath: "",
                value: ["{arguments}.0"]
            },
            stopScanningGamepadProperties: {
                funcName: "clearInterval",
                args: ["{arguments}.0"]
            }
        }
    });

    gamepad.scanGamepad.connectionListener = function (that) {

        $( window ).on("gamepadconnected", function() {

            if (that.model.connected === false || that.model[0].connected === false) {

                const connectedGamepad = navigator.getGamepads()[0];
                gamepad.scanGamepad.connectivityIntervalReference = that.scanGamepadProperties({
                    name: connectedGamepad.id,
                    index: connectedGamepad.index,
                    connected: true,
                    axes: connectedGamepad.axes,
                    buttons: connectedGamepad.buttons
                });
            };
        });

        $( window ).on("gamepaddisconnected", function (event) {

            if (event.originalEvent.gamepad.index === that.model[0].index) {

                that.stopScanningGamepadProperties(gamepad.scanGamepad.connectivityIntervalReference);
                that.updateGamepadProperties({
                    name: null,
                    index: null,
                    connected: false,   // Consider removing this if not required
                    axes: [],
                    buttons: []
                });
            };
        });
    };

    gamepad.scanGamepad.executeInIntervals = function(intervalFunction, args, frequency) {
        return setInterval(intervalFunction(args), frequency);
    };

    let newGamepad = gamepad();

})(fluid, jQuery);
