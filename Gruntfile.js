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

        bumpup: 'package.json',

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


        // Make sure code styles are up to par and there are no obvious mistakes
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: [
                'Gruntfile.js',
                '<%= yeoman.preggieapi %>'
            ]
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

        // Run some tasks in parallel to speed up the build process
        concurrent: {
            server: [
                'copy:styles',
                'less:prod'
            ],
            test: [
                'copy:styles'
            ],
            dist: [
                'copy:styles',
                'less:prod'
            ]
        },

        closureCompiler:  {

            options: {
                // [REQUIRED] Path to closure compiler
                compilerFile: 'tools/closure_compiler/compiler.jar',

                // [OPTIONAL] set to true if you want to check if files were modified
                // before starting compilation (can save some time in large sourcebases)
                checkModified: true,

                compilerOpts: {
                    charset: "UTF-8"
                }

            },

            // any name that describes your task
            targetName: {
                // [OPTIONAL] Target files to compile. Can be a string, an array of strings
                // or grunt file syntax (<config:...>, *)
                src: '<%= globalConfig.buildPath %>/preggieapi.min.tmp.js',

                // [OPTIONAL] set an output file
                dest: '<%= globalConfig.buildPath %>/preggieapi.min.js'
            }
        },

        usebanner: {
            dist: {
                options: {
                    position: 'top',
                    banner: '/*! <%= pkg.name %> | <%= grunt.template.today("yyyy-mm-dd") %> */'
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
	    }
    });

	grunt.registerTask('doc', function (target) {
		grunt.task.run([
			'jsdoc'
		]);
	});

    grunt.registerTask('dev', function (target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'connect:dist:keepalive']);
        }

        grunt.task.run([
            'watch'
        ]);
    });

    // Task which create preggieapi.loader.js for all projects
    grunt.registerTask("create-loader", "Create preggieapi.loader.js for each project", function() {

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
            'copy:modules',
            'clean:dist',
            'concat:preggieapi',
            'closureCompiler',
            'clean:preggieapitmp',
            'usebanner:dist',
            'create-loader',
            'bumpup',
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