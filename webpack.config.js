import TerserPlugin from "terser-webpack-plugin";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const entry = {
  //js
  index: "./src/js/index.js",
};

export default {
  entry,
  output: {
    path: path.resolve(__dirname, "public/js"),
    filename: "[name].min.js",
    chunkFilename: "[name].min.js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            //los presets en una configuracion predeterminad, en este caso para compilar ES2015+
            //https://babeljs.io/docs/presets
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".js", ".ts"],
    modules: [path.resolve(__dirname, "src"), "node_modules"],
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        extractComments: true,
        terserOptions: {
          output: {
            comments: false,
          },
        },
      }),
    ],
  },
  devtool: "source-map",
  mode: "development",
};
