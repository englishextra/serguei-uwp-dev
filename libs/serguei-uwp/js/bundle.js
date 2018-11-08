/*global console, doesFontExist, loadJsCss, Macy, throttle */
/*!
 * modified loadExt
 * @see {@link https://gist.github.com/englishextra/ff9dc7ab002312568742861cb80865c9}
 * passes jshint
 */
(function (root, document) {
	"use strict";

	var loadJsCss = function (files, callback) {
		var _this = this;
		var appendChild = "appendChild";
		var body = "body";
		var createElement = "createElement";
		var getElementsByTagName = "getElementsByTagName";
		/* var insertBefore = "insertBefore"; */
		var _length = "length";
		/* var parentNode = "parentNode"; */
		var setAttribute = "setAttribute";
		_this.files = files;
		_this.js = [];
		_this.head = document[getElementsByTagName]("head")[0] || "";
		_this.body = document[body] || "";
		_this.ref = document[getElementsByTagName]("script")[0] || "";
		_this.callback = callback || function () {};
		_this.loadStyle = function (file) {
			var link = document[createElement]("link");
			link.rel = "stylesheet";
			link.type = "text/css";
			link.href = file;
			/* _this.head[appendChild](link); */
			link.media = "only x";
			link.onload = function () {
				this.onload = null;
				this.media = "all";
			};
			link[setAttribute]("property", "stylesheet");
			(_this.body || _this.head)[appendChild](link);
		};
		_this.loadScript = function (i) {
			var script = document[createElement]("script");
			script.type = "text/javascript";
			script.async = true;
			script.src = _this.js[i];
			var loadNextScript = function () {
				if (++i < _this.js[_length]) {
					_this.loadScript(i);
				} else {
					_this.callback();
				}
			};
			script.onload = function () {
				loadNextScript();
			};
			_this.head[appendChild](script);
			/* if (_this.ref[parentNode]) {
   _this.ref[parentNode][insertBefore](script, _this.ref);
   } else {
   (_this.body || _this.head)[appendChild](script);
   } */
			(_this.body || _this.head)[appendChild](script);
		};
		var i, l;
		for (i = 0, l = _this.files[_length]; i < l; i += 1) {
			if (/\.js$|\.js\?/.test(_this.files[i])) {
				_this.js.push(_this.files[i]);
			}
			if (/\.css$|\.css\?|\/css\?/.test(_this.files[i])) {
				_this.loadStyle(_this.files[i]);
			}
		}
		i = l = null;
		if (_this.js[_length] > 0) {
			_this.loadScript(0);
		} else {
			_this.callback();
		}
	};
	root.loadJsCss = loadJsCss;
})("undefined" !== typeof window ? window : this, document);
/*!
 * throttle
 */
(function (root) {
	"use strict";

	var throttle = function (func, wait) {
		var ctx;
		var args;
		var rtn;
		var timeoutID;
		var last = 0;
		function call() {
			timeoutID = 0;
			last = +new Date();
			rtn = func.apply(ctx, args);
			ctx = null;
			args = null;
		}
		return function throttled() {
			ctx = this;
			args = arguments;
			var delta = new Date() - last;
			if (!timeoutID) {
				if (delta >= wait) {
					call();
				} else {
					timeoutID = setTimeout(call, wait - delta);
				}
			}
			return rtn;
		};
	};
	root.throttle = throttle;
})("undefined" !== typeof window ? window : this);
/*!
 * Macy
 */
(function (root) {
	"use strict";

	var classList = "classList";
	var getElementsByClassName = "getElementsByClassName";
	var isActiveClass = "is-active";
	var macy;
	var updateMacy = function (delay) {
		var timeout = delay || 100;
		var logThis;
		logThis = function () {
			console.log("updateMacy");
		};
		if (macy) {
			var timer = setTimeout(function () {
				clearTimeout(timer);
				timer = null;
				logThis();
				macy.recalculate(true, true);
			}, timeout);
		}
	};
	var updateMacyThrottled = throttle(updateMacy, 2000);
	/* var macyContainerClass = "ac-grid"; */
	var initMacy = function (macyContainerClass, options) {
		var defaultSettings = {
			/* container: ".macy-container", */
			trueOrder: false,
			waitForImages: false,
			margin: 0,
			columns: 5,
			breakAt: {
				1280: 5,
				1024: 4,
				960: 3,
				640: 2,
				480: 2,
				360: 1
			}
		};
		var settings = options || {};
		settings.container = "." + macyContainerClass;
		var opt;
		for (opt in defaultSettings) {
			if (defaultSettings.hasOwnProperty(opt) && !settings.hasOwnProperty(opt)) {
				settings[opt] = defaultSettings[opt];
			}
		}
		opt = null;
		var macyContainer = document[getElementsByClassName](macyContainerClass)[0] || "";
		if (macyContainer) {
			try {
				if (macy) {
					macy.remove();
				}
				macy = new Macy(settings);
				macyContainer[classList].add(isActiveClass);
			} catch (err) {
				throw new Error("cannot init Macy " + err);
			}
		}
	};
	var manageMacy = function (macyContainerClass, options) {
		var macyContainer = document[getElementsByClassName](macyContainerClass)[0] || "";
		var handleMacyContainer = function () {
			if (!macyContainer[classList].contains(isActiveClass)) {
				initMacy(macyContainerClass, options);
			}
		};
		if (root.Macy && macyContainer) {
			handleMacyContainer();
		}
	};
	root.updateMacyThrottled = updateMacyThrottled;
	root.manageMacy = manageMacy;
})("undefined" !== typeof window ? window : this);
/*!
 * UWP layout
 */
