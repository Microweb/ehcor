(function(root) {
    'use strict';

    /**
     * Events
     *
     * @class
     * @memberof ehcor
     */
    function Events() {
        this.$listeners = {};
    }
    Events.prototype = /** @lends ehcor.Events.prototype */ {

        /**
         * Add listener
         *
         * @memberof ehcor.Events.prototype
         * @param {function} callback
         * @param {object} bind New context
         */
        on: function(name, callback, bind) {
            if (!this.$listeners.hasOwnProperty(name)) {
                this.$listeners[name] = [];
            }
            this.$listeners[name].push([callback, bind || null]);
        },

        /**
         * Fire event
         *
         * @memberof ehcor.Events.prototype
         * @param {string} name
         * @param {*} data
         */
        trigger: function(name, data) {
            var listeners = this.$listeners[name] || [],
                listener;
            for (var i = 0, j = listeners.length; i < j; i += 1) {
                listener = listeners[i];
                try {
                    listener[0].call(listener[1], data);
                } catch (e) {
                    console.error(e);
                }
            }
        }
    };
    ehcor.Events = Events;

})(ehcor);
