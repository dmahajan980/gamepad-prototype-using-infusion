"use strict";

(function (fluid, $) {

    fluid.registerNamespace("gamepad");
    // fluid.registerNamespace("gamepad.listeners");

    fluid.defaults("gamepad", {
        gradeNames: ["fluid.modelComponent"],
        model: {
            connected: false,
            name: null
        },
        listeners: {
            "onCreate.connectionListener": "{that}.connectionListener"
        },
        modelListeners: {
            connected: {
                funcName: "{that}.displayMessage",
                args: ["Gamepad connection disturbed"]
            },
            name: {
                funcName: "{that}.displayMessage",
                args: ["{that}.model.name"]
            }
        },
        invokers: {
            connectionListener: {
                funcName: "gamepad.connectionListener",
                args: ["{that}"]
            },
            displayMessage: {
                "this": "console",
                method: "log",
                args: ["{arguments}.0"]
            }
        }
    });

    gamepad.connectionListener = function(that) {

        let gamepad = null;

        $( window ).on("gamepadconnected", function() {
            if (gamepad === null) {
                gamepad = navigator.getGamepads()[0];

                that.applier.change("connected", true);
                that.applier.change("name", gamepad.id);
            }
        });

        $( window ).on("gamepaddisconnected", function(e) {
            if (e.originalEvent.gamepad.index === gamepad.index) {
                gamepad = null

                that.applier.change("connected", false);
                that.applier.change("name", gamepad);
            }
        });
    };

    let myInstance = gamepad();

})(fluid, jQuery);