(function (root) {
	"use strict";

	root.layoutTypeToTabs = function (event) {
		event.preventDefault();
		Array.prototype.slice.call(document.querySelectorAll("main section button")).forEach(function (el) {
			return el.disabled = false;
		});
		event.target.disabled = true;
		document.body.setAttribute("data-layouttype", "tabs");
	};

	root.layoutTypeToOverlay = function (event) {
		event.preventDefault();
		Array.prototype.slice.call(document.querySelectorAll("main section button")).forEach(function (el) {
			return el.disabled = false;
		});
		event.target.disabled = true;
		document.body.setAttribute("data-layouttype", "overlay");
	};

	root.layoutTypeToDockedMinimized = function (event) {
		event.preventDefault();
		Array.prototype.slice.call(document.querySelectorAll("main section button")).forEach(function (el) {
			return el.disabled = false;
		});
		event.target.disabled = true;
		document.body.setAttribute("data-layouttype", "docked-minimized");
	};

	root.layoutTypeToDocked = function (event) {
		event.preventDefault();
		Array.prototype.slice.call(document.querySelectorAll("main section button")).forEach(function (el) {
			return el.disabled = false;
		});
		event.target.disabled = true;
		document.body.setAttribute("data-layouttype", "docked");
	};
})("undefined" !== typeof window ? window : this);
/*!
 * app logic
 */
