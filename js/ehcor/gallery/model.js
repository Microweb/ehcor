(function(root) {
    'use strict';

    var sid = (function() {
        var time = new Date().getTime();
        var SID = 1;
        return function() {
            return time + '-' + (SID += 1);
        };
    })();

    /**
     * Constructor
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
    File.prototype = {
        /**
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
        },
        printSize: function(bytes) {
            var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
            if (bytes === 0) {
                return 'n/a';
            }
            var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
            return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
        }
    };


    /**
     * Constructor
     *
     * @param {object} storage
     */
    function Files(fileStorage) {
        ehcor.Events.call(this);
        console.debug('ehcor.model.Files(<IStorage>)');
        this._files = {};
        this._storage = fileStorage;
        this._size = 0;
    }
    Files.prototype = Object.create(ehcor.Events.prototype);
    /**
     * Find file by id
     *
     * @param {string} id
     */
    Files.prototype.find = function(id) {
        return this._files[id];
    };

    Files.prototype.size = function() {
        return this._size;
    };

    /**
     *
     * @param {object} file
     * @param {boolean} notsave
     */
    Files.prototype.add = function(file) {
        console.debug('ehcor.model.Files::add(File(' + file.id + '))');
        var self = this;
        if(!this._files.hasOwnProperty(file.id)){
            this._size+=1;
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
     *
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
     */
    Files.prototype.load = function() {
        console.debug('ehcor.model.Files::load()');
        var self = this;
        var files = this._storage.loadFiles(function(err, files) {
            for (var i = 0, j = files.length; i < j; i++) {
                var file = files[i];
                self._size+=1;
                self._files[file.id] = file;
                self.trigger('load', file);
            }
        });

    };

    root.model = {
        File: File,
        Files: Files
    };
})(ehcor.gallery);
