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
        // you can add configuration options for Jasmine here
        // the possible options are listed at https://jasmine.github.io/api/edge/Configuration.html
        // for example, you can disable the random execution with `random: false`
        // or set a specific seed with `seed: 4321`
      },
      clearContext: false, // leave Jasmine Spec Runner output visible in browser
    },
    jasmineHtmlReporter: {
      suppressAll: true, // removes the duplicated traces
    },
    coverageIstanbulReporter: {
      dir: require("path").join(__dirname, "../../coverage/every-voice"),
      reports: ["html", "lcovonly", "text-summary"],
      fixWebpackSourcePaths: true,
    },
    reporters: ["spec", "coverage-istanbul"],
    port: 9876,
    colors: true,
    logLevel: config.NONE,
    autoWatch: true,
    usePolling: true,
    browsers: ["Chrome"],
    singleRun: isSingleRun,
    customLaunchers: {
      ChromeTravisCi: {
        base: "Chrome",
        flags: ["--no-sandbox"],
      },
    },
    browserNoActivityTimeout: 50000,
    restartOnFileChange: true,
  });
};
