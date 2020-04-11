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
        model: {
            properties: {
                label: "Gamepad not connected",
                connected: false,
                axis: []
            }
        },
        modelListeners: {
            "properties.connected": "{that}.displayGamepad"
        },
        frequency: 100,
        invokers: {
            connectionListener: {
                funcName: "gamepad.tracker.connectionListener",
                args: ["{that}"]
            },
            displayGamepad: {
                "this": "{that}.dom.statusBox",
                method: "html",
                args: ["{that}.model.properties.label"]
            },
            getGamepadData: {
                funcName: "gamepad.tracker.getGamepadData",
                args: ["{that}"]
            },
            scanGamepadProperties: {
                funcName: "gamepad.tracker.executeInIntervals",
                args: ["{that}.getGamepadData", "{that}.options.frequency"]
            },
            stopScanningGamepadProperties: {
                funcName: "clearInterval",
                args: ["{arguments}.0"]
            }
        }
    });

    gamepad.tracker.connectionListener = function (that) {

        $( window ).on("gamepadconnected", function() {
            if (that.model.properties.connected === false) {

                gamepad.tracker.connectivityIntervalReference = that.scanGamepadProperties();
                console.log(that.model.properties)      //////////
            };
        });

        $( window ).on("gamepaddisconnected", function (event) {
            if (event.originalEvent.gamepad.index === that.model.properties.index) {
                console.log(that.model.properties)      //////////////
                
                that.stopScanningGamepadProperties(gamepad.tracker.connectivityIntervalReference);
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

    gamepad.tracker.getGamepadData = function (that) {
        const connectedGamepad = navigator.getGamepads()[0];
        that.applier.change("properties", {
            label: connectedGamepad.id,
            index: connectedGamepad.index,
            connected: true,
            axes: connectedGamepad.axes,
            buttons: connectedGamepad.buttons
        });
    };

    gamepad.tracker.executeInIntervals = function(intervalFunction, frequency) {
        return setInterval(intervalFunction, frequency);
    };

})(fluid);