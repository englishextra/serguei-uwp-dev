/*global console, loadJsCss, Macy, throttle */
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
		var i,
		l;
		for (i = 0, l = _this.files[_length]; i < l; i += 1) {
			if ((/\.js$|\.js\?/).test(_this.files[i])) {
				_this.js.push(_this.files[i]);
			}
			if ((/\.css$|\.css\?|\/css\?/).test(_this.files[i])) {
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
 * app logic
 */
(function (root, document) {
	"use strict";

	root.layoutTypeToTabs = function (event) {
		event.preventDefault();
		Array.prototype.slice.call(document.querySelectorAll("main section button")).forEach(function (el) {
			return (el.disabled = false);
		});
		event.target.disabled = true;
		document.body.setAttribute("data-layouttype", "tabs");
	};

	root.layoutTypeToOverlay = function (event) {
		event.preventDefault();
		Array.prototype.slice.call(document.querySelectorAll("main section button")).forEach(function (el) {
			return (el.disabled = false);
		});
		event.target.disabled = true;
		document.body.setAttribute("data-layouttype", "overlay");
	};

	root.layoutTypeToDockedMinimized = function (event) {
		event.preventDefault();
		Array.prototype.slice.call(document.querySelectorAll("main section button")).forEach(function (el) {
			return (el.disabled = false);
		});
		event.target.disabled = true;
		document.body.setAttribute("data-layouttype", "docked-minimized");
	};

	root.layoutTypeToDocked = function (event) {
		event.preventDefault();
		Array.prototype.slice.call(document.querySelectorAll("main section button")).forEach(function (el) {
			return (el.disabled = false);
		});
		event.target.disabled = true;
		document.body.setAttribute("data-layouttype", "docked");
	};

	var init = function () {

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
				home: "home"
			});
		}
		var switchLayoutType = function (x) {
			if (x.matches) { // If media query matches
				document.body.dataset.layouttype = "overlay";
			} else {
				document.body.dataset.layouttype = "docked-minimized";
			}
		};
		var layoutTypeTreshold = root.matchMedia("(max-width: 360px)");
		switchLayoutType(layoutTypeTreshold); // Call listener function at run time
		layoutTypeTreshold.addListener(switchLayoutType); // Attach listener function on state changes

	};

	var scripts = [
		"./cdn/polyfills/js/polyfills.fixed.min.js",
		"./libs/serguei-uwp/js/vendors.min.js",
		"./libs/serguei-uwp/css/vendors.min.css",
		"./libs/serguei-uwp/css/bundle.min.css"
		];

	var load;
	load = new loadJsCss(scripts, init);

})("undefined" !== typeof window ? window : this, document);
