(function(root) {
    var dom = root.dom;

    /**
     * @class
     * @name Upload
     * @memberof ehcor
     * @extends ehcor.Events
     */
    function Upload($dom) {
        root.Events.call(this);
        dom.on($dom, 'dragover', function(e) {
            e.preventDefault(); //need to drop
        });
        dom.on($dom, 'drop', function(e) {
            e.stop();
            this._prepare(e.dataTransfer.files);
        }, this);
        dom.on($dom, 'dragenter', function(e) {
            $dom.classList.add('over');
        });
        dom.on($dom, 'dragleave', function(e) {
            $dom.classList.remove('over');
        });
        this.$input = dom.query('input', $dom);
        dom.on(this.$input, 'change', this._upload, this);
    }
    Upload.prototype = Object.create(root.Events.prototype);

    root.ext(Upload.prototype, {

        _upload: function() {
            this._prepare(this.$input.files);
        },
        _prepare: function(files) {
            var len = files.length,
                buff = [],
                file, imageType, reader, self = this;

            root.toArray(files).forEach(function(file) {
                imageType = /image.*/;
                //is image
                if (/image\/(jpg|jpeg|png)/.test(file.type)) {
                    //load body
                    reader = new FileReader();
                    reader.onload = function(e) {
                        self.trigger('files', [{
                            name: file.name,
                            size: file.size,
                            mime: file.type,
                            data: e.target.result
                        }]);
                    };
                    reader.readAsDataURL(file);
                }
            });

        }
    });
    root.Upload = Upload;

})(ehcor);
