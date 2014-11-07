(function(root) {
    'use strict';


    var isEventSupport = (function() {
        var el = document.createElement('div');
        var cacheSupport = {};

        return function(name) {
            if (name in cacheSupport) {
                return true;
            }
            var el = window;
            var ename = 'on' + name.toLowerCase();
            var isSupport = false;
            if (ename in el) {

                isSupport = true;
            } else {
                if (el.setAttribute) {
                    el.setAttribute(ename, 'return;');
                    isSupport = typeof el[ename] === 'function';
                    el.removeAttribute(ename);
                }
            }
            cacheSupport[name] = isSupport;
            return isSupport;
        };
    })();

    var $nativeTypes = ['unload', 'beforeunload', 'resize', 'DOMContentLoaded', 'hashchange', 'popstate', 'error', 'abort', 'scroll', 'message'];

    var CODES = {
        38: 'up',
        39: 'right',
        40: 'down',
        37: 'left',
        16: 'shift',
        17: 'control',
        18: 'alt',
        9: 'tab',
        13: 'enter',
        36: 'home',
        35: 'end',
        33: 'pageup',
        34: 'pagedown',
        45: 'insert',
        46: 'delete',
        27: 'escape',
        32: 'space',
        8: 'backspace'
    };

    var customEvent = function(e, ctype) {

        var target = e.target;
        while (target && target.nodeType === 3) {
            target = target.parentNode;
        }

        var api = {
            e: e,
            type: ctype || e.type,
            shift: e.shiftKey,
            control: e.ctrlKey,
            alt: e.altKey,
            meta: e.metaKey,
            target: e.target,
            related: e.relatedTarget,
            page: null,
            client: null
        };
        var type = e.type;
        if (type.indexOf('key') === 0) {
            var code = e.which || e.keyCode;
            if (CODES[code]) {
                api.key = CODES[code];
            } else if (type === 'keydown' || type === 'keyup') {
                if (code > 111 && code < 124) {
                    api.key = 'f' + (code - 111);
                } else if (code > 95 && code < 106) {
                    api.key = code - 96;
                } else {
                    api.key = String.fromCharCode(code).toLowerCase();
                }
            }
        } else if (type === 'click' || type === 'dbclick' || type.indexOf('mouse') === 0 || type === 'DOMMouseScroll' || type === 'wheel' || type === 'contextmenu') {
            var doc = (!document.compatMode || document.compatMode === 'CSS1Compat') ? document.html : document.body;
            api.page = {
                x: (e.pageX !== null) ? e.pageX : e.clientX + doc.scrollLeft,
                y: (e.pageY !== null) ? e.pageY : e.clientY + doc.scrollTop
            };
            api.client = {
                x: (e.pageX !== null) ? e.pageX - window.pageXOffset : e.clientX,
                y: (e.pageY !== null) ? e.pageY - window.pageYOffset : e.clientY
            };
            api.isRight = (e.which === 3 || e.button === 2);
            if (type === 'mouseover' || type === 'mouseout') {

            }
        }
        api.preventDefault = e.preventDefault.bind(e);
        api.stopPropagation = e.stopPropagation.bind(e);
        api.stop = function() {
            e.preventDefault();
            e.stopPropagation();
        };
        return api;
    };

    var getType = function(type) {
        if (type === 'mousewheel') {
            if (!isEventSupport('mousewheel')) {
                type = 'DOMMouseScroll';
            }
        }
        return type;
    };

    root.dom = {
        /**
         * Get HtmlElement position
         *
         * @return {Position}
         */
        position: function($el) {
            var rect = $el.getBoundingClientRect();
            return {
                x: rect.left,
                y: rect.top,
                width: rect.right - rect.left,
                height: rect.bottom - rect.top
            };
        },
        /**
         * Simple dom selector
         *
         * @param {string} selector
         * @param {HTMLElement} context
         * @retrun {HTMLElement}
         */
        query: function(selector, context) {
            try {
                return (context || document).querySelector(selector);
            } catch (e) {
                console.warn(e);
            }
            return null;
        },
        /**
         *
         * @param {string} selector
         * @param {HTMLElement} context
         * @retrun {array} List of HTMLElement
         */
        queryAll: function(selector, context) {
            try {
                return ehcor.toArray((context || document).querySelectorAll(selector));
            } catch (e) {
                console.warn(e);
            }
            return [];
        },
        on: function(target, type, callback, bind) {
            bind = bind || null;
            var handler = $nativeTypes.indexOf(type) !== -1 ? callback.bind(bind) : function(e) {
                callback.call(bind, customEvent(e, type));
            };
            target.addEventListener(getType(type), handler, false);
        }
    };




})(ehcor);
