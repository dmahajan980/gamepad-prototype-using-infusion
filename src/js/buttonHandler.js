"use strict";

(function (fluid, $) {

    fluid.registerNamespace("gamepad.handlers.button");

    fluid.defaults("gamepad.handlers.button", {
        gradeNames: ["gamepad.handlers"],
        invokers: {            
            inputEvents: {
                funcName: "gamepad.handlers.button.inputEvents",
                args: ["{arguments}.0", "{arguments}.1"]
            }
        }
    });

    /**
     *
     * Respond to a button press by firing one of the functions that produce navigation effects.
     *
     * @param {Integer} buttonIndex - The index of the button.
     * @param {Integer} value - The index of the gamepad.
     *
     */
    gamepad.handlers.button.inputEvents = function (buttonIndex, value) {
        if (value > 0.4) {
            switch (buttonIndex) {

                // Click on the currently focused element.
                case 0: 
                    gamepad.handlers.button.clickEventHandler();
                    break;

                // Move the focus to the previous element.
                case 4:
                    gamepad.handlers.button.focusElement(gamepad.handlers.button.prevFocus);
                    break;

                // Move the focus to the next element.
                case 5:
                    gamepad.handlers.button.focusElement(gamepad.handlers.button.nextFocus);
                    break;
                
                // Move to previous page in the history.
                case 6:
                    window.history.back();
                    break;

                // Move to next page in the history.
                case 7:
                    window.history.forward();
                    break;

                // Reload the webpage.
                case 9:
                    location.reload();
                    break;

                // Move to previous option in the SELECT dropdown.
                case 12:
                case 14:
                    gamepad.handlers.button.arrowKeyEventHandler(gamepad.handlers.button.upKey);
                    break;

                // Move to previous option in the SELECT dropdown.
                case 13:
                case 15:
                    gamepad.handlers.button.arrowKeyEventHandler(gamepad.handlers.button.downKey);
                    break;
            };
        };
    };

    /**
     *
     * Produce an action that causes the focus to move to the next or previous element.
     *
     * @param {Function} action - It determines whether to move to the next or the previous element.
     *
     */
    gamepad.handlers.button.focusElement = function (action) {

        // Filter for selecting all focussable elements.
        const focussableElementsFilter = 'a:not([disabled]), button:not([disabled]), input:not([disabled]), select, [tabindex]:not([disabled]):not([tabindex="-1"])';

        // Select the focussable elements from the webpage and store them.
        const focussable = Array.prototype.filter.call($(focussableElementsFilter),
            function (element) {
                return element.offsetWidth > 0 || element.offsetHeight > 0 || element === document.activeElement;
            }
        );

        // Find index of currently focussed element amongst others stored in the `focussable` array.
        const activeElementIndex = focussable.indexOf(document.activeElement);
        action(activeElementIndex, focussable);
        
        // Move the focus to first element when the BODY tag is focussed.
        if (document.activeElement === document.querySelector('body')) {
            focussable[0].focus();
        };
    };

    /**
     *
     * Causes the focus to move to the next focusable element.
     *
     * @param {Integer} index - The index of the currently focused element.
     * @param {Array} focussable - The array containing all the focussable elements.
     *
     */
    gamepad.handlers.button.nextFocus = function (index, focussable) {

        // If any element is currently focussed.
        if (index > -1) {
            const nextElement = focussable[index + 1] || focussable[0];
            nextElement.focus();
        };
    };

    /**
     *
     * Causes the focus to move to the previous focusable element.
     *
     * @param {Integer} index - The index of the currently focused element.
     * @param {Array} focussable - The array containing all the focussable elements.
     *
     */
    gamepad.handlers.button.prevFocus = function (index, focussable) {

        // If any element is currently focussed.
        if (index > -1) {
            const prevElement = focussable[index - 1] || focussable[focussable.length - 1];
            prevElement.focus();
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
     * @param {Function} keyFunction - The array containing all the focussable elements.
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
     * @param {Object} activeElement - The array containing all the focussable elements.
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
     * @param {Object} activeElement - The array containing all the focussable elements.
     *
     */
    gamepad.handlers.button.downKey = function (activeElement) {
        const nextElement = $(`${activeElement} option:selected`).next('option');
        if (nextElement.length > 0) {
            $(`${activeElement} option:selected`).removeAttr('selected').next('option').attr('selected', 'selected');
        };
    };

})(fluid, jQuery);
