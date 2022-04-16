const path = require('path');

module.exports = [{
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
        filename: "scene.js",
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.tsx?$/,
                loader: "ts-loader"
            }
        ]
    }
},{
    target: "web",
    mode: "production",
    entry: "./src/index.ts",
    output: {
        library: {
            name: 'sceneBlocking',
            type: 'umd',
            umdNamedDefine: true
        },
        path: path.resolve(__dirname, './express/pub/js'),
        filename: "scene-production.js",
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.tsx?$/,
                loader: "ts-loader"
            }
        ]
    }
},
//     {
//     target: "web",
//     mode: "development",
//     entry: "./src/index.ts",
//     output: {
//         library: {
//             type: "module",
//         },
//         path: path.resolve(__dirname, './docs'),
//         filename: "scene.js",
//     },
//     experiments: {
//         outputModule: true,
//     },
//     resolve: {
//         extensions: ['.ts', '.js'],
//     },
//     module: {
//         rules: [
//             {
//                 test: /\.css$/i,
//                 use: ["style-loader", "css-loader"],
//             },
//             {
//                 test: /\.tsx?$/,
//                 loader: "ts-loader"
//             }
//         ]
//     }
// }
];