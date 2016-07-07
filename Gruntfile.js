/**
 *
 * This is grunt starter js file.
 *
 *  @samuelzuuka@gmail.com
 *
 *  Html
 *
 *  Js     -->  Concat  --> JsHint  --> Uglify
 *
 *  Css    -->  Sass/Less   --> Concat  -->  Cssmin
 *
 *  Imgs   -->   Imagemin
 *
 *
 *  Libraries
 *
 *  Fonts
 *
 *      [Copy -->]  Sass/Less  --> Contact --> JsHint --> Uglify --> Cssmin  --> Imagemin  --> Htmlmin
 *
 *
 *
 */
var fs = require('fs');

var mozjpeg = require('imagemin-mozjpeg');

const pngquant = require('imagemin-pngquant');

module.exports = function (grunt) {

    grunt.initConfig({
        pkg:grunt.file.readJSON('package.json'),
        destName:'dest',
        dest:'<%= destName%>/',
        srcName:'src',
        src:'<%= srcName%>/',
        tmpName:'<%=dest %>.tmp',
        tmp:'<%=tmpName %>/',
        dataName:'data',
        data:'<%= dataName%>/',
        bower_base:'bower_components',
        // copy from src dir to dest dir
        copy:{
            // copy files needn't to be modified :: font , html,
            static:{
                files:[
                    { expand:true,
                        cwd: '<%=srcName %>',
                        src: '**',
                        dest:'<%=dest %>',
                        filter:function(filepath) {
                            return filepath && !filepath.startsWith('src/sass') &&
                                    !filepath.startsWith('src/css') &&
                                    !filepath.startsWith('src/lib') &&
                                    !filepath.startsWith('src/js') &&
                                    !filepath.startsWith('src/html') &&
                                    //!filepath.startsWith('src/imgs') &&
                                    !filepath.endsWith('.html');
                        }
                    },
                    // bower dependencies
                    { expand:true,
                        cwd: '<%=bower_base %>',
                        src: ['modernizer/modernizr.js'],
                        dest:'<%=dest %>lib'
                    },
                    { expand:true,
                        cwd: '<%=src %>lib',
                        src: '**',
                        dest:'<%=dest %>lib'
                    },
                    { expand:true,
                        cwd: '<%=dataName %>',
                        src: '**',
                        dest:'<%=dest %>data'
                    }
                ]
            },
            adaptdev:{
                files:[
                    { expand:true,
                        cwd: '<%=tmp %>js',
                        src: '**',
                        dest:'<%=dest %>js'
                    },
                    { expand:true,
                        cwd: '<%=tmp %>css',
                        src: '**',
                        dest:'<%=dest %>css'
                    },
                    {
                        expand: true,
                        cwd: '<%=srcName %>',
                        src: ['**/*.html'],
                        dest: '<%=dest %>'
                    }
                ]
            },
            all:{
                files:[
                    { expand:true,
                        cwd: '<%=srcName %>',
                        src: '**',
                        dest:'<%=dest %>'
                    }
                ]
            }
        },
        // sass compile sass/scss to css   *.s[c|a]ss => *.css
        sass:{
            options: {
                style: 'expanded',
                sourcemap:'none'
            },
            all:{

                files:[
                    {
                        expand: true,
                        cwd: '<%=src %>sass',
                        src: ['*.scss','*.sass'],
                        dest: '<%=tmp %>css',
                        ext: '.css'
                    }
                ]
            }
        },
        // for single page application, merge all js / css into 1 file, not including libraries
        concat:{
            options:{
                separator: '/*****/\n'
            },
            js:{
                files:[
                    {
                        src: ['<%=src %>js/**/*.js'],
                        dest: '<%=tmp %>js/all.js'
                    }
                ]

            },
            css:{
                files:[

                    {
                        src: ['<%=tmp %>css/**/*.css'],
                        dest: '<%=tmp %>css/all.css'
                    }
                ]

            },
            all:{
                files:[
                    {
                        src: ['<%=src %>js/**/*.js'],
                        dest: '<%=tmp %>js/all.js'
                    },
                    {
                        src: ['<%=tmp %>css/**/*.css'],
                        dest: '<%=tmp %>css/all.css'
                    }
                ]
            }
        },
        // uglify js files *.js => *.min.js
        uglify:{
            options:{
                banner:'/*! <%=pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %>  --auto generated by grunt uglify */\n'
            },
            all:{

                files:[
                    {
                        expand: true,
                        cwd: '<%=tmp %>js',
                        src: '**/*.js',
                        dest: '<%=dest %>js',
                        rename: function (dest, src) {          // The `dest` and `src` values can be passed into the function
                            return dest +'/'+ src.replace('.js','.min.js'); // The `src` is being renamed; the `dest` remains the same
                        }
                    }
                ]
            }
        },
        // clean dest dir
        clean:{
            dest:{
                src:['<%=dest %>**','!<%=destName %>']
            },
            // clean tmp file
            tmp:{
                src:['<%=tmp %>']
            },
            all:{
                src:['<%=dest %>**','!<%=destName %>','<%=tmp %>']
            }
        },
        // check js errors
        jshint:{
            src:[
                '<%=tmp %>js/**.js'
                //'<%=src %>lib/**.js'
            ]
        },
        // monitor and rebuild
        watch:{
            scripts: {
                files: ['<%=src %>**','!'+'<%=src %>css/**'],
                tasks: ['rebuild'],
                options: {
                    spawn: false,
                    interrupt: true
                }
            }
        },
        //css minify a css file   *.css => *.min.css
        cssmin:{
            options: {
                shorthandCompacting: false,
                roundingPrecision: -1,
                banner:'/* css minified by grunt -- @BuildFuture \n*/'
            },
            all:{
                files: [
                    {
                        expand: true,
                        cwd: '<%=tmp %>css',
                        src: ['*.css', '!*.min.css'],
                        dest: '<%=dest %>css',
                        ext: '.min.css'
                    }
                ]

            }
        },
        htmlmin:{
            options: {
                removeComments: true,
                removeCommentsFromCDATA: true,
                collapseWhitespace: true,
                collapseBooleanAttributes: true,
                removeAttributeQuotes: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeOptionalTags: true
            },
            all:{

                files: [
                    {
                        expand: true,
                        cwd: '<%=srcName %>',
                        src: ['**/*.html'],
                        dest: '<%=dest %>',
                        ext: '.html'
                    }
                ]
            }
        },
        imagemin:{
            options: {                       // Target options
                optimizationLevel: 3,
                svgoPlugins: [{ removeViewBox: false }],
                use: [mozjpeg()]
            },
            all:{
                files:[
                    {
                        cwd:'<%=src %>imgs',
                        src:['**/*.{jpg,png,jpeg,gif}'],
                        dest:'<%=dest %>imgs'
                    },
                    {
                        cwd:'<%=dest %>lib',
                        src:['**/*.{jpg,png,jpeg,gif}'],
                        dest:'<%=dest %>lib'
                    }
                ]
            }

        },
        connect: {
            server: {
                options: {
                    port: 3000,
                    base: 'dest'
                }
            }
        }
    });


    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-connect');

    grunt.registerTask('build',['clean:all','copy:static','sass:all','concat:all','jshint','copy:adaptdev','connect:server','watch']);
    grunt.registerTask('rebuild',['clean:all','copy:static','sass:all','concat:all','copy:adaptdev','jshint']);

    grunt.registerTask('build-prod',['clean:all','copy:static','sass:all','concat:all','jshint','uglify:all','cssmin:all','htmlmin:all','connect:server','watch']);
    grunt.registerTask('rebuild-prod',['clean:all','copy:static','sass:all','concat:all','jshint','uglify:all','cssmin:all','htmlmin:all']);


    grunt.registerTask('default',['build']);

    grunt.event.on('watch', function(action, filepath, target) {
        grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
    });

};