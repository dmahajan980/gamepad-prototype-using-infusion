"use strict";

(function (fluid) {

    fluid.registerNamespace("gamepad.handlers.axes");

    /**
     * 
     * The 'configuration' option present in the component provides a
     * default layout to map each joystick axes to a particular action.
     * It can also allow the user to reconfigure the buttons as they 
     * want. For example, the user might want the action performed by
     * the axes "0", to be performed by axes "2" or "3" instead. So, 
     * they can simply swap the values and the controller will perform 
     * the same action, but with the desired axes, as configured by 
     * the user.
     * 
     * The value "vacant" represents that the particular axes is set to
     * do nothing.
     * 
     */
    fluid.defaults("gamepad.handlers.axes", {
        gradeNames: ["fluid.modelComponent"],
        intervalForHorizontalScroll: null,
        intervalForVerticalScroll: null,
        frequency: null,
        configuration: {
            "0": "scrollHorizontally",
            "1": "scrollVertically",
            "2": "rightAxesHandler",
            "3": "rightAxesHandler"
        },
        modelListeners: {
            "values.*": {
                funcName: "{that}.axesHandler",
                args: ["{change}"]
            }
        },
        invokers: {  
            axesHandler: {
                funcName: "gamepad.handlers.axes.axesHandler",
                args: ["{that}", "{arguments}.0"]
            },
            scrollHorizontally: {
                funcName: "gamepad.handlers.axes.scrollHorizontally",
                args: ["{that}", "{arguments}.0"]
            },
            scrollVertically: {
                funcName: "gamepad.handlers.axes.scrollVertically",
                args: ["{that}", "{arguments}.0"]
            },
            rightAxesHandler: {
                funcName: "gamepad.handlers.axes.rightAxesHandler",
                args: ["{arguments}.0"]
            }
        }
    });

    /**
     *
     * Calls the invoker methods when axes is shifted according to the 
     * configuration provided to the component to produce a navigation
     * effect.
     * 
     * @param {Object} that - The axes handler component.
     * @param {Object} change - The recipt for the change in input values
     *                          of an axes.
     *
     */
    gamepad.handlers.axes.axesHandler = function (that, change) {
        let path = change.path[change.path.length - 1];
        let axesConfiguration = that.options.configuration[path];
        if (axesConfiguration != "vacant") {
            that[axesConfiguration](change.value);
        };
    };

    
    /**
     *
     * Scroll horizontally across the webpage.
     * 
     * @param {Object} that - The axes handler component.
     * @param {Integer} value - The value of axes input.
     *
     */
    gamepad.handlers.axes.scrollHorizontally = function (that, value) {
        if (value > 0.4 || value < -0.4) {
            clearInterval(that.options.intervalForHorizontalScroll);
            that.options.intervalForHorizontalScroll = setInterval(function() {
                let xOffset = $(window).scrollLeft();
                $(window).scrollLeft(xOffset + value * 50);
            }, that.options.frequency);
        }
        else if (value < 0.4 && value > -0.4) {
            clearInterval(that.options.intervalForHorizontalScroll);
        }
    };

    /**
     *
     * Scroll vertically across the webpage.
     * 
     * @param {Object} that - The axes handler component.
     * @param {Integer} value - The value of axes input.
     *
     */
    gamepad.handlers.axes.scrollVertically = function (that, value) {
        if (value > 0.4 || value < -0.4) {
            clearInterval(that.options.intervalForVerticalScroll);
            that.options.intervalForVerticalScroll = setInterval(function() {
                let yOffset = $(window).scrollTop();
                $(window).scrollTop(yOffset + value * 50);
            }, that.options.frequency);
        }
        else if (value < 0.4 && value > -0.4) {
            clearInterval(that.options.intervalForVerticalScroll);
        }
    };

    /**
     *
     * Event handler for the right axes.
     * 
     * @param {Integer} value - The value of the right axes input.
     *
     */
    gamepad.handlers.axes.rightAxesHandler = function (value) {

        // If SELECT element is currently focussed.
        if (document.activeElement.nodeName === 'SELECT' && (value == 1 || value == -1)) {
            const activeElement = document.activeElement.nodeName.toLowerCase();
            value > 0 ? gamepad.handlers.axes.downKey(activeElement) : gamepad.handlers.axes.upKey(activeElement);
        }
    };

    /**
     *
     * Navigate to the previous option if right axes is moved in the 
     * left or upward direction.
     * 
     * @param {String} activeElement - The string value of the currently
     *                                 active element.
     *
     */
    gamepad.handlers.axes.upKey = function (activeElement) {
        const prevElement = $(`${activeElement} option:selected`).prev('option');
        if (prevElement.length > 0) {
            $(`${activeElement} option:selected`).removeAttr('selected').prev('option').attr('selected', 'selected');
        }
    };

    /**
     *
     * Navigate to the previous option if right axes is moved in the 
     * right or downward direction.
     * 
     * @param {String} activeElement - The string value of the currently
     *                                 active element.
     *
     */
    gamepad.handlers.axes.downKey = function (activeElement) {
        const nextElement = $(`${activeElement} option:selected`).next('option');
        if (nextElement.length > 0) {
            $(`${activeElement} option:selected`).removeAttr('selected').next('option').attr('selected', 'selected');
        }
    };

})(fluid);
