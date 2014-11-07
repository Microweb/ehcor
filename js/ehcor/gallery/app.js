(function(root) {
    'use strict';

    /**
     * @namespace ehcor.gallery
     */

    /**
     * Constructor
     *
     * @class
     * @memberof ehcor.gallery
     * @extends ehcor.Events
     * @param {Storage} storage
     */
    function App(view, storage) {
        console.debug('ehcor.Appp(<ehcor.api.IView>, <ehcor.api.IStorage>)');
        root.Events.call(this);
        this.view = view;


        this.files = new ehcor.gallery.model.Files(storage);
        this.files.on('load', this.loadFile, this);
        this.files.on('add', this.addFile, this);
        this.files.on('remove', this.removeFile, this);

        view.on('remove', this.onRemoveFile, this);
        view.on('show', this.onShowFile, this);
    }

    /** @ignore */
    App.prototype = Object.create(ehcor.Events.prototype);

    root.ext(App.prototype, /** @lends ehcor.gallery.App.prototype */ {
        /** 
         * Save uploaded files
         *
         * @param {array} files
         */
        upload: function(files) {
            console.debug('ehcor.App::upload(files(' + files.length + '))');
            for (var i = 0, j = files.length; i < j; i++) {
                var f = files[i];
                var file = new root.gallery.model.File(null, f.name, f.size, f.mime, f.data);
                this.view.addFile(file);
                this.files.add(file);
                this.view.update(this.files.size());
            }
        },
        /** 
         * Load file
         *
         * @param {ehcor.gallery.model.File} file
         */
        loadFile: function(file) {
            this.view.addFile(file);
            this.view.savedFile(file.id);
            this.view.update(this.files.size());
        },
        /** 
         * Add file
         *
         * @param {ehcor.gallery.model.File} file
         */
        addFile: function(file) {
            this.view.savedFile(file.id);
            this.view.update(this.files.size());
        },
        /** 
         * Remove file
         *
         * @param {ehcor.gallery.model.File} file
         */
        removeFile: function(file) {
            this.view.removeFile(file.id);
            this.view.update(this.files.size());
        },
        /**
         * Callback for view
         *
         * @param {string} id
         */
        onRemoveFile: function(id) {
            console.log('App::removeFile(' + id + ')');
            this.view.toRemove(id);
            this.files.remove(id);
        },
        /**
         * Callback for view
         *
         * @param {string} id
         */
        onShowFile: function(id) {
            console.log('App::showFile(' + id + ')');
            var file = this.files.find(id);
            if (file) {
                var win = window.open('', 'pictureViewer', 'location=no, directories=no, fullscreen=yes, menubar=no, status=no, toolbar=no, width=' + (file.width + 3) + ', height=' + (file.height + 3) + ', scrollbars=no');
                var doc = win.document;
                doc.writeln('<html>');
                doc.writeln('<body style="margin: 0 0 0 0;">');
                doc.writeln('<a href="javascript:window.close();">');
                doc.writeln('<img src="' + file.data + '" alt="Click to close" id="bigImage"/>');
                doc.writeln('</a>');
                doc.writeln('</body></html>');
                doc.close();
            }
        },
        /**
         * Run application
         */
        run: function() {
            console.debug('ehcor.App::run()');
            var self = this;
            setTimeout(function() {
                self.files.load();
            });
        }
    });

    root.gallery = {
        App: App
    };

})(ehcor);
