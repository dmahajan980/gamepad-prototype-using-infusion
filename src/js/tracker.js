"use strict";

// Scan gamepad data using the API
(function (fluid) {

    fluid.registerNamespace("gamepad.tracker");
    gamepad.tracker.connectivityIntervalReference = null;

    fluid.defaults("gamepad.tracker", {
        gradeNames: ["fluid.viewComponent"],
        selectors: {
            statusBox: ".status-message"
        },
        frequency: null,
        model: {
            properties: {
                label: "Gamepad not connected",
                connected: false,
                axes: []
            }
        },
        modelListeners: {
            "properties.connected": "{that}.displayGamepadName"
        },
        invokers: {
            displayGamepadName: {
                "this": "{that}.dom.statusBox",
                method: "html",
                args: ["{that}.model.properties.label"]
            },
            connectionListener: {
                funcName: "gamepad.tracker.connectionListener",
                args: ["{that}"]
            },
            scanGamepadInputs: {
                funcName: "gamepad.tracker.executeInIntervals",
                args: ["{that}.updateGamepadData", "{that}.options.frequency"]
            },
            updateGamepadData: {
                funcName: "gamepad.tracker.updateGamepadData",
                args: ["{that}"]
            }
        }
    });

    gamepad.tracker.connectionListener = function (that) {

        $( window ).on("gamepadconnected", function() {
            if (that.model.properties.connected === false) {
                gamepad.tracker.connectivityIntervalReference = that.scanGamepadInputs();
            };
        });

        $( window ).on("gamepaddisconnected", function (event) {
            if (event.originalEvent.gamepad.index === that.model.properties.index) {
                
                clearInterval(gamepad.tracker.connectivityIntervalReference);
                that.applier.change("properties", {
                    label: "Gamepad not connected",
                    index: null,
                    connected: false,
                    axes: [],
                    buttons: []
                });
            };
        });
    };

    gamepad.tracker.updateGamepadData = function (that) {
        const connectedGamepad = navigator.getGamepads()[0];
        that.applier.change("properties", {
            label: connectedGamepad.id,
            index: connectedGamepad.index,
            connected: true,
            axes: connectedGamepad.axes,
            buttons: connectedGamepad.buttons
        });
    };

    gamepad.tracker.executeInIntervals = function (intervalFunction, frequency) {
        return setInterval(intervalFunction, frequency);
    };

})(fluid);
