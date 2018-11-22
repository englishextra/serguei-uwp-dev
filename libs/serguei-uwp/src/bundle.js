/*global AdaptiveCards, console, debounce, doesFontExist, getHTTP, isElectron,
isNwjs, loadJsCss, Macy, openDeviceBrowser, parseLink, require, throttle*/
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
 * debounce
 */
(function (root) {
	"use strict";
	var debounce = function (func, wait) {
		var timeout;
		var args;
		var context;
		var timestamp;
		return function () {
			context = this;
			args = [].slice.call(arguments, 0);
			timestamp = new Date();
			var later = function () {
				var last = (new Date()) - timestamp;
				if (last < wait) {
					timeout = setTimeout(later, wait - last);
				} else {
					timeout = null;
					func.apply(context, args);
				}
			};
			if (!timeout) {
				timeout = setTimeout(later, wait);
			}
		};
	};
	root.debounce = debounce;
})("undefined" !== typeof window ? window : this);
/*!
 *
 */
(function (root) {
	"use strict";
	var isNodejs = "undefined" !== typeof process && "undefined" !== typeof require || "";
	var isElectron = "undefined" !== typeof root && root.process && "renderer" === root.process.type || "";
	var isNwjs = (function () {
		if ("undefined" !== typeof isNodejs && isNodejs) {
			try {
				if ("undefined" !== typeof require("nw.gui")) {
					return true;
				}
			} catch (e) {
				return false;
			}
		}
		return false;
	})();
	root.isNodejs = isNodejs;
	root.isElectron = isElectron;
	root.isNwjs = isNwjs;
})("undefined" !== typeof window ? window : this);
/*!
 * openDeviceBrowser
 */
(function (root) {
	"use strict";
	var openDeviceBrowser = function (url) {
		var triggerForElectron = function () {
			var es = isElectron ? require("electron").shell : "";
			return es ? es.openExternal(url) : "";
		};
		var triggerForNwjs = function () {
			var ns = isNwjs ? require("nw.gui").Shell : "";
			return ns ? ns.openExternal(url) : "";
		};
		var triggerForHTTP = function () {
			return true;
		};
		var triggerForLocal = function () {
			return root.open(url, "_system", "scrollbars=1,location=no");
		};
		if (isElectron) {
			triggerForElectron();
		} else if (isNwjs) {
			triggerForNwjs();
		} else {
			var locationProtocol = root.location.protocol || "",
			hasHTTP = locationProtocol ? "http:" === locationProtocol ? "http" : "https:" === locationProtocol ? "https" : "" : "";
			if (hasHTTP) {
				triggerForHTTP();
			} else {
				triggerForLocal();
			}
		}
	};
	root.openDeviceBrowser = openDeviceBrowser;
})("undefined" !== typeof window ? window : this);
/*!
 * getHTTP
 */
(function (root) {
	"use strict";
	var getHTTP = function (force) {
		var any = force || "";
		var locationProtocol = root.location.protocol || "";
		return "http:" === locationProtocol ? "http" : "https:" === locationProtocol ? "https" : any ? "http" : "";
	};
	root.getHTTP = getHTTP;
})("undefined" !== typeof window ? window : this);
/*!
 * parseLink
 */
