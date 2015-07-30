module.exports = function(grunt) {
    grunt.initConfig( {
        browserify : {
            dev : {
                files : {
                    'public/js/bundle.js' :[ 'public/**/*.jsx', 'app/common/events.js']
                },
                options : {
                    watch : true,
                    keepAlive : true,
                    transform :[ 
                        ['reactify', {'es6' : true}]
                    ],
                    extensions : ['.jsx', '.js']
                }
            }
        },
        nodemon: {
            dev : {
                script : 'app/server.js',
                options : {
                    ignore : ['public/**',  'node_modules/**', 'package.json', 'Gruntfile.js'],
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
    //grunt.loadNpmTasks('grunt-contrib-uglify');
    //grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-nodemon');
    //grunt.loadNpmTasks('grunt-babel');
    grunt.registerTask('default', ['concurrent']);
};
