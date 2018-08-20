const path = require('path')
const ExtractTextPlugin = require("extract-text-webpack-plugin");
module.exports = {
    entry:'./main.js',
    output: {
        filename:'bundle.js',
        path: path.resolve(__dirname,'./dist')
    },
    module:{
        rules:[
            {
                test:/\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                  })
            }
        ]
    },
    plugins: [
         new ExtractTextPlugin("[name].css"),
    ]
}