(function (root, document) {
	"use strict";

	var docElem = document.documentElement || "";
	var docBody = document.body || "";

	var classList = "classList";
	var createElement = "createElement";
	var createElementNS = "createElementNS";
	var defineProperty = "defineProperty";
	var getOwnPropertyDescriptor = "getOwnPropertyDescriptor";
	var querySelector = "querySelector";
	var querySelectorAll = "querySelectorAll";
	var _addEventListener = "addEventListener";
	docBody[classList].add("hide-sidedrawer");

	var run = function () {

		if (root.UWP) {
			root.UWP.init({
				pageTitle: "UWP web framework",
				layoutType: "docked-minimized",
				activeColor: "#26c6da",
				mainColor: "#373737",
				mainColorDarkened: "#0097a7",
				includes: "./includes/serguei-uwp",
				includeScript: "./libs/serguei-uwp/js/include-script",
				includeStyle: "./libs/serguei-uwp/css/include-style",
				navContainer: "nav-container",
				home: "home",
				hashNavKey: "page"
			});
		}
		var switchLayoutType = function (x) {
			if (x.matches) {
				// If media query matches
				document.body.dataset.layouttype = "overlay";
			} else {
				document.body.dataset.layouttype = "docked-minimized";
			}
		};
		var layoutTypeTreshold = root.matchMedia("(max-width: 360px)");
		switchLayoutType(layoutTypeTreshold); // Call listener function at run time
		layoutTypeTreshold.addListener(switchLayoutType); // Attach listener function on state changes
	};

	/* var scripts = [
 			"../../cdn/uwp-web-framework/2.0/css/uwp.style.fixed.css",
 			"../../fonts/roboto-fontfacekit/2.137/css/roboto.css",
 			"../../fonts/roboto-mono-fontfacekit/2.0.986/css/roboto-mono.css"
 ]; */

	var scripts = [
	/* "./libs/serguei-uwp/css/vendors.min.css", */
	"./libs/serguei-uwp/css/bundle.min.css"];

	var supportsPassive = function () {
		var support = false;
		try {
			var opts = Object[defineProperty] && Object[defineProperty]({}, "passive", {
				get: function () {
					support = true;
				}
			});
			root[_addEventListener]("test", function () {}, opts);
		} catch (err) {}
		return support;
	}();

	var needsPolyfills = function () {
		return !String.prototype.startsWith || !supportsPassive || !root.requestAnimationFrame || !root.matchMedia || "undefined" === typeof root.Element && !("dataset" in docElem) || !("classList" in document[createElement]("_")) || document[createElementNS] && !("classList" in document[createElementNS]("http://www.w3.org/2000/svg", "g")) ||
		/* !document.importNode || */
		/* !("content" in document[createElement]("template")) || */
		root.attachEvent && !root[_addEventListener] || !("onhashchange" in root) || !Array.prototype.indexOf || !root.Promise || !root.fetch || !document[querySelectorAll] || !document[querySelector] || !Function.prototype.bind || Object[defineProperty] && Object[getOwnPropertyDescriptor] && Object[getOwnPropertyDescriptor](Element.prototype, "textContent") && !Object[getOwnPropertyDescriptor](Element.prototype, "textContent").get || !("undefined" !== typeof root.localStorage && "undefined" !== typeof root.sessionStorage) || !root.WeakMap || !root.MutationObserver;
	}();

	if (needsPolyfills) {
		scripts.push("./cdn/polyfills/js/polyfills.fixed.min.js");
	}

	/* var scripts = [
 			"../../cdn/imagesloaded/4.1.4/js/imagesloaded.fixed.js",
 			"../../cdn/uwp-web-framework/2.0/js/uwp.core.fixed.js",
 			"./node_modules/adaptivecards/dist/adaptivecards.js",
 			"./node_modules/macy/dist/macy.js"
 ]; */

	scripts.push("./libs/serguei-uwp/js/vendors.min.js");

	/*!
  * load scripts after webfonts loaded using doesFontExist
  */

	var supportsCanvas;
	supportsCanvas = function () {
		var elem = document[createElement]("canvas");
		return !!(elem.getContext && elem.getContext("2d"));
	}();

	var onFontsLoadedCallback = function () {

		var slot;

		var onFontsLoaded = function () {
			if (slot) {
				clearInterval(slot);
				slot = null;
			}

			/* progressBar.increase(20); */

			var load;
			load = new loadJsCss(scripts, run);
		};

		var checkFontIsLoaded;
		checkFontIsLoaded = function () {
			/*!
    * check only for fonts that are used in current page
    */
			if (doesFontExist("Roboto") /* && doesFontExist("Roboto Mono") */) {
					onFontsLoaded();
				}
		};

		/* if (supportsCanvas) {
  	slot = setInterval(checkFontIsLoaded, 100);
  } else {
  	slot = null;
  	onFontsLoaded();
  } */
		onFontsLoaded();
	};

	var loadDeferred = function () {
		var timer;
		var logic = function () {
			clearTimeout(timer);
			timer = null;
			var load;
			load = new loadJsCss([
			/* forcedHTTP + "://fonts.googleapis.com/css?family=Roboto+Mono%7CRoboto:300,400,500,700&subset=cyrillic,latin-ext", */
			"./libs/serguei-uwp/css/vendors.min.css"], onFontsLoadedCallback);
		};
		var req;
		var raf = function () {
			cancelAnimationFrame(req);
			timer = setTimeout(logic, 0);
		};
		if (root.requestAnimationFrame) {
			req = requestAnimationFrame(raf);
		} else {
			root[_addEventListener]("load", logic);
		}
	};
	loadDeferred();

	/*!
  * load scripts after webfonts loaded using webfontloader
  */

	/* root.WebFontConfig = {
 	google: {
 		families: [
 			"Roboto:300,400,500,700:cyrillic",
 			"Roboto Mono:400:cyrillic,latin-ext"
 		]
 	},
 	listeners: [],
 	active: function () {
 		this.called_ready = true;
 		var i;
 		for (i = 0; i < this.listeners[_length]; i++) {
 			this.listeners[i]();
 		}
 		i = null;
 	},
 	ready: function (callback) {
 		if (this.called_ready) {
 			callback();
 		} else {
 			this.listeners.push(callback);
 		}
 	}
 };
 	var onFontsLoadedCallback = function () {
 		var onFontsLoaded = function () {
 		progressBar.increase(20);
 			var load;
 		load = new loadJsCss(scripts, run);
 	};
 		root.WebFontConfig.ready(onFontsLoaded);
 };
 	var load;
 load = new loadJsCss(
 		[forcedHTTP + "://cdn.jsdelivr.net/npm/webfontloader@1.6.28/webfontloader.min.js"],
 		onFontsLoadedCallback
 	); */
})("undefined" !== typeof window ? window : this, document);

//# sourceMappingURL=bundle.js.map