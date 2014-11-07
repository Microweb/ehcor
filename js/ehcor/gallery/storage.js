(function(root) {


    //local storage
    function FileLocalStorage(namespace) {
        ehcor.storage.LocalStorage.call(this, namespace);
        console.debug('ehcor.storage.FileLocalStorage(' + namespace + ')');
    }
    FileLocalStorage.prototype = Object.create(ehcor.storage.LocalStorage.prototype);

    ehcor.ext(FileLocalStorage.prototype, {

        addFile: function(file, callback) {
            this.set(file.id, file.serialize(), callback);
        },
        removeFile: function(file, callback) {
            this.remove(file.id, callback);
        },
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


    root.storage = function() {
        return new FileLocalStorage('ehcor.gallery');
    };

})(ehcor.gallery);
