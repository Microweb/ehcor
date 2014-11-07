(function(root) {

    /**
     * Storage service
     *
     * @namespace ehcor.storage
     */
    root.storage = {};


    /**
     * Storage
     *
     * @name Storage
     * @memberof ehcor.storage
     * @class
     */
    function Storage() {}
    Storage.prototype = /** @lends ehcor.storage.Storage.prototype */ {

        /**
         * Set value on id
         *
         * @memberof ehcor.storage.Storage.prototype
         * @param {string} id
         * @param {*} data
         * @param {function} callback
         */
        set: function(id, data, callback) {
            throw new Error('Not implement: ehcor.Storage::set(file)');
        },
        /**
         * Remove element from id
         *
         * @memberof ehcor.storage.Storage.prototype
         * @param {string} id
         * @param {function} callback
         */
        remove: function(id, callback) {
            throw new Error('Not implement: ehcor.Storage::remove(id)');
        },
        /**
         * Load all elements
         *
         * @memberof ehcor.storage.Storage.prototype
         * @param {function} callback
         */
        load: function(callback) {
            throw new Error('Not implement: ehcor.Storage::load()');
        }
    };

    /**
     * LocalStorage
     *
     * @constructs
     * @name LocalStorage
     * @memberof ehcor.storage
     */
    function LocalStorage(ns) {
        console.debug('ehcor.storage.LocalStorage(' + ns + ')');
        this.ns = ns;
    }
    LocalStorage.prototype = Object.create(Storage.prototype);

    root.ext(LocalStorage.prototype, /** @lends ehcor.storage.LocalStorage.prototype */ {
        /**
         * @see {@link ehcor.storage.Storage.set}
         */
        set: function(id, data, callback) {
            var kid = this._id(id);
            console.debug('ehcor.storage.LocalStorage::add(' + id + ')');
            try {
                localStorage.setItem(kid, JSON.stringify(data));
                this._addKey(kid);
                callback();
            } catch (e) {
                callback(e.message);
            }
        },
        /**
         * @see {@link ehcor.storage.Storage.remove}
         */
        remove: function(id, callback) {
            console.debug('ehcor.storage.LocalStorage::remove(' + id + ')');
            var kid = this._id(id);
            this._removeKey(kid);
            localStorage.removeItem(kid);
            callback();
        },
        /**
         * @see {@link ehcor.storage.Storage.load}
         */
        load: function(callback) {
            console.debug('ehcor.storage.LocalStorage::load()');
            var keys = this._getKeys();
            var buff = [];
            for (var key in keys) {
                var data = localStorage.getItem(key);
                if (data) {
                    buff.push(JSON.parse(data));
                }
            }
            callback(null, buff);
        },

        /**
         * Generate namespace id
         *
         * @private
         * @param {string} id
         * @return {string}
         */
        _id: function(id) {
            return this.ns + '-file-' + id;
        },
        /**
         * Generate namespace for keys
         *
         * @private
         * @return {string}
         */
        _kid: function() {
            return this.ns + '-keys';
        },

        /**
         * Load all key names
         *
         * @private
         * @return {object}
         */
        _getKeys: function() {
            var keys = localStorage.getItem(this._kid());
            return keys ? JSON.parse(keys) : {};
        },

        /**
         * Save keys
         *
         * @private
         * @param {object} keys
         */
        _setKeys: function(keys) {
            localStorage.setItem(this._kid(), JSON.stringify(keys));
        },

        /**
         * Add and save new key
         *
         * @private
         * @param {string} id
         */
        _addKey: function(id) {
            var keys = this._getKeys();
            keys[id] = 1;
            this._setKeys(keys);
        },

        /**
         * Remove and save new key
         *
         * @private
         * @param {string} id
         */
        _removeKey: function(id) {
            var keys = this._getKeys();
            delete keys[id];
            this._setKeys(keys);
        },
    });


    root.storage.factory = function(namespace) {
        return new LocalStorage(namespace);
    };
    root.storage.Storage = Storage;
    root.storage.LocalStorage = LocalStorage;

})(ehcor);
