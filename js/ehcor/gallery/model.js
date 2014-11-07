(function(root) {
    'use strict';

    /**
     * @namespace ehcor.gallery.model
     */
    root.model = {};

    var sid = (function() {
        var time = new Date().getTime();
        var SID = 1;
        return function() {
            return time + '-' + (SID += 1);
        };
    })();

    /**
     * File
     *
     * @class
     * @memberof ehcor.gallery.model
     *
     * @param {string} id
     * @param {string} name
     * @param {string} size
     * @param {integer} mime
     * @param {string} data
     */
    function File(id, name, size, mime, data) {
        this.id = id || sid();
        console.debug('ehcor.model.File(' + this.id + ', ' + name + ', ' + size + ', ' + mime + ', data(' + data.length + '))');

        this.name = name;
        this.size = size;
        this.mime = mime;
        this.data = data;
        this.saved = !!id;
        this.width = 0;
        this.height = 0;
    }
    File.prototype = /** @lends ehcor.gallery.model.File.prototype */ {

        /**
         * Serialize file object
         *
         * @return {Object}
         */
        serialize: function() {
            return {
                id: this.id,
                saved: this.saved,
                name: this.name,
                size: this.size,
                type: this.type,
                data: this.data
            };
        }
    };


    /**
     * Files
     *
     * @class
     * @memberof ehcor.gallery.model
     * @name Files
     * @extend ehcor.Events
     * @param {ehcor.gallery.storage.FileLocalStorage} storage
     */
    function Files(fileStorage) {
        ehcor.Events.call(this);
        console.debug('ehcor.model.Files(<IStorage>)');
        this._files = {};
        this._storage = fileStorage;
        this._size = 0;
    }

    /** @ignore */
    Files.prototype = Object.create(ehcor.Events.prototype);

    /**
     * Find file by id
     *
     * @memberof ehcor.gallery.model.Files.prototype
     * @param {string} id
     */
    Files.prototype.find = function(id) {
        return this._files[id];
    };

    /**
     * Return number of files
     *
     * @memberof ehcor.gallery.model.Files.prototype
     * @return {number}
     */
    Files.prototype.size = function() {
        return this._size;
    };

    /**
     * Add file
     *
     * @memberof ehcor.gallery.model.Files.prototype
     * @param {object} file
     * @param {boolean} notsave
     */
    Files.prototype.add = function(file) {
        console.debug('ehcor.model.Files::add(File(' + file.id + '))');
        var self = this;
        if (!this._files.hasOwnProperty(file.id)) {
            this._size += 1;
        }
        this._files[file.id] = file;
        this._storage.addFile(file, function(err) {
            if (err) {
                console.error(err);
            } else {
                self.trigger('add', file);
            }
        });
    };
    /**
     * Remove file
     *
     * @memberof ehcor.gallery.model.Files.prototype
     * @param {string} id
     */
    Files.prototype.remove = function(id) {
        console.debug('ehcor.model.Files::remove(' + id + ')');
        var file = this._files[id];
        if (file) {
            this._size -= 1;
            var self = this;
            self._storage.removeFile(file, function(err) {
                if (err) {
                    console.error(err);
                } else {
                    delete self._files[file.id];
                    self.trigger('remove', file);
                }
            });
        } else {
            console.warn('ehcor.model.Files::remove() - Not found file: ' + id);
        }
    };
    /**
     * Load file from storage
     *
     * @memberof ehcor.gallery.model.Files.prototype
     */
    Files.prototype.load = function() {
        console.debug('ehcor.model.Files::load()');
        var self = this;
        var files = this._storage.loadFiles(function(err, files) {
            for (var i = 0, j = files.length; i < j; i++) {
                var file = files[i];
                self._size += 1;
                self._files[file.id] = file;
                self.trigger('load', file);
            }
        });

    };

    root.model.File = File;
    root.model.Files = Files;
})(ehcor.gallery);
