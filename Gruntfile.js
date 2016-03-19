module.exports = function(grunt) {
    grunt.initConfig( {
        watch : {
            tests : {
                files : ['tests/*.spec.ts', 'app/**/*.ts', 'app/**/*.tsx'],
                tasks : ['ts:tests', 'jasmine_nodejs:tests'],
                options : {
                    interrupt : false,
                    atBegin : true
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
                    extensions : ['.js', '.jsx'],
                    transform :['babelify' ]
                }
            },
            prod : {
                files : {
                    'public/js/bundle.js' :['public/js/app.jsx']
                },
                options : {
                    transform :['babelify' ]
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
        jasmine_nodejs: {
            tests : {
                specs : [ 
                    'tests/**'
                     ]
            }
        },
        karma : {
            tests : {
                basePath : './',
                //preprocessors : {
                   // 'app/common/**/*.ts': ['browserify', 'coverage'],
                   // 'app/service/**/*.ts': ['browserify', 'coverage'],
                   // 'app/model/**/*.ts': ['browserify', 'coverage'],
                   // 'tests/**/*.ts': ['browserify']
               // },
                browserify : {
                    debug : true,
                    transform :[ 
                        [
                            'tsify', 
                        ]
                    ]
                },
                files : [
                    {
                        src : [ 
                            'tests/**/*.js',
                            'app/common/**/*.js',
                            'app/model/**/*.js'
                            ]
                     }
                ],
                logLevel : 'INFO',
                reporters :['spec', 'coverage'],
                browsers : ['PhantomJS'],
                //browsers : ['Chrome'],
                singleRun : true,
                autoWatch : true,
                frameworks : ['jasmine'],
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
        ts : {
            options : {
                module : 'commonjs',
                jsx : 'react',
                fast : 'never',
                target : 'es6',
                experimentalDecorators:true
            },
            dev : {
                src : ['app/**/*.ts', 'app/**/*.jsx']
            },
            prod : {

            },
            tests : {
                src : ['app/model/*.ts', 'tests/**/*.spec.ts']
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
    grunt.loadNpmTasks('grunt-jasmine-nodejs');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-ts');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.registerTask('tests', ['ts:tests', 'jasmine_nodejs:tests']);
    grunt.registerTask('dev', ['concurrent']);
    grunt.registerTask('prod', ['browserify:prod', 'uglify:prod']);
};
