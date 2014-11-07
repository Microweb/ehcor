(function(root) {
    'use strict';

    /**
     * Events dispacher
     */
    root.Events = function() {
        this.$listeners = {};
    };
    root.Events.prototype = {
        /**
         * Add listener
         *
         * @param {function} callback
         * @param {object} bind
         */
        on: function(name, callback, bind) {
            if (!this.$listeners.hasOwnProperty(name)) {
                this.$listeners[name] = [];
            }
            this.$listeners[name].push([callback, bind || null]);
        },
        /**
         * Fire event

         * @param {string} name
         * @param {mix} data
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

})(ehcor);
