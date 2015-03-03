var webdriverio = require('./webdriverio/index.js')

var Page = function (opts) {
	var options = {};

	opts = opts || {};
	if(opts.browser) {
		opts.desiredCapabilities = {browserName: opts.browser};
		delete opts.browser;
	}

	for (var key in opts) {
		options[key] = opts[key];
	}
	console.log(options);
	var client = webdriverio.remote(options);
	return client;
}

var WebGhost = function (opts) {
	this.queue = [];
	this.scope = {};
	this.setPage(opts);
	this.started = false;
};

WebGhost.prototype.setPage = function (opts) {
	var page = new Page(opts);
	this.setContext(page);
};

WebGhost.prototype.setContext = function (value) {
	this.context = value;
	// API category: Action|Appium|Cookie|Mobile|Property|Protocol|State|Utility|Window
	var whitelist = [
		"addValue", "click", "doubleclick", "dragAndDrop", "leftClick", "middleClick", "moveToObject", "rightClick", "selectByIndex", "selectByValue", "selectByVisibleText", "selectorExecute", "selectorExecuteAsync", "setValue", "submitForm",
		"closeApp", 
		"deleteCookie", "getCookie", "setCookie",
		"flick","touch","hold",
		"getAttribute", "getCssProperty", "getElementSize", "getHTML", "getLocation", "getTagName", "getText", "getTitle", "getValue",
		"alertAccept", "alertDismiss", "alertText", "applicationCacheStatus", "back", "buttonDown", "buttonPress", "buttonUp", "cookie", "doDoubleClick", "element", "elementActive", "elementAttribute", "eleemntIdClear", "elementIdName", "elementIdSelected", "elements", "forward", "frame", "frameParent", "init", "localStorage", "location", "log", "logTypes", "moveTo", "refresh", "screenshot", "session", "sessionStorage", "sessions", "status", "submit", "timeouts","title", "touchClick", "url", "window", "windowHandle", "windowHandleMaximize", "windowHandlePosition", 
		"isEnabled", "isExisting", "isSelected", "isVisible",
		"call", "chooseFile", "end", "endAll", "pause", "saveScreenshot", "scroll", "uploadFile", "waitFor", "waitForChecked", "waitForEnabled", "waitForExist", "waitForSelected", "waitForText", "waitForValue", "waitForVisible",
		"close", "getCurrentTabId", "getTabIds", "getViewportSize", "newWindow", "setViewportSize", "switchTab"
	];

	for (var key in value) {
		if(whitelist.indexOf(key) !== -1) {
			this.set(key);
		}
	}
};

WebGhost.prototype.set = function (key) {
	this[key] = function () {
		var callback, args;
		if (typeof arguments[arguments.length - 1] !== "function") {
			args = [].slice.call(arguments, 0);
			callback = function() {};
		} else {
			args = [].slice.call(arguments, 0, -1);
			callback = arguments[arguments.length - 1];
		}
		this.use(key, args, callback);
		return this;
	}
};

WebGhost.prototype.use = function (method, args, callback) {
  var that = this;
  var realMethod = (typeof method === "string") ? that.context[method] : method;
  if (typeof realMethod !== "function") {
    throw new Error("Not a function");
  }
  if (typeof args === "function") {
    callback = args;
    args = [];
  }

  args.push(function () {
    callback.apply(that.context, arguments);
    // console.log(method + '执行完成，触发下一个任务');
    that.next();
  });

  // 放入队列中
  this.queue.push(function () {
    realMethod.apply(that.context, args);
  });

  // 启动
  if (!that.started) {
    that.started = true;
    that.next();
  }
  return this;
}

WebGhost.prototype.await = function (milliseconds, callback) {
  var that = this;
  callback = callback || function () {};
  that.queue.push(function () {
    // console.log("Waiting " + milliseconds + "ms.");
    setTimeout(function () {
      callback();
      // console.log("等待结束，触发下一个");
      that.next();
    }, milliseconds);
  });
  return this;
};

WebGhost.prototype.next = function () {
  var next = this.queue.shift();
  if (next) {
    next();
  }
};

WebGhost.prototype.done = function (callback) {
  var that = this;
  that.queue.push(function () {
    that.started = false;
    callback();
    // console.log("done结束，等待触发下一个");
  });
  console.log("done======");
  return that;
};

WebGhost.prototype.when = function (next) {
  var that = this;
  that.use(function (cb) {
    cb();
  }, next);
  return that;
};

module.exports = WebGhost;