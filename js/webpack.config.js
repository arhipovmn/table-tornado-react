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

const srcPath = path.resolve(__dirname, "./src");

module.exports = {
    entry:'./js/src/index.js',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js',
        publicPath: './js/build/',
    },
    module: {
        rules: [
            { //0
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
                                            browsers: ["last 2 versions"],
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
}