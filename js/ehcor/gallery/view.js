(function(root) {
    'use strict';

    /**
     * @namespace ehcor.gallery.view
     */
    root.view = {};

    var dom = ehcor.dom;

    /**
     * UI
     *
     * @class
     * @memberof ehcor.gallery.view
     * @extend ehcor.Events
     * @param {HTMLElement} $dom
     */
    function UI($dom) {
        console.debug('ehcor.View::init(' + $dom + ')');
        ehcor.Events.call(this);
        this.$dom = $dom;
        this.$number = $dom.querySelector('h1 span');

        this._ = {
            item: dom.query('#ehcor-view-item').innerHTML
        };
        dom.on(this.$dom, 'click', function(e) {
            var $el = e.target;
            while ($el && $el.tagName) {
                var cmd = $el.getAttribute('data-cmd');
                if (cmd) {
                    var match = /#\/(\w+?)\/([\w\-]+)/.exec(cmd);
                    if (match) {
                        e.stop();

                        this.trigger(match[1], match[2]);
                    }
                    break;
                }
                $el = $el.parentNode;
            }
        }, this);
    }

    /** @ignore */
    UI.prototype = Object.create(ehcor.Events.prototype);

    ehcor.ext(UI.prototype, /** @lends ehcor.gallery.view.UI.prototype */ {

        /**
         * Set selected image as "to-remove"
         *
         * @param {string} id
         */
        toRemove: function(id) {
            var uid = this._id(id);
            var $el = dom.query('#' + uid);
            if ($el) {
                $el.classList.add('to-remove');
            }
        },

        /**
         * Set selected image as "saved"
         *
         * @param {string} id
         */
        savedFile: function(id) {
            var uid = this._id(id);
            var $el = dom.query('#' + uid);
            if ($el) {
                $el.classList.add('saved');
            }
        },

        /**
         * Set selected image
         *
         * @param {string} id
         */
        removeFile: function(id) {
            var uid = this._id(id);
            var $el = dom.query('#' + uid);
            if ($el && $el.parentNode) {
                $el.parentNode.removeChild($el);
            }
        },

        /**
         * Add and display image
         *
         * @param {ehcor.gallery.model.File} file
         */
        addFile: function(file) {
            var data = file.serialize();
            data.uid = this._id(file.id);
            var html = ehcor.format(this._.item, data).replace(/^\s+/g, '');
            var el = document.createElement('div');
            el.innerHTML = html;
            var $el = el.firstChild;
            el = null;
            this.$dom.appendChild($el);
            var image = new Image();
            image.onload = function() {

                var dw = 150;
                var dh = 150;
                var canvas = document.createElement('canvas');
                canvas.width = dw;
                canvas.height = dh;
                $el.appendChild(canvas);
                var ctx = canvas.getContext('2d');

                //lite math
                var iw = image.width;
                var ih = image.height;
                var sw = iw / dw;
                var sh = ih / dh;

                var d = sw > sh ? sh : sw;
                sw = d * dw;
                sh = d * dh;
                var sx = (iw - sw) / 2;
                var sy = (ih - sh) / 2;
                ctx.drawImage(image, sx, sy, sw, sh, 0, 0, dw, dh);

                file.width = iw;
                file.height = ih;
            };
            image.src = file.data;

        },

        /**
         * Update gallery counter
         *
         * @param {number} num
         */
        update: function(num) {
            console.log(num);
            this.$number.innerHTML = num > 0 ? '(' + num + ')' : '';
        },

        /**
         * Generate dom id

         * @param {string} id
         * @return {string}
         */
        _id: function(id) {
            return 'ehcor-view-item-' + id;
        },
    });

    /**
     * Create UI
     *
     * @memberof ehcor.gallery.view
     * @param {HTMLElement} $dom
     */
    root.view.factory = function($dom) {
        return new UI($dom);
    };
})(ehcor.gallery);
