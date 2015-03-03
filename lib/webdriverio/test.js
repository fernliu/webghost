var webdriverio = require("./index");

webdriverio
    .remote({
        host: 'ondemand.saucelabs.com',
        port: 80,
        user: 'webdriverio',
        key: '6b96a3b4-742f-4b24-9b47-98653543c479',
        desiredCapabilities: {
            browserName: 'internet explorer',
            platform: 'Windows 8',
            version: 10
        }
    })
    .init()
    .windowHandleSize({width: 2000, height: 3000})
    .url('http://webdriverjs.christian-bromann.com')
    .saveScreenshot('haha.png')
    .end()