(function (root, document) {
	"use strict";
	/*jshint bitwise: false */
	var createElement = "createElement";
	var parseLink = function (url, full) {
		var _full = full || "";
		return (function () {
			var _replace = function (s) {
				return s.replace(/^(#|\?)/, "").replace(/\:$/, "");
			};
			var _location = location || "";
			var _protocol = function (protocol) {
				switch (protocol) {
				case "http:":
					return _full ? ":" + 80 : 80;
				case "https:":
					return _full ? ":" + 443 : 443;
				default:
					return _full ? ":" + _location.port : _location.port;
				}
			};
			var _isAbsolute = (0 === url.indexOf("//") || !!~url.indexOf("://"));
			var _locationHref = root.location || "";
			var _origin = function () {
				var o = _locationHref.protocol + "//" + _locationHref.hostname + (_locationHref.port ? ":" + _locationHref.port : "");
				return o || "";
			};
			var _isCrossDomain = function () {
				var c = document[createElement]("a");
				c.href = url;
				var v = c.protocol + "//" + c.hostname + (c.port ? ":" + c.port : "");
				return v !== _origin();
			};
			var _link = document[createElement]("a");
			_link.href = url;
			return {
				href: _link.href,
				origin: _origin(),
				host: _link.host || _location.host,
				port: ("0" === _link.port || "" === _link.port) ? _protocol(_link.protocol) : (_full ? _link.port : _replace(_link.port)),
				hash: _full ? _link.hash : _replace(_link.hash),
				hostname: _link.hostname || _location.hostname,
				pathname: _link.pathname.charAt(0) !== "/" ? (_full ? "/" + _link.pathname : _link.pathname) : (_full ? _link.pathname : _link.pathname.slice(1)),
				protocol: !_link.protocol || ":" === _link.protocol ? (_full ? _location.protocol : _replace(_location.protocol)) : (_full ? _link.protocol : _replace(_link.protocol)),
				search: _full ? _link.search : _replace(_link.search),
				query: _full ? _link.search : _replace(_link.search),
				isAbsolute: _isAbsolute,
				isRelative: !_isAbsolute,
				isCrossDomain: _isCrossDomain(),
				hasHTTP: (/^(http|https):\/\//i).test(url) ? true : false
			};
		})();
	};
	/*jshint bitwise: true */
	root.parseLink = parseLink;
})("undefined" !== typeof window ? window : this, document);
/*!
 * manageExternalLinkAll
 */
(function (root, document) {
	"use strict";
	var classList = "classList";
	var getAttribute = "getAttribute";
	var getElementsByTagName = "getElementsByTagName";
	var _addEventListener = "addEventListener";
	var _length = "length";
	var manageExternalLinkAll = function (scope) {
		var ctx = scope && scope.nodeName ? scope : "";
		var linkTag = "a";
		var linkAll = ctx ? ctx[getElementsByTagName](linkTag) || "" : document[getElementsByTagName](linkTag) || "";
		var handleExternalLink = function (url, ev) {
			ev.stopPropagation();
			ev.preventDefault();
			var logicHandleExternalLink = openDeviceBrowser.bind(null, url);
			var debounceLogicHandleExternalLink = debounce(logicHandleExternalLink, 200);
			debounceLogicHandleExternalLink();
		};
		var arrange = function (e) {
			var isBindedExternalLinkClass = "is-binded-external-link";
			if (!e[classList].contains(isBindedExternalLinkClass)) {
				var url = e[getAttribute]("href") || "";
				if (url && parseLink(url).isCrossDomain && parseLink(url).hasHTTP) {
					e.title = "" + (parseLink(url).hostname || "") + " откроется в новой вкладке";
					if ("undefined" !== typeof getHTTP && getHTTP()) {
						e.target = "_blank";
						e.rel = "noopener";
					} else {
						e[_addEventListener]("click", handleExternalLink.bind(null, url));
					}
					e[classList].add(isBindedExternalLinkClass);
				}
			}
		};
		if (linkAll) {
			var i,
			l;
			for (i = 0, l = linkAll[_length]; i < l; i += 1) {
				arrange(linkAll[i]);
			}
			i = l = null;
		}
	};
	root.manageExternalLinkAll = manageExternalLinkAll;
})("undefined" !== typeof window ? window : this, document);
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
 * AdaptiveCards
 */
(function (root) {
	"use strict";
	var appendChild = "appendChild";
	var renderAdaptiveCard = function (acGrid, cardObj, renderOptions, onExecute, callback) {
		if (root.AdaptiveCards && acGrid) {
			var adaptiveCard = new AdaptiveCards.AdaptiveCard();
			adaptiveCard.hostConfig = new AdaptiveCards.HostConfig(renderOptions);
			adaptiveCard.onExecuteAction = onExecute;
			adaptiveCard.parse(cardObj);
			var renderedCard = adaptiveCard.render();
			acGrid[appendChild](renderedCard);
			if ("function" === typeof callback) {
				callback();
			}
			adaptiveCard = renderedCard = null;
		}
	};
	root.renderAdaptiveCard = renderAdaptiveCard;
})("undefined" !== typeof window ? window : this);
/*!
 * UWP layout
 */
(function (root) {
	"use strict";

	root.layoutTypeToTabs = function (event) {
		event.preventDefault();
		Array.prototype.slice.call(document.querySelectorAll("main section button")).forEach(function (el) {
			return (el.disabled = false);
		});
		event.target.disabled = true;
		document.body.setAttribute("data-layout-type", "tabs");
	};

	root.layoutTypeToOverlay = function (event) {
		event.preventDefault();
		Array.prototype.slice.call(document.querySelectorAll("main section button")).forEach(function (el) {
			return (el.disabled = false);
		});
		event.target.disabled = true;
		document.body.setAttribute("data-layout-type", "overlay");
	};

	root.layoutTypeToDockedMinimized = function (event) {
		event.preventDefault();
		Array.prototype.slice.call(document.querySelectorAll("main section button")).forEach(function (el) {
			return (el.disabled = false);
		});
		event.target.disabled = true;
		document.body.setAttribute("data-layout-type", "docked-minimized");
	};

	root.layoutTypeToDocked = function (event) {
		event.preventDefault();
		Array.prototype.slice.call(document.querySelectorAll("main section button")).forEach(function (el) {
			return (el.disabled = false);
		});
		event.target.disabled = true;
		document.body.setAttribute("data-layout-type", "docked");
	};
})("undefined" !== typeof window ? window : this);
/*!
 * app logic
 */
(function (root, document) {
	"use strict";

	var docElem = document.documentElement || "";

	var classList = "classList";
	var createElement = "createElement";
	var createElementNS = "createElementNS";
	var defineProperty = "defineProperty";
	var getOwnPropertyDescriptor = "getOwnPropertyDescriptor";
	var querySelector = "querySelector";
	var querySelectorAll = "querySelectorAll";
	var _addEventListener = "addEventListener";

	docElem[classList].add("no-js");

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

	/* var scripts = [
	"../../fonts/roboto-fontfacekit/2.137/css/roboto.css",
	"../../fonts/roboto-mono-fontfacekit/2.0.986/css/roboto-mono.css",
	"../../cdn/uwp-web-framework/2.0/css/uwp.style.fixed.css"
	]; */

	var scripts = [
		/* "./libs/serguei-uwp/css/vendors.min.css", */
		"./libs/serguei-uwp/css/bundle.min.css"
	];

	var supportsPassive = (function () {
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
	})();

	var needsPolyfills = (function () {
		return !String.prototype.startsWith ||
		!supportsPassive ||
		!root.requestAnimationFrame ||
		!root.matchMedia ||
		("undefined" === typeof root.Element && !("dataset" in docElem)) ||
		!("classList" in document[createElement]("_")) ||
		document[createElementNS] && !("classList" in document[createElementNS]("http://www.w3.org/2000/svg", "g")) ||
		/* !document.importNode || */
		/* !("content" in document[createElement]("template")) || */
		(root.attachEvent && !root[_addEventListener]) ||
		!("onhashchange" in root) ||
		!Array.prototype.indexOf ||
		!root.Promise ||
		!root.fetch ||
		!document[querySelectorAll] ||
		!document[querySelector] ||
		!Function.prototype.bind ||
		(Object[defineProperty] &&
			Object[getOwnPropertyDescriptor] &&
			Object[getOwnPropertyDescriptor](Element.prototype, "textContent") &&
			!Object[getOwnPropertyDescriptor](Element.prototype, "textContent").get) ||
		!("undefined" !== typeof root.localStorage && "undefined" !== typeof root.sessionStorage) ||
		!root.WeakMap ||
		!root.MutationObserver;
	})();

	if (needsPolyfills) {
		scripts.push("./cdn/polyfills/js/polyfills.fixed.min.js");
	}

	/* var scripts = [
	"../../cdn/imagesloaded/4.1.4/js/imagesloaded.pkgd.fixed.js",
	"../../cdn/uwp-web-framework/2.0/js/uwp.core.fixed.js",
	"./node_modules/any-resize-event/dist/any-resize-event.js",
	"./node_modules/adaptivecards/dist/adaptivecards.js",
	"./node_modules/macy/dist/macy.js"
	]; */

	scripts.push("./libs/serguei-uwp/js/vendors.min.js");

	/*!
	 * load scripts after webfonts loaded using doesFontExist
	 */

	var supportsCanvas;
	supportsCanvas = (function () {
		var elem = document[createElement]("canvas");
		return !!(elem.getContext && elem.getContext("2d"));
	})();

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
						"./libs/serguei-uwp/css/vendors.min.css"
					],
					onFontsLoadedCallback);
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