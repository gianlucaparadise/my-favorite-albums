require("dotenv").config();

const debugFilter = require("./src/_filters/debug");
const extractLogoLabelFilter = require("./src/_filters/extractLogoLabel");
const selectedWhenEqualsToFilter = require("./src/_filters/selectedWhenEqualsTo");

const fetchCmsAlbums = require("./src/dataFetchers/cmsAlbums");
const fetchTopMenuItems = require("./src/dataFetchers/topMenuItems");

module.exports = function (eleventyConfig) {
  // Output directory: _site

  eleventyConfig.addPassthroughCopy({ "src/_includes/css": "css" });

  eleventyConfig.addGlobalData("cmsAlbums", fetchCmsAlbums);
  eleventyConfig.addGlobalData("topMenuItems", () =>
    fetchTopMenuItems(eleventyConfig)
  );

  eleventyConfig.addFilter("debug", debugFilter);
  eleventyConfig.addFilter("extractLogoLabel", extractLogoLabelFilter);
  eleventyConfig.addFilter("selectedWhenEqualsTo", selectedWhenEqualsToFilter);
};
