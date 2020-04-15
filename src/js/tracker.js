"use strict";

// Track gamepad data using the API
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
            label: "Gamepad not connected",
            connected: false,
            axes: []
        },
        modelListeners: {
            connected: "{that}.displayGamepadName"
        },
        invokers: {
            displayGamepadName: {
                "this": "{that}.dom.statusBox",
                method: "html",
                args: ["{that}.model.label"]
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

    /**
     *
     * Listens to the connected and disconnected events of the gamepad.
     *
     * @param {Object} that - The gamepad tracker component.
     *
     */
    gamepad.tracker.connectionListener = function (that) {

        // When gamepad is connected
        $( window ).on("gamepadconnected", function() {
            if (that.model.connected === false) {
                gamepad.tracker.connectivityIntervalReference = that.scanGamepadInputs();
            };
        });

        // When gamepad is disconnected
        $( window ).on("gamepaddisconnected", function (event) {
            if (event.originalEvent.gamepad.index === that.model.index) {
                
                clearInterval(gamepad.tracker.connectivityIntervalReference);

                const modelUpdateTransaction = that.applier.initiate();
                
                modelUpdateTransaction.fireChangeRequest({ path: "label", value: "Gamepad not connected" });
                modelUpdateTransaction.fireChangeRequest({ path: "index", value: null });
                modelUpdateTransaction.fireChangeRequest({ path: "connected", value: false });
                modelUpdateTransaction.fireChangeRequest({ path: "axes", value: [] });
                modelUpdateTransaction.fireChangeRequest({ path: "buttons", value: [] });

                modelUpdateTransaction.commit();
            };
        });
    };

    /**
     *
     * Update the gamepad model.
     *
     * @param {Object} that - The gamepad tracker component.
     *
     */
    gamepad.tracker.updateGamepadData = function (that) {
        const connectedGamepad = navigator.getGamepads()[0];
        const modelUpdateTransaction = that.applier.initiate();
        
        modelUpdateTransaction.fireChangeRequest({ path: "label", value: connectedGamepad.id });
        modelUpdateTransaction.fireChangeRequest({ path: "index", value: connectedGamepad.index });
        modelUpdateTransaction.fireChangeRequest({ path: "connected", value: true });
        modelUpdateTransaction.fireChangeRequest({ path: "axes", value: connectedGamepad.axes });
        modelUpdateTransaction.fireChangeRequest({ path: "buttons", value: connectedGamepad.buttons });

        modelUpdateTransaction.commit();
    };

    /**
     *
     * Execute the gamepad update method/invoker in regular, fixed intervals.
     *
     * @param {Function} intervalFunction - The function that updates the model.
     * @param {Integer} frequency - The frequency in milliseconds, at which the update function is executed.
     *
     */
    gamepad.tracker.executeInIntervals = function (intervalFunction, frequency) {
        return setInterval(intervalFunction, frequency);
    };

})(fluid);
