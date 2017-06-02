var path = require('path');
const webpack = require('webpack');
let GoogleSyncPlugin = require('./googleSyncPlugin');

module.exports = {
    entry: './app/presentation/editor/main.jsx',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'public')

    },

    devtool : 'eval-source-map',
    module: { 
        rules: [ 
            {
                test: /\.jsx$/,
                use: {
                    loader : 'babel-loader',
                    options : {
                        presets : ['env', 'react']
                    }
                }

            }     
        ] 
    },


    devServer: {
        contentBase: path.join(__dirname, "public"),
        port: 9000
    },
    plugins : [
        new GoogleSyncPlugin(),
        new webpack.LoaderOptionsPlugin({
            debug: true
        })
    ]
};
