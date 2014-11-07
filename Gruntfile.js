/*global module:true*/

module.exports = function(grunt) {
    'use strict';

    grunt.initConfig({
        pkg:grunt.file.readJSON('package.json'),
        config:{
            files:[
                'js/ehcor/core/main.js',
                'js/ehcor/core/dom.js',
                'js/ehcor/core/events.js',
                'js/ehcor/core/storage.js',
                'js/ehcor/core/upload.js',
                'js/ehcor/gallery/app.js',
                'js/ehcor/gallery/model.js',
                'js/ehcor/gallery/storage.js',
                'js/ehcor/gallery/view.js'
            ]
        },
        meta: {
            banner:'/*! sjs v<%= pkg.version %> sjs */'
        },
        jsbeautifier:{
            files:["<%=config.files %>"]
        },
        watch: {
            files:["<%=config.files %>"],
            tasks:['jshint']
        },

        jshint: {
            files:["<%=config.files %>"],
            options: {
                curly:true,
                eqeqeq:true,
                immed:true,
                latedef:true,
                newcap:false,
                noarg:true,
                sub:true,
                undef:true,
                boss:true,
                eqnull:true,
                wsh:true,
                browser:true,
                es5: true,
                globals: {
                    global:true,
                    self:true,
                    ehcor:true,
                    console:true
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-jsbeautifier');
        
    grunt.registerTask('default', ['jsbeautifier', 'jshint']);

};

