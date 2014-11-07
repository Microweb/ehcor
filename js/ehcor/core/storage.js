(function(root) {

    //interface for storage
    function Storage() {}
    Storage.prototype = {
        set: function(id, data, callback) {
            throw new Error('Not implement: ehcor.Storage::set(file)');
        },
        remove: function(id, callback) {
            throw new Error('Not implement: ehcor.Storage::remove(id)');
        },
        load: function(callback) {
            throw new Error('Not implement: ehcor.Storage::load()');
        }
    };

    //local storage
    function LocalStorage(ns) {
        console.debug('ehcor.storage.LocalStorage(' + ns + ')');
        this.ns = ns;
    }
    LocalStorage.prototype = Object.create(Storage.prototype);

    root.ext(LocalStorage.prototype, {
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
        remove: function(id, callback) {
            console.debug('ehcor.storage.LocalStorage::remove(' + id + ')');
            var kid = this._id(id);
            this._removeKey(kid);
            localStorage.removeItem(kid);
            callback();
        },
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
        _id: function(fid) {
            return this.ns + '-file-' + fid;
        },
        _kid: function() {
            return this.ns + '-keys';
        },
        _getKeys: function() {
            var keys = localStorage.getItem(this._kid());
            return keys ? JSON.parse(keys) : {};
        },
        _setKeys: function(keys) {
            localStorage.setItem(this._kid(), JSON.stringify(keys));
        },
        _addKey: function(id) {
            var keys = this._getKeys();
            keys[id] = 1;
            this._setKeys(keys);
        },
        _removeKey: function(id) {
            var keys = this._getKeys();
            delete keys[id];
            this._setKeys(keys);
        },
    });

    root.storage = function(namespace) {
        return new LocalStorage(namespace);
    };
    root.storage.LocalStorage = LocalStorage;

})(ehcor);
