const path = require('path');

module.exports = {
    target: "web",
    mode: "development",
    entry: "./src/index.ts",
    output: {
        library: {
            name: 'sceneBlocking',
            type: 'umd',
            umdNamedDefine: true
        },
        path: path.resolve(__dirname, './express/pub/js'),
        filename: "bundle.js",
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
            }
        ]
    }
};