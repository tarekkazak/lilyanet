module.exports = function(grunt) {
    grunt.initConfig( {
        browserify : {
            dev : {
                files : {
                    'public/js/bundle.js' :['public/js/app.jsx']
                },
                options : {
                    watch : true,
                    keepAlive : true,
                    transform :[ 
                        ['babelify']
                    ]
                }
            },
            prod : {
                files : {
                    'public/js/bundle.js' :['public/js/app.jsx']
                },
                options : {
                    transform :[ 
                        ['babelify']
                    ]
                }
            }
        },
        nodemon: {
            dev : {
                script : 'app/server.js',
                options : {
                    watch : ['app', 'public/js'],
                    env : {
                        PORT : '5500',
                        SOCKET_SERVER:'http://192.168.1.150:3300',
                        ENVIRONMENT : 'DEV'
                    }
                }
            }
        },
        concurrent : {
            dev : {
                tasks : ['browserify:dev', 'nodemon:dev'],
                options : {
                    logConcurrentOutput : true,
                    limit:3
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
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.registerTask('dev', ['concurrent']);
    grunt.registerTask('prod', ['browserify:prod', 'uglify:prod']);
};
