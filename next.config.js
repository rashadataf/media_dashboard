const withPlugins = require("next-compose-plugins");
const withImages = require("next-images");
// const withImages = require("next-images");
// const withSass = require("@zeit/next-sass");
// const withCSS = require("@zeit/next-css");
// const webpack = require("webpack");
// const path = require("path");

module.exports = withPlugins([[withImages]], {
  images: {
    domains: ["localhost"],
  },
});
