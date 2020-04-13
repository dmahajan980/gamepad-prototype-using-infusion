"use strict";

(function (fluid) {

    fluid.registerNamespace("gamepad.handlers.axes");

    fluid.defaults("gamepad.handlers.axes", {
        gradeNames: ["gamepad.handlers"],
        invokers: {            
            inputEvents: {
                funcName: "gamepad.handlers.axes.inputEvents",
                args: ["{arguments}.0", "{arguments}.1"]
            }
        }
    });

    gamepad.handlers.axes.inputEvents = function (axesIndex, value) {
        if (value > 0.4 || value < -0.4) {
            const yOffset = $(window).scrollTop();
            const xOffset = $(window).scrollLeft();
            switch (axesIndex) {

                // When left axes is disturbed
                case 0:
                    // Scroll horizontally
                    $(window).scrollLeft(xOffset + value * 50);
                    break;
                case 1:
                    // Scroll vertically
                    $(window).scrollTop(yOffset + value * 50);
                    break;
                
                // When right axes is disturbed
                case 2:
                case 3:
                    // Switch between options
                    gamepad.handlers.axes.rightAxesHandler(value);
                    break;
            };
        };
    };

    gamepad.handlers.axes.rightAxesHandler = function (value) {

        // If SELECT element is currently focussed
        if (document.activeElement.nodeName === 'SELECT') {
            const activeElement = document.activeElement.nodeName.toLowerCase();
            value > 0 ? gamepad.handlers.axes.downKey(activeElement) : gamepad.handlers.axes.upKey(activeElement);
        }
    };

    // Parameter passed to arrowKeyEventHandler function
    gamepad.handlers.axes.upKey = function (activeElement) {
        const prevElement = $(`${activeElement} option:selected`).prev('option');
        if (prevElement.length > 0) {
            $(`${activeElement} option:selected`).removeAttr('selected').prev('option').attr('selected', 'selected');
        }
    };

    // Parameter passed to arrowKeyEventHandler function
    gamepad.handlers.axes.downKey = function (activeElement) {
        const nextElement = $(`${activeElement} option:selected`).next('option');
        if (nextElement.length > 0) {
            $(`${activeElement} option:selected`).removeAttr('selected').next('option').attr('selected', 'selected');
        }
    };

})(fluid);
