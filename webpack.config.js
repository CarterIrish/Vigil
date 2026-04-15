const path = require('path');

module.exports = {
    entry: {
        app: './client/App.jsx',
        login: './client/Login.jsx',
        settings: './client/Settings.jsx'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
        ],
    },
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development', watchOptions: {
        aggregateTimeout: 200,
    },
    output: {
        path: path.resolve(__dirname, 'hosted'),
        filename: '[name]Bundle.js',
    },
    devtool: process.env.NODE_ENV === 'production' ? false : 'cheap-module-source-map',
};
