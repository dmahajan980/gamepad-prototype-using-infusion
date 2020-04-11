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
            buttonHandlers: {
                type: "gamepad.handlers.button",
                container: ".value-box",
                options: {
                    model: {
                        axes: {gamepad}.axes
                    }
                }
            }
        }
    });

    let newGamepad = gamepad();

})(fluid, jQuery);
