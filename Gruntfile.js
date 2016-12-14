'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    var globalConfig = {
        sourcePath: 'source',
        buildPath: 'build',
        bowerPath: 'bower_components',

        filesToBuild: []
    };

    // Define the configuration for all the tasks
    grunt.initConfig({
        globalConfig: globalConfig,

        pkg: grunt.file.readJSON('package.json'),


        // Watches files for changes and runs tasks based on the changed files
        watch: {
            js: {
                //files: ['<%= yeoman.dist %>/js/*.js'],
                files: ['<%= yeoman.sourcePREGGIEAPIPath %>/**/*.js'],
                tasks: ['build']
            },
            gruntfile: {
                files: ['Gruntfile.js']
            }
        },

        concat: {
            preggieapi:{
                src: '<%= globalConfig.filesToBuild %>',
                dest: '<%= globalConfig.buildPath %>/preggieapi.min.tmp.js'
            }
        },

        // Empties folders to start fresh
        clean: {
            dist: {
                files: [
                    {
                        src: [
                            '<%= globalConfig.buildPath %>/*'
                        ]
                    }
                ]
            },

            preggieapitmp: {
                files: [
                    {
                        src: [
                            '<%= globalConfig.buildPath %>/preggieapi.min.tmp.js'
                        ]
                    }
                ]
            }
        },

        // Copies remaining files to places other tasks can use
        copy: {
            modules:{
                files: [
                    {
                        expand: true,
                        cwd: '<%= globalConfig.bowerPath %>/',
                        src: [
                            'Modules/source/modules.js'
                        ],
                        dest: '<%= globalConfig.sourcePath %>/',
                        flatten: true,
                        filter: 'isFile'
                    }
                ]
            }
        },

        uglify: {
            options: {
                compress: {
                    dead_code: true,
                    // drop_console: true,

                    global_defs: {
                        'DEBUG': false
                    }
                }
            },
            my_target: {
                files: {
                    '<%= globalConfig.buildPath %>/preggieapi.min.js': [
                        '<%= globalConfig.buildPath %>/preggieapi.min.tmp.js'
                    ]
                }
            }
        },

        usebanner: {
            dist: {
                options: {
                    position: 'top',
                    banner: '/*! \n' +
                    ' * <%= pkg.name %> v' + grunt.file.readJSON('package.json').version + '\n' +
                    ' * \n' +
                    ' * Author: ' + grunt.file.readJSON('package.json').author + '\n' +
                    ' * Date: ' + new Date().toLocaleString() + '\n' +
                    ' * \n' +
                    ' */'
                },
                files: {
                    src: [ '<%= globalConfig.buildPath %>/preggieapi.min.js' ]
                }
            }
        },

	    jsdoc : {
		    dist : {
			    src: ['<%= globalConfig.sourcePath %>/plugins/**/*.js'],
			    options: {
				    destination: 'doc',
				    template : "node_modules/jsdoc3-bootstrap"
			    }
		    }
	    },

        'string-replace': {
            dist: {
                files: {
                    './source/plugins/api.js': './source/plugins/api.js'
                },
                options: {
                    replacements: [{
                        pattern: /version = '\d+\.\d+\.\d+'/ig,
                        replacement: function(match, p1) {
                            return "version = '" + grunt.file.readJSON('package.json').version + "'";
                        }
                    }]
                }
            }
        }
    });

	grunt.registerTask('doc', function (target) {
		grunt.task.run([
			'jsdoc'
		]);
	});

    // Task which create preggieapi.loader.js for all projects
    grunt.registerTask("create-loader", "Create preggieapi.loader.js", function() {

        var plugins = [];

        // read all subdirectories from modules folder
        grunt.file.expand([
            globalConfig.sourcePath + '/*.js',
            globalConfig.sourcePath + '/plugins/*.js',
            globalConfig.sourcePath + '/plugins/vendor/*.js'
        ]).forEach(function (file) {
            plugins.push('"' + file + '"\n');
        });

        // the file loader.js
        var content = function(){

            var plugins = ['%plugins%'];

            var findBaseUrl = function (self_name) {
                var nodes = document.getElementsByTagName("script");
                for(var i = 0; i < nodes.length; i++) {
                    var src = nodes[i].getAttribute("src") || "";
                    if(src.indexOf(self_name) != -1) {
                        return src.substr(0, src.indexOf(self_name));
                    }
                }
                return "";
            };


            var base = findBaseUrl('preggieapi.loader.js').replace(/build.*/, '');

            for(var i=0; i<plugins.length; i++){
                document.write('<script src="' + base + plugins[i] + '"></scr' + 'ipt>');
            }
        };

        grunt.file.write(globalConfig.buildPath + '/preggieapi.loader.js', '(' + content.toString().replace("'%plugins%'", plugins.join(',')) + ')();');
    });


    // Error task - print some information
    grunt.registerTask('error', function(){
        grunt.log.warn('Error... Use "grunt api" task');
    });


    // Set build task. Main task
    grunt.registerTask('build', function() {
        globalConfig.filesToBuild = [
            globalConfig.sourcePath + '/modules.js',
            globalConfig.sourcePath + '/plugins/*.js',
            globalConfig.sourcePath + '/plugins/vendor/*.js'
        ];

        grunt.task.run([
            'string-replace',
            'copy:modules',
            'clean:dist',
            'concat:preggieapi',
            'uglify',
            'clean:preggieapitmp',
            'usebanner:dist',
            'create-loader'
        ]);

    });


    // Set default task
    grunt.registerTask('default', ['error']);


    // Task for Preggie
    grunt.registerTask('api', function(){
        grunt.task.run([
            'build'
        ]);
    });

};