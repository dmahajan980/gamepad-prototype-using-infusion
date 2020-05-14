"use strict";

(function (fluid, $) {

    fluid.registerNamespace("gamepad.handlers.button");

    /**
     * 
     * The 'buttonToActionMap' option present in the component provides a
     * default layout to map each button to a particular action. It can
     * also allow the user to reconfigure the buttons as they want. For
     * example, the user might want the action performed by the button 
     * "0", to be performed by button "2" or "3" instead. So, they can 
     * simply swap the values and the controller will perform the same
     * action, but with the desired button, as configured by the user.
     * 
     * The value "vacant" represents that the particular button is set 
     * to do nothing.
     * 
     */
    fluid.defaults("gamepad.handlers.button", {
        gradeNames: ["fluid.modelComponent"],
        buttonToActionMap: { 
            "0": "click",
            "1": "vacant",
            "2": "vacant", 
            "3": "vacant", 
            "4": "focusOnPreviousElement", 
            "5": "focusOnNextElement", 
            "6": "prevPageInHistory", 
            "7": "nextPageInHistory", 
            "8": "vacant", 
            "9": "reloadWindow", 
            "10": "vacant", 
            "11": "vacant", 
            "12": "goToPreviousOption", 
            "13": "goToNextOption", 
            "14": "goToPreviousOption", 
            "15": "goToNextOption",
            "16": "vacant" 
        },
        modelListeners: {
            "values.*": {
                funcName: "{that}.buttonHandler",
                args: ["{change}"]
            }
        },
        invokers: {
            buttonHandler: {
                funcName: "gamepad.handlers.button.buttonHandler",
                args: ["{that}", "{arguments}.0"]
            },
            click: "gamepad.handlers.button.clickEventHandler",
            prevFocus: "gamepad.handlers.button.prevFocus",
            nextFocus: "gamepad.handlers.button.nextFocus",
            focusOnPreviousElement: {
                funcName: "gamepad.handlers.button.focusElement",
                args: ["{that}.prevFocus"]
            },
            focusOnNextElement: {
                funcName: "gamepad.handlers.button.focusElement",
                args: ["{that}.nextFocus"]
            },
            prevPageInHistory: {
                "this": "window.history",
                method: "back"
            },
            nextPageInHistory: {
                "this": "window.history",
                method: "forward"
            },
            reloadWindow: {
                "this": "location",
                method: "reload"
            },
            upKey: "gamepad.handlers.button.upKey",
            downKey: "gamepad.handlers.button.downKey",
            goToPreviousOption: {
                funcName: "gamepad.handlers.button.arrowKeyEventHandler",
                args: ["{that}.upKey"]
            },
            goToNextOption: {
                funcName: "gamepad.handlers.button.arrowKeyEventHandler",
                args: ["{that}.downKey"]
            }
        }
    });
  
   /**
     *
     * Calls the invoker methods when button is pressed according to 
     * the configuration provided to the component to produce a 
     * navigation effect.
     * 
     * @param {Object} that - The axes handler component.
     * @param {Object} change - The recipt for the change in input values
     *                          of a button.
     *
     */
    gamepad.handlers.button.buttonHandler = function (that, change) {
        let path = change.path[change.path.length - 1];
        let buttonConfiguration = fluid.get(that.options.configuration, path);
        if (change.value > 0.4 && buttonConfiguration != "vacant") {
            that[buttonConfiguration]();
        };
    };

    /**
     *
     * Produce an action that causes the focus to move to the next or 
     * previous element.
     *
     * @param {Function} action - It determines whether to move to the 
     *                            next or the previous element.
     *
     */
    gamepad.handlers.button.focusElement = function (action) {

        // Filter for selecting all focussable elements.
        const focussableElementsFilter = 'a:not([disabled]), button:not([disabled]), input:not([disabled]), select, [tabindex]:not([disabled]):not([tabindex="-1"])';

        /**
         * 
         * Select the focussable elements from the webpage and store 
         * them.
         * 
         **/
        const focussable = Array.prototype.filter.call($(focussableElementsFilter),
            function (element) {
                return element.offsetWidth > 0 || element.offsetHeight > 0 || element === document.activeElement;
            }
        );

        /**
         * 
         * Find index of currently focussed element amongst others 
         * stored in the `focussable` array.
         * 
         **/
        const activeElementIndex = focussable.indexOf(document.activeElement);
        action(activeElementIndex, focussable);
        
        // Move the focus to first element when the BODY tag is focussed.
        if (document.activeElement === document.querySelector('body')) {
            fluid.focus(focussable[0]);
        };
    };

    /**
     *
     * Causes the focus to move to the next focusable element.
     *
     * @param {Integer} index - The index of the currently focused element.
     * @param {Array} focussable - The array containing all the focussable
     *                             elements.
     *
     */
    gamepad.handlers.button.nextFocus = function (index, focussable) {

        // If any element is currently focussed.
        if (index > -1) {
            const nextElement = focussable[index + 1] || focussable[0];
            fluid.focus(nextElement);
        };
    };

    /**
     *
     * Causes the focus to move to the previous focusable element.
     *
     * @param {Integer} index - The index of the currently focused element.
     * @param {Array} focussable - The array containing all the focussable
     *                             elements.
     *
     */
    gamepad.handlers.button.prevFocus = function (index, focussable) {

        // If any element is currently focussed.
        if (index > -1) {
            const prevElement = focussable[index - 1] || focussable[focussable.length - 1];
            fluid.focus(prevElement);
        };
    };

    // Triggers click event on the currently focused element.
    gamepad.handlers.button.clickEventHandler = function() {

        /**
         * 
         * If SELECT element is currently focussed
         * Otherwise perform the regular click option.
         * 
         */
        if (document.activeElement.nodeName === 'SELECT') {
            let optionsLength = 0;

            // Compute the number of options and store it.
            document.activeElement.childNodes.forEach(node => {
                if (node.nodeName === 'OPTION') { 
                    optionsLength++;
                }
            });

            /**
             * 
             * Expand the dropdown
             * Otherwise shrink back dropdown.
             * 
             */
            if ($(document.activeElement).attr('size') === '1' || !$(document.activeElement).attr('size')) {
                $(document.activeElement).attr('size', optionsLength);
            }
            else {
                $(document.activeElement).attr('size', 1);
            }
        }
        else {
            document.activeElement.click();
        }
    };

    /**
     *
     * Navigate across various options in the dropdown menu.
     *
     * @param {Function} keyFunction - The array containing all the 
     *                                 focussable elements.
     *
     */
    gamepad.handlers.button.arrowKeyEventHandler = function (keyFunction) {

        // If SELECT element is currently focussed.
        if (document.activeElement.nodeName === 'SELECT') {
            const activeElement = document.activeElement.nodeName.toLowerCase();
            keyFunction(activeElement);
        };
    };

    /**
     *
     * Navigate to the previous option in the dropdown menu.
     *
     * @param {Object} activeElement - The array containing all the 
     *                                 focussable elements.
     *
     */
    gamepad.handlers.button.upKey = function (activeElement) {
        const prevElement = $(`${activeElement} option:selected`).prev('option');
        if (prevElement.length > 0) {
            $(`${activeElement} option:selected`).removeAttr('selected').prev('option').attr('selected', 'selected');
        };
    };

    /**
     *
     * Navigate to the next option in the dropdown menu.
     *
     * @param {Object} activeElement - The array containing all the 
     *                                 focussable elements.
     *
     */
    gamepad.handlers.button.downKey = function (activeElement) {
        const nextElement = $(`${activeElement} option:selected`).next('option');
        if (nextElement.length > 0) {
            $(`${activeElement} option:selected`).removeAttr('selected').next('option').attr('selected', 'selected');
        };
    };

})(fluid, jQuery);
