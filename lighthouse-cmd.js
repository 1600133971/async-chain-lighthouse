const lighthouse = require('lighthouse');
const launcher = require('chrome-launcher');
const fs = require("fs");

class LightHouseCmd {
  constructor (chromeFlags, opts, config) {
    this.result = null;
    this.chrome = null;

    this.chromeFlags = (chromeFlags != undefined) ? chromeFlags : [
      '--headless',
      "--ignore-certificate-errors",
    ];

    this.opts = (opts != undefined) ? opts : {
      logLevel: "info",
    };

    this.config = (config != undefined) ? config : {
      extends: 'lighthouse:default',
      settings: {
        output: 'html',
        locale: 'zh',
        emulatedFormFactor: 'desktop',
        onlyCategories: [
          'performance',
          'best-practices',
          'accessibility',
          'pwa',
          'seo'
        ],
        skipAudits: [
          'uses-http2'
        ]
      }
    };
  }

  async launch (startingUrl, chromeFlags) {
    this.chrome = await launcher.launch({
      startingUrl,
      chromeFlags: (chromeFlags != undefined) ? chromeFlags : this.chromeFlags
    });
  }

  async lighthouse (url, opts, config) {
    if (opts != undefined) this.opts = opts;
    this.opts.port = this.chrome.port;
    const result = await lighthouse(
      url,
      this.opts,
      (config != undefined) ? config : this.config
    );
    this.result = result;
  }

  async reportToFile (dest) {
    await fs.writeFile(dest, this.result.report, (err) => {
      if (err) { console.log(err); }
      else { console.log("Analysis saved to " + dest) }
    });
  }

  async kill () {
    await this.chrome.process.kill();
  }
}

module.exports = LightHouseCmd;
