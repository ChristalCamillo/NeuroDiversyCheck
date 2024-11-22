module.exports = function (eleventyConfig) {
    eleventyConfig.addPassthroughCopy({ "src/*.js": "/" });
    eleventyConfig.addPassthroughCopy({ "src/*.json": "/" });

    return {
        dir: { input: "src", output: "_site", data: "_data" },
    };
};  