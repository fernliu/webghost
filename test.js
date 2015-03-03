//"use strict";

var WebGhost = require('./lib/webghost.js');

describe('Home', function () {
    var webghost;
    before(function () {
      webghost = new WebGhost( 
        {browser: "chrome", host: "10.68.84.213"});
      });

    after(function (done) {
      webghost.end(done);
      });

    it('should search "Cheese" success', function (done) {
      webghost.init()
      .url("http://www.google.com/webhp?complete=1&hl=en")
      .setValue('input[name="q"]', "Cheese!")
      .submitForm("#tsf")
      .pause(2000)
      .getTitle(function (title) {
        console.log("Page title is: " + title);
        title.should.include('Cheese');
        })
      .done(done);
      });

    it('Done should be ok', function (done) {
        var count = 0;
        webghost.done(function () {
          count++;
          });
        count.should.be.equal(1);
        done();
        });
});


// var WebGhost = require('./lib/webghost.js');

// var opts = {
//   browser: "chrome",
//   host: "10.68.84.213"
// }

// var wg = new WebGhost(opts);

// wg.init()
//   .windowHandleMaximize()
//   .url("http://www.google.com/webhp?complete=1&hl=en")
//   .setValue('input[name="q"]', "Cheese!")
//   .submitForm("#tsf")
//   .pause(2000)
//   .getTitle(function (title) {
//     console.log("Page title is: " + title);
//     title.should.include('Cheese');
//   })