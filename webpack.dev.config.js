var webpack = require('webpack');
var path = require('path');
var fs = require('fs');

var argv         = require('yargs').argv;
var sourceSrc    = argv.src || 'src';

var getEntry = function() {
    var entryPath = path.resolve(__dirname, sourceSrc);
    var dirs = fs.readdirSync(entryPath);
    var matchs = [], files = {}, filePath;
    dirs.forEach(function(item) {
        matchs = item.match(/(.+)\.html$/);
        if (matchs) {
            filePath = path.resolve(__dirname, sourceSrc + '/js', matchs[1]);
            if (fs.existsSync(filePath + '.jsx'))
                files[matchs[1]] = [
                    'webpack/hot/dev-server',
                    'webpack-hot-middleware/client',
                    filePath
                ];
        }
    });
    return files;
};

var config = {
    debug: true,
    devtool: '#eval-source-map',
    // context: path.join(__dirname, 'build', 'js'),

    resolve: {
        extensions: ['', '.js', '.jsx']
    },

    output: {
        path: path.join(__dirname, 'build', 'js'),
        publicPath: '/js/',
        filename: '[name].bundle.js'
    },

    externals: {
        "react": "React",
        "react-dom": "ReactDOM"
    },

    plugins: [
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify("development")
            }
        }),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
    ],

    module: {
        loaders: [{
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: 'babel'
        }],
        noparse: ['react', 'react-dom']
    }
}

config.entry = getEntry();

module.exports = config;