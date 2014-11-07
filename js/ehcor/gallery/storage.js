(function(root) {

    /**
     * @namespace ehcor.gallery.storage
     */
    root.storage = {};

    /**
     * @class
     * @name FileLocalStorage
     * @memberof ehcor.gallery.storage
     * @extend ehcor.storage.LocalStorage
     * @param {string} namespace
     */
    function FileLocalStorage(namespace) {
            ehcor.storage.LocalStorage.call(this, namespace);
            console.debug('ehcor.storage.FileLocalStorage(' + namespace + ')');
        }
        /** @ignore */
    FileLocalStorage.prototype = Object.create(ehcor.storage.LocalStorage.prototype);

    ehcor.ext(FileLocalStorage.prototype, /** @lends ehcor.gallery.storage.FileLocalStorage.prototype */ {

        /**
         * @param {ehcor.gallery.model.File} file
         * @param {function} callback
         */
        addFile: function(file, callback) {
            this.set(file.id, file.serialize(), callback);
        },

        /**
         * @param {ehcor.gallery.model.File} file
         * @param {function} callback
         */
        removeFile: function(file, callback) {
            this.remove(file.id, callback);
        },

        /**
         * @param {function} callback
         */
        loadFiles: function(callback) {
            this.load(function(err, data) {
                if (err) {
                    callback(err);
                } else {
                    callback(null, data.map(function(item) {
                        return new root.model.File(item.id, item.name, item.size, item.mime, item.data);
                    }));
                }
            });
        }
    });

    /**
     * @memberof ehcor.gallery.storage
     * @return {ehcor.gallery.storage.FileLocalStorage}
     */
    root.storage.factory = function() {
        return new FileLocalStorage('ehcor.gallery');
    };

})(ehcor.gallery);
