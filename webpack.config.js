const path = require("path");
const fs = require("fs");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const webpack = require("webpack");
// const FaviconsWebpackPlugin = require("favicons-webpack-plugin");
// const FileManagerPlugin = require("filemanager-webpack-plugin");

//ENVIRONMENT MODE
let mode = "development";
if (process.env.NODE_ENV === "production") {
  mode = "production";
}

//ENV VARS CONFIG
let ENV_VARS = {
  ENV_BUILDMODE: "development",
  ENV_BRAND: "brand-one",
};

Object.entries(process.env).forEach(([key, value]) => {
  if (key.indexOf("ENV_") === 0) {
    ENV_VARS[key] = value;
  }
});

//SASS BRAND DATA ENV VARS
const SASS_BRAND_DATA = `@import "${process.env.ENV_SASS_PATH}";$brandname:${process.env.ENV_BRAND};`;

//HTML WEBPACK PLUGIN SETUP
let htmlWebpackPages = null;
let htmlPageNames = [];
let pagesPath = "./src/pages/";
fs.readdirSync(pagesPath).forEach((file) => {
  if (file.indexOf(".nunjucks") > -1) {
    htmlPageNames.push(file.split(".nunjucks")[0]);
  }

  htmlWebpackPages = htmlPageNames.map((fileName) => {
    return new HtmlWebpackPlugin({
      template: `./src/pages/${fileName}.nunjucks`,
      filename: `${process.env.ENV_BRAND}/pages/${fileName}.html`,
      templateParameters: ENV_VARS,
    });
  });
});

//PLUGINS
const plugins = [
  new CleanWebpackPlugin(), //TODO:
  new MiniCssExtractPlugin({
    filename: `${process.env.ENV_BRAND}/assets/css/[name].css`,
  }),
  new webpack.DefinePlugin({
    "process.env.ENV_BRAND": JSON.stringify(process.env.ENV_BRAND),
    "process.env.ENV_VARS": JSON.stringify(ENV_VARS),
  }),
  new MiniCssExtractPlugin({
    filename: `${process.env.ENV_BRAND}/assets/css/[name].css`,
  }),
  // new FaviconsWebpackPlugin({}), //TODO:
  // new FileManagerPlugin({}), //TODO:
].concat(htmlWebpackPages);

module.exports = {
  mode: mode,
  output: {
    publicPath: "/",
    filename: `${process.env.ENV_BRAND}/assets/js/[name].js`,
    path: path.join(__dirname, "./build"),
    assetModuleFilename: `${process.env.ENV_BRAND}/assets`,
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.(njk|nunjucks)$/,
        use: [
          {
            loader: "simple-nunjucks-loader",
            options: {
              searchPaths: [
                path.join(__dirname, "./src/pages"),
                path.join(__dirname, "./src/templates"),
              ],
              assetsPaths: [
                path.join(__dirname, `${process.env.ENV_BRAND}/assets`),
              ],
            },
          },
        ],
      },
      {
        test: /\.(png|jpg|jpeg|svg|gif)$/i,
        type: "asset/resource", //inbuilt - no need for file-loader or url-loader in webpack 5
        generator: {
          filename: `${process.env.ENV_BRAND}/assets/img/[name][ext]`,
        },
      },
      {
        test: /\.(eot|ttf|woff|woff2|svg)$/i,
        type: "asset/resource", //inbuilt - no need for file-loader or url-loader in webpack 5
        generator: {
          filename: `${process.env.ENV_BRAND}/assets/fonts/[name][ext]`,
        },
      },
      {
        test: /\.scss|css$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: "css-loader",
            options: { sourceMap: true },
          },
          {
            loader: "resolve-url-loader",
            options: { sourceMap: true },
          },
          {
            loader: "postcss-loader",
            options: {
              sourceMap: true,
              postcssOptions: {
                plugins: [["postcss-preset-env"]],
              },
            },
          },
          {
            loader: "resolve-url-loader",
            options: { sourceMap: true },
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: true,
              additionalData: SASS_BRAND_DATA,
            },
          },
        ],
      },
      {
        test: /\.js|jsx|json$/,
        exclude: "/node_modules",
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
  plugins: plugins,
  resolve: {
    extensions: [".js", ".jsx", ".json"], //import statements support when omitting file extensions
  },
  devtool: "source-map", //do not show JS output jibba jabba code
  devServer: {
    static: {
      directory: `./build/${process.env.ENV_BRAND}/pages`,
      serveIndex: true,
    },
    hot: true, //HMR,
    open: true, //open browser
    port: process.env.PORT, //from env brand settings
    devMiddleware: {
      writeToDisk: true,
    },
  },
};
