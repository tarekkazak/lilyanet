module.exports = function(grunt) {
    grunt.initConfig( {
        watch : {
            options : {
                reload:true
            },
            server : {
                files : ['app/common/**/*.ts','app/core/**/*.ts', 'server.js'],
                tasks : ['ts:server'],
                options : {
                    interrupt : false,
                    atBegin : true,
                    spawn:false
                }
            },
            dev : {
                files : ['app/common/**/*.ts','app/presentation/**/*.ts', 'app/presentation/**/*.tsx', '**/*.scss'],
                tasks : ['ts:ui', 'browserify:dev', 'sass:dev'],
                options : {
                    interrupt : false,
                    atBegin : true,
                    spawn:false
                }
            },
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
                    'public/js/lilyanet.js' :['app/presentation/lilyanet.js']
                }
            },
            prod : {
                files : {
                    'public/js/lilyanet.min.js' :['app/presentation/lilyanet.js']
                }
            }
        },
        nodemon: {
            dev : {
                script : 'app/server.js',
                options : {
                   //nodeArgs : ['--debug-brk'],
                    watch : ['app'],
                    env : {
                        PORT : '5500',
                        SOCKET_SERVER:'http://192.168.1.107:3300',
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
                tasks : ['watch:dev','watch:server', 'nodemon:dev'],
                options : {
                    logConcurrentOutput : true,
                    limit:5
                }
            }

        },
        ts : {
            options : {
                module : 'commonjs',
                jsx : 'react',
                fast : 'never',
                experimentalDecorators:true,
                target : 'es6'
            },
            server : {
                src : ['app/index.ts', 'app/core/**/*.ts',  'app/common/**/*.ts'],
                options : {
                    sourceMap : false 
                }

            },
            ui : {
                src : ['app/presentation/**/*.ts', 'app/presentation/**/*.tsx', 'app/common/**/*.ts']
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
                    'public/js/lilyanet.min.js' : ['public/js/lilyanet.js']
                }
            }
        }
        
        
    });
    
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-jasmine-nodejs');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-ts');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.registerTask('tests', ['ts:tests', 'jasmine_nodejs:tests']);
    grunt.registerTask('dev', ['concurrent']);
    grunt.registerTask('prod', ['sass:dev', 'ts:server', 'ts:ui', 'browserify:prod']);
};
