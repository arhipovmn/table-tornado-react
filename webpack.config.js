const path = require('path');

const cssLoader = {
    loader: 'css-loader',
    options: {
        sourceMap: true,
        modules: true,
        localIdentName: '[name]__[local]__[hash:base64:5]',
    },
};

const lessLoader = {
    loader: 'less-loader',
    options: {
        sourceMap: true,
    },
};

const srcPath = path.resolve(__dirname, "./core/js");

module.exports = {
    mode: "development", // this production and webpack.config.js
    entry:'./core/js/components/Index/Index.jsx',
    output: {
        path: path.resolve(__dirname, './static'),
        filename: 'bundle.js',
        publicPath: './static/',
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                include: [srcPath],
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                [
                                    "env", {
                                        modules: false,
                                        targets: {
                                            browsers: [">0.25%"]
                                        },
                                    }
                                ],
                                'react',
                            ],
                        },
                    },
                ],
            },
            {
                test: /\.css$/,
                include: [srcPath],
                use: [
                    "style-loader",
                    cssLoader,
                ],
            },
            {
                test: /\.less$/,
                include: [srcPath],
                use: [
                    "style-loader",
                    cssLoader,
                    lessLoader,
                ],
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                include: [srcPath],
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10000,
                        },
                    },
                ],
            },
        ],
    }
};