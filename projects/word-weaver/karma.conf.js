// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  const isSingleRun = config.singleRun;
  config.set({
    basePath: "",
    frameworks: ["jasmine", "@angular-devkit/build-angular"],
    plugins: [
      require("karma-jasmine"),
      require("karma-chrome-launcher"),
      require("karma-jasmine-html-reporter"),
      require("karma-spec-reporter"),
      require("karma-coverage-istanbul-reporter"),
      require("@angular-devkit/build-angular/plugins/karma"),
    ],
    client: {
      captureConsole: true,
      jasmine: {
        random: false,
      },
      clearContext: true, // leave Jasmine Spec Runner output visible in browser
    },
    coverageIstanbulReporter: {
      dir: require("path").join(__dirname, "../../coverage/word-weaver"),
      reports: ["html", "lcovonly", "text-summary"],
      fixWebpackSourcePaths: true,
    },
    reporters: ["spec", "coverage-istanbul"],
    port: 9876,
    colors: true,
    logLevel: config.DEBUG,
    autoWatch: true,
    usePolling: true,
    browsers: ["Chrome"],
    restartOnFileChange: true,
    customLaunchers: {
      ChromeTravisCi: {
        base: "Chrome",
        flags: ["--no-sandbox"],
      },
    },
    browserNoActivityTimeout: 50000,
    singleRun: isSingleRun,
  });
};
