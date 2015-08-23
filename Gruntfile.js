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
                        ['reactify', {'es6' : true}]
                    ]
                }
            }
        },
        nodemon: {
            dev : {
                script : 'app/server.js',
                options : {
                    watch : ['app'],
                    nodeArgs : ['--harmony']
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

        }
        
        
    });
    
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.registerTask('default', ['concurrent']);
};
