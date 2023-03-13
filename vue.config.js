//const { defineConfig } = require("@vue/cli-service");
const { GenerateSW } = require("workbox-webpack-plugin");

module.exports = {
  transpileDependencies: ["vuetify"],
  lintOnSave: false,
  //publicPath: process.env.NODE_ENV === "development" ? "/vuejs-pwa/" : "",

  configureWebpack: {
    plugins: [new GenerateSW()]
  }
};
