var WebGhost = require('../lib/webghost.js');

var opts = {
  browser: "chrome",
  host: "10.68.84.213"
}

var wg = new WebGhost(opts);

wg.init()
  .windowHandleMaximize()
  .url("http://www.google.com/webhp?complete=1&hl=en")
  .setValue('input[name="q"]', "Cheese!")
  .submitForm("#tsf")
  .pause(2000)
  .getTitle(function (title) {
    console.log("Page title is: " + title);
    title.should.include('Cheese');
  })