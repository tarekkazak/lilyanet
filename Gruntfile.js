module.exports = function(grunt) {
    grunt.initConfig( {
        watch : {
            tests : {
                files : './**/*.js',
                tasks : ['karma:tests'],
                options : {
                    spawn : false,
                    interrupt : true
                }
            }
        },
        sass : {
            options : {
                recursive : true,
                watch : 'stylesheets/sass'
            },
            dev : {
                files : {
                    'public/stylesheets/main.css' : 'stylesheets/sass/main.scss'
                }
            }
        },
        browserify : {
            dev : {
                files : {
                    'public/js/bundle.js' :['public/js/app.jsx']
                },
                options : {
                    watch : true,
                    keepAlive : true,
                    transform :[ 
                        ['babelify', 
                            {
                                presets : ['react', 'es2015']
                            }
                        ]
                    ]
                }
            },
            prod : {
                files : {
                    'public/js/bundle.js' :['public/js/app.jsx']
                },
                options : {
                    transform :[ 
                        ['babelify', {presets : ['react', 'es2015']}]
                    ]
                }
            }
        },
        nodemon: {
            dev : {
                script : 'app/server.js',
                options : {
                    watch : ['app'],
                    env : {
                        PORT : '5500',
                        SOCKET_SERVER:'http://192.168.1.150:3300',
                        ENVIRONMENT : 'DEV'
                    }
                }
            }
        },
        karma : {
            tests : {
                basePath : './',
                preprocessors : {
                    'tests/*.js': ['browserify'],
                    'app/common/*.js': ['browserify', 'coverage'],
                    'app/components/*.js': ['browserify', 'coverage'],
                    'app/model/*.js': ['browserify', 'coverage'],
                    'app/service/*.js': ['browserify', 'coverage']
                },
                browserify : {
                    debug : true,
                    transform : ['babelify']
                },
                files : [
                    {
                        src : [ 
                            'node_modules/babel-polyfill/dist/polyfill.js',
                            'tests/*.js',
                            'app/common/*.js',
                            'app/components/*.js',
                            'app/model/*.js',
                            'app/service/*.js'
                            ]
                     }
                ],
                logLevel : 'INFO',
                reporters :['spec', 'coverage'],
                browsers : ['PhantomJS'],
                //browsers : ['Chrome'],
                singleRun : false,
                autoWatch : true,
                frameworks : ['jasmine', 'browserify'],
                coverageReporter : {
                    type : 'html',
                    dir : 'coverage/'
                }
            }
        },
        concurrent : {
            dev : {
                tasks : ['browserify:dev', 'nodemon:dev', 'sass:dev'],
                options : {
                    logConcurrentOutput : true,
                    limit:4
                }
            }

        },
        uglify: {
            prod : {
                options :{
                    screwIE8 : true
                },
                files : {
                    'public/js/bundle.min.js' : ['public/js/bundle.js']
                }
            }
        }
        
        
    });
    
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.registerTask('tests', ['karma:tests']);
    grunt.registerTask('dev', ['concurrent']);
    grunt.registerTask('prod', ['browserify:prod', 'uglify:prod']);
};
