(function(root) {
    'use strict';

    //if console not exists
    if (typeof console === 'undefined') {
        root.console = {
            log: function() {},
            error: function() {},
            debug: function() {},
            warn: function() {}
        };
    }

    /**
     * Create our namspace
     * @namespace ehcor
     */
    var ehcor = root.ehcor = {};

    /**
     * Extends object
     *
     * @method ehcor.ext
     */
    ehcor.ext = function(target) {
        if (arguments.length < 2) {
            throw new Error('Expected more than 2 arguments. (sjs.extend()');
        }
        var args, name, copy;
        for (var i = 1; i < arguments.length; i++) {
            args = arguments[i];
            for (name in args) {
                copy = args[name];
                if (copy !== undefined) {
                    target[name] = copy;
                }
            }
        }
        return target;
    };
    /**
     * Helper for array likes object
     *
     * @method ehcor.toArray
     * @param {array} arr
     */
    ehcor.toArray = function(arr) {
        try {
            return Array.prototype.slice.call(arr, 0);
        } catch (e) {
            var _ = [];
            for (var i = 0, j = arr.length; ++i < j;) {
                _.push(arr[++i]);
            }
            return _;
        }
        return null;
    };

    /**
     * Format string
     *
     * @example
     *      > ehcor.format('Hello {name}!!!', {name:'Bill'});
     *      'Hello Bill!!!'
     *
     * @method ehcor.format
     * @param {String} txt
     * @param {Object} data
     */
    ehcor.format = function(txt, data) {
        return txt.replace(/\{(.+?)\}/g, function(_, name) {
            return data[name] || '';
        });
    };


})(window);
