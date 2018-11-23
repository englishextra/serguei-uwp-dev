/*jshint esnext: true */
/*jshint -W069 */
/*global define, module, Vimeo, YT, jwplayer */
(function (global, factory) {
	if (typeof define === "function" && define.amd) {
		define('GLightbox', ['module'], factory);
	} else if (typeof exports !== "undefined") {
		factory(module);
	} else {
		var mod = {
			exports: {}
		};
		factory(mod);
		global.GLightbox = mod.exports;
	}
})("undefined" !== typeof window ? window : this, function (module) {
	'use strict';
	/*jshint validthis: true */
	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) {
			throw new TypeError("Cannot call a class as a function");
		}
	}
	var _createClass = function () {
		function defineProperties(target, props) {
			for (var i = 0; i < props.length; i++) {
				var descriptor = props[i];
				descriptor.enumerable = descriptor.enumerable || false;
				descriptor.configurable = true;
				if ("value" in descriptor)
					descriptor.writable = true;
				Object.defineProperty(target, descriptor.key, descriptor);
			}
		}
		return function (Constructor, protoProps, staticProps) {
			if (protoProps)
				defineProperties(Constructor.prototype, protoProps);
			if (staticProps)
				defineProperties(Constructor, staticProps);
			return Constructor;
		};
	}
	();
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
		return typeof obj;
	}
	 : function (obj) {
		return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
	};
	/**
	 * GLightbox v1.0.8
	 * Awesome pure javascript lightbox
	 * made by mcstudios.com.mx
	 */
	var isMobile = navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(Android)|(PlayBook)|(BB10)|(BlackBerry)|(Opera Mini)|(IEMobile)|(webOS)|(MeeGo)/i);
	var isTouch = isMobile !== null || document.createTouch !== undefined || 'ontouchstart' in window || 'onmsgesturechange' in window || navigator.msMaxTouchPoints;
	var html = document.getElementsByTagName('html')[0];
	var body = document.body;
	var transitionEnd = whichTransitionEvent();
	var animationEnd = whichAnimationEvent();
	var uid = Date.now();
	var YTTemp = [];
	var videoPlayers = {};
	// Default settings
	var defaults = {
		selector: 'glightbox',
		skin: 'clean',
		closeButton: true,
		startAt: 0,
		autoplayVideos: true,
		descPosition: 'bottom',
		width: 900,
		height: 506,
		videosWidth: 960,
		videosHeight: 540,
		beforeSlideChange: null,
		afterSlideChange: null,
		beforeSlideLoad: null,
		afterSlideLoad: null,
		onOpen: null,
		onClose: null,
		loopAtEnd: false,
		touchNavigation: true,
		keyboardNavigation: true,
		closeOnOutsideClick: true,
		jwplayer: {
			api: null,
			licenseKey: null,
			params: {
				width: '100%',
				aspectratio: '16:9',
				stretching: 'uniform'
			}
		},
		vimeo: {
			api: 'https://player.vimeo.com/api/player.js',
			params: {
				api: 1,
				title: 0,
				byline: 0,
				portrait: 0
			}
		},
		youtube: {
			api: 'https://www.youtube.com/iframe_api',
			params: {
				enablejsapi: 1,
				showinfo: 0
			}
		},
		openEffect: 'zoomIn', // fade, zoom, none
		closeEffect: 'zoomOut', // fade, zoom, none
		slideEffect: 'slide', // fade, slide, zoom, none
		moreText: 'See more',
		moreLength: 60,
		slideHtml: '',
		lightboxHtml: '',
		cssEfects: {
			fade: {
				in: 'fadeIn',
				out: 'fadeOut'
			},
			zoom: {
				in: 'zoomIn',
				out: 'zoomOut'
			},
			slide: {
				in: 'slideInRight',
				out: 'slideOutLeft'
			},
			slide_back: {
				in: 'slideInLeft',
				out: 'slideOutRight'
			}
		}
	};
	/* jshint multistr: true */
	// You can pass your own slide structure
	// just make sure that add the same classes so they are populated
	// title class = gslide-title
	// desc class = gslide-desc
	// prev arrow class = gnext
	// next arrow id = gprev
	// close id = gclose
	var lightboxSlideHtml = '<div class="gslide">\
		<div class="gslide-inner-content">\
		<div class="ginner-container">\
		<div class="gslide-media">\
		</div>\
		<div class="gslide-description">\
		<h4 class="gslide-title"></h4>\
		<div class="gslide-desc"></div>\
		</div>\
		</div>\
		</div>\
		</div>';
	defaults.slideHtml = lightboxSlideHtml;
	var lightboxHtml = '<div id="glightbox-body" class="glightbox-container">\
		<div class="gloader visible"></div>\
		<div class="goverlay"></div>\
		<div class="gcontainer">\
		<div id="glightbox-slider" class="gslider"></div>\
		<a class="gnext"></a>\
		<a class="gprev"></a>\
		<a class="gclose"></a>\
		</div>\
		</div>';
	defaults.lightboxHtml = lightboxHtml;
	/**
	 * Merge two or more objects
	 */
	function extend() {
		var extended = {};
		var deep = false;
		var i = 0;
		var length = arguments.length;
		if (Object.prototype.toString.call(arguments[0]) === '[object Boolean]') {
			deep = arguments[0];
			i++;
		}
		var merge = function merge(obj) {
			for (var prop in obj) {
				if (Object.prototype.hasOwnProperty.call(obj, prop)) {
					if (deep && Object.prototype.toString.call(obj[prop]) === '[object Object]') {
						extended[prop] = extend(true, extended[prop], obj[prop]);
					} else {
						extended[prop] = obj[prop];
					}
				}
			}
		};
		for (; i < length; i++) {
			var obj = arguments[i];
			merge(obj);
		}
		return extended;
	}
	var utils = {
		isFunction: function isFunction(f) {
			return typeof f === 'function';
		},
		isString: function isString(s) {
			return typeof s === 'string';
		},
		isNode: function isNode(el) {
			return !!(el && el.nodeType && el.nodeType == 1);
		},
		isArray: function isArray(ar) {
			return Array.isArray(ar);
		},
		isArrayLike: function isArrayLike(ar) {
			return ar && ar.length && isFinite(ar.length);
		},
		isObject: function isObject(o) {
			var type = typeof o === 'undefined' ? 'undefined' : _typeof(o);
			return type === 'object' && o != null && !utils.isFunction(o) && !utils.isArray(o);
		},
		isNil: function isNil(o) {
			return o == null;
		},
		has: function has(obj, key) {
			return obj !== null && hasOwnProperty.call(obj, key);
		},
		size: function size(o) {
			if (utils.isObject(o)) {
				if (o.keys) {
					return o.keys().length;
				}
				var l = 0;
				for (var k in o) {
					if (utils.has(o, k)) {
						l++;
					}
				}
				return l;
			} else {
				return o.length;
			}
		},
		isNumber: function isNumber(n) {
			return !isNaN(parseFloat(n)) && isFinite(n);
		}
	};
	/**
	 * Each
	 *
	 * @param {mixed} node lisy, array, object
	 * @param {function} callback
	 */
	function each(collection, callback) {
		if (utils.isNode(collection) || collection === window || collection === document) {
			collection = [collection];
		}
		if (!utils.isArrayLike(collection) && !utils.isObject(collection)) {
			collection = [collection];
		}
		if (utils.size(collection) == 0) {
			return;
		}
		if (utils.isArrayLike(collection) && !utils.isObject(collection)) {
			var l = collection.length,
			i = 0;
			for (; i < l; i++) {
				if (callback.call(collection[i], collection[i], i, collection) === false) {
					break;
				}
			}
		} else if (utils.isObject(collection)) {
			for (var key in collection) {
				if (utils.has(collection, key)) {
					if (callback.call(collection[key], collection[key], key, collection) === false) {
						break;
					}
				}
			}
		}
	}
	/**
	 * Get nde events
	 * return node events and optionally
	 * check if the node has already a specific event
	 * to avoid duplicated callbacks
	 *
	 * @param {node} node
	 * @param {string} name event name
	 * @param {object} fn callback
	 * @returns {object}
	 */
	function getNodeEvents(node) {
		var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
		var fn = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
		var cache = node[uid] = node[uid] || [];
		var data = {
			all: cache,
			evt: null,
			found: null
		};
		if (name && fn && utils.size(cache) > 0) {
			each(cache, function (cl, i) {
				if (cl.eventName == name && cl.fn.toString() == fn.toString()) {
					data.found = true;
					data.evt = i;
					return false;
				}
			});
		}
		return data;
	}
	/**
	 * Add Event
	 * Add an event listener
	 *
	 * @param {string} eventName
	 * @param {object} detials
	 */
	function addEvent(eventName) {
		var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
		onElement = _ref.onElement,
		withCallback = _ref.withCallback,
		_ref$avoidDuplicate = _ref.avoidDuplicate,
		avoidDuplicate = _ref$avoidDuplicate === undefined ? true : _ref$avoidDuplicate,
		_ref$once = _ref.once,
		once = _ref$once === undefined ? false : _ref$once,
		_ref$useCapture = _ref.useCapture,
		useCapture = _ref$useCapture === undefined ? false : _ref$useCapture;
		var thisArg = arguments[2];
		var element = onElement || [];
		if (utils.isString(element)) {
			element = document.querySelectorAll(element);
		}
		function handler(event) {
			if (utils.isFunction(withCallback)) {
				withCallback.call(thisArg, event, this);
			}
			if (once) {
				handler.destroy();
			}
		}
		handler.destroy = function () {
			each(element, function (el) {
				var events = getNodeEvents(el, eventName, handler);
				if (events.found) {
					events.all.splice(events.evt, 1);
				}
				if (el.removeEventListener)
					el.removeEventListener(eventName, handler, useCapture);
			});
		};
		each(element, function (el) {
			var events = getNodeEvents(el, eventName, handler);
			if (el.addEventListener && avoidDuplicate && !events.found || !avoidDuplicate) {
				el.addEventListener(eventName, handler, useCapture);
				events.all.push({
					eventName: eventName,
					fn: handler
				});
			}
		});
		return handler;
	}
	/**
	 * Add element class
	 *
	 * @param {node} element
	 * @param {string} class name
	 */
	function addClass(node, name) {
		if (hasClass(node, name)) {
			return;
		}
		if (node.classList) {
			node.classList.add(name);
		} else {
			node.className += " " + name;
		}
	}
	/**
	 * Remove element class
	 *
	 * @param {node} element
	 * @param {string} class name
	 */
	function removeClass(node, name) {
		var c = name.split(' ');
		if (c.length > 1) {
			each(c, function (cl) {
				removeClass(node, cl);
			});
			return;
		}
		if (node.classList) {
			node.classList.remove(name);
		} else {
			node.className = node.className.replace(name, "");
		}
	}
	/**
	 * Has class
	 *
	 * @param {node} element
	 * @param {string} class name
	 */
	function hasClass(node, name) {
		return node.classList ? node.classList.contains(name) : new RegExp("(^| )" + name + "( |$)", "gi").test(node.className);
	}
	/**
	 * Determine animation events
	 */
	function whichAnimationEvent() {
		var t = void 0,
		el = document.createElement("fakeelement");
		var animations = {
			animation: "animationend",
			OAnimation: "oAnimationEnd",
			MozAnimation: "animationend",
			WebkitAnimation: "webkitAnimationEnd"
		};
		for (t in animations) {
			if (el.style[t] !== undefined) {
				return animations[t];
			}
		}
	}
	/**
	 * Determine transition events
	 */
	function whichTransitionEvent() {
		var t = void 0,
		el = document.createElement("fakeelement");
		var transitions = {
			transition: "transitionend",
			OTransition: "oTransitionEnd",
			MozTransition: "transitionend",
			WebkitTransition: "webkitTransitionEnd"
		};
		for (t in transitions) {
			if (el.style[t] !== undefined) {
				return transitions[t];
			}
		}
	}
	/**
	 * CSS Animations
	 *
	 * @param {node} element
	 * @param {string} animation name
	 * @param {function} callback
	 */
	function animateElement(element) {
		var animation = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
		var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
		if (!element || animation === '') {
			return false;
		}
		if (animation == 'none') {
			if (utils.isFunction(callback))
				callback();
			return false;
		}
		var animationNames = animation.split(' ');
		each(animationNames, function (name) {
			addClass(element, 'g' + name);
		});
		addEvent(animationEnd, {
			onElement: element,
			avoidDuplicate: false,
			once: true,
			withCallback: function withCallback(event, target) {
				each(animationNames, function (name) {
					removeClass(target, 'g' + name);
				});
				if (utils.isFunction(callback))
					callback();
			}
		});
	}
	/**
	 * Create a document fragment
	 *
	 * @param {string} html code
	 */
	function createHTML(htmlStr) {
		var frag = document.createDocumentFragment(),
		temp = document.createElement('div');
		temp.innerHTML = htmlStr;
		while (temp.firstChild) {
			frag.appendChild(temp.firstChild);
		}
		return frag;
	}
	/**
	 * Get the closestElement
	 *
	 * @param {node} element
	 * @param {string} class name
	 */
	function getClosest(elem, selector) {
		while (elem !== document.body) {
			elem = elem.parentElement;
			var matches = typeof elem.matches == 'function' ? elem.matches(selector) : elem.msMatchesSelector(selector);
			if (matches)
				return elem;
		}
	}
	/**
	 * Show element
	 *
	 * @param {node} element
	 */
	function show(element) {
		element.style.display = 'block';
	}
	/**
	 * Hide element
	 */
	function hide(element) {
		element.style.display = 'none';
	}
	/**
	 * Get slide data
	 *
	 * @param {node} element
	 */
	var getSlideData = function getSlideData() {
		var element = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
		var settings = arguments[1];
		var data = {
			href: '',
			title: '',
			description: '',
			descPosition: 'bottom',
			effect: '',
			node: element
		};
		if (utils.isObject(element) && !utils.isNode(element)) {
			return extend(data, element);
		}
		var url = '';
		var config = element.getAttribute('data-glightbox');
		var type = element.nodeName.toLowerCase();
		if (type === 'a')
			url = element.href;
		if (type === 'img')
			url = element.src;
		data.href = url;
		each(data, function (val, key) {
			if (utils.has(settings, key)) {
				data[key] = settings[key];
			}
			var nodeData = element.dataset[key];
			if (!utils.isNil(nodeData)) {
				data[key] = nodeData;
			}
		});
		var sourceType = getSourceType(url);
		data = extend(data, sourceType);
		if (!utils.isNil(config)) {
			var cleanKeys = [];
			each(data, function (v, k) {
				cleanKeys.push(';\\s?' + k);
			});
			cleanKeys = cleanKeys.join('\\s?:|');
			if (config.trim() !== '') {
				each(data, function (val, key) {
					var str = config;
					var match = '\s?' + key + '\s?:\s?(.*?)(' + cleanKeys + '\s?:|$)';
					var regex = new RegExp(match);
					var matches = str.match(regex);
					if (matches && matches.length && matches[1]) {
						var value = matches[1].trim().replace(/;\s*$/, '');
						data[key] = value;
					}
				});
			}
		} else {
			if (type == 'a') {
				var title = element.title;
				if (!utils.isNil(title) && title !== '')
					data.title = title;
			}
			if (type == 'img') {
				var alt = element.alt;
				if (!utils.isNil(alt) && alt !== '')
					data.title = alt;
			}
			var desc = element.getAttribute('data-description');
			if (!utils.isNil(desc) && desc !== '')
				data.description = desc;
		}
		var nodeDesc = element.querySelector('.glightbox-desc');
		if (nodeDesc) {
			data.description = nodeDesc.innerHTML;
		}
		data.sourcetype = data.hasOwnProperty('type') ? data.type : data.sourcetype;
		data.type = data.sourcetype;
		var defaultWith = data.sourcetype == 'video' ? settings.videosWidth : settings.width;
		var defaultHeight = data.sourcetype == 'video' ? settings.videosHeight : settings.height;
		data.width = utils.has(data, 'width') ? data.width : defaultWith;
		data.height = utils.has(data, 'height') ? data.height : defaultHeight;
		return data;
	};
	/**
	 * Set slide content
	 *
	 * @param {node} slide
	 * @param {object} data
	 * @param {function} callback
	 */
	var setSlideContent = function setSlideContent() {
		var slide = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
		var _this = this;
		var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
		var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
		if (hasClass(slide, 'loaded')) {
			return false;
		}
		if (utils.isFunction(this.settings.beforeSlideLoad)) {
			this.settings.beforeSlideLoad(slide, data);
		}
		var type = data.type;
		var position = data.descPosition;
		var slideMedia = slide.querySelector('.gslide-media');
		var slideTitle = slide.querySelector('.gslide-title');
		var slideText = slide.querySelector('.gslide-desc');
		var slideDesc = slide.querySelector('.gslide-description');
		var finalCallback = callback;
		if (utils.isFunction(this.settings.afterSlideLoad)) {
			finalCallback = function finalCallback() {
				if (utils.isFunction(callback)) {
					callback();
				}
				_this.settings.afterSlideLoad(slide, data);
			};
		}
		if (data.title == '' && data.description == '') {
			if (slideDesc) {
				slideDesc.parentNode.removeChild(slideDesc);
			}
		} else {
			if (slideTitle && data.title !== '') {
				slideTitle.innerHTML = data.title;
			} else {
				slideTitle.parentNode.removeChild(slideTitle);
			}
			if (slideText && data.description !== '') {
				if (isMobile && this.settings.moreLength > 0) {
					data.smallDescription = slideShortDesc(data.description, this.settings.moreLength, this.settings.moreText);
					slideText.innerHTML = data.smallDescription;
					slideDescriptionEvents.apply(this, [slideText, data]);
				} else {
					slideText.innerHTML = data.description;
				}
			} else {
				slideText.parentNode.removeChild(slideText);
			}
			addClass(slideMedia.parentNode, 'desc-' + position);
			addClass(slideDesc, 'description-' + position);
		}
		addClass(slideMedia, 'gslide-' + type);
		addClass(slide, 'loaded');
		if (type === 'video') {
			setSlideVideo.apply(this, [slide, data, finalCallback]);
			return;
		}
		if (type === 'external') {
			var iframe = createIframe(data.href, data.width, data.height, finalCallback);
			slideMedia.appendChild(iframe);
			return;
		}
		if (type === 'inline') {
			setInlineContent.apply(this, [slide, data, finalCallback]);
			return;
		}
		if (type === 'image') {
			var img = new Image();
			img.addEventListener('load', function () {
				if (utils.isFunction(finalCallback)) {
					finalCallback();
				}
			}, false);
			img.src = data.href;
			slideMedia.appendChild(img);
			return;
		}
		if (utils.isFunction(finalCallback))
			finalCallback();
	};
	/**
	 * Set slide video
	 *
	 * @param {node} slide
	 * @param {object} data
	 * @param {function} callback
	 */
	function setSlideVideo(slide, data, callback) {
		var _this2 = this;
		var source = data.source;
		var video_id = 'gvideo' + data.index;
		var slideMedia = slide.querySelector('.gslide-media');
		var url = data.href;
		var protocol = location.protocol.replace(':', '');
		if (protocol == 'file') {
			protocol = 'http';
		}
		// Set vimeo videos
		if (source == 'vimeo') {
			var vimeo_id = /vimeo.*\/(\d+)/i.exec(url);
			var params = parseUrlParams(this.settings.vimeo.params);
			var video_url = protocol + '://player.vimeo.com/video/' + vimeo_id[1] + '?' + params;
			injectVideoApi(this.settings.vimeo.api);
			var finalCallback = function finalCallback() {
				waitUntil(function () {
					return typeof Vimeo !== 'undefined';
				}, function () {
					var player = new Vimeo.Player(iframe);
					videoPlayers[video_id] = player;
					if (utils.isFunction(callback)) {
						callback();
					}
				});
			};
			var iframe = createIframe(video_url, data.width, data.height, finalCallback, slideMedia);
			iframe.id = video_id;
			iframe.className = 'vimeo-video gvideo';
			if (this.settings.autoplayVideos && !isMobile) {
				iframe.className += ' wait-autoplay';
			}
		}
		// Set youtube videos
		if (source == 'youtube') {
			var youtube_params = extend(this.settings.youtube.params, {
					playerapiid: video_id
				});
			var yparams = parseUrlParams(youtube_params);
			var youtube_id = getYoutubeID(url);
			var _video_url = protocol + '://www.youtube.com/embed/' + youtube_id + '?' + yparams;
			injectVideoApi(this.settings.youtube.api);
			var _finalCallback = function _finalCallback() {
				if (!utils.isNil(YT) && YT.loaded) {
					var player = new YT.Player(_iframe);
					videoPlayers[video_id] = player;
				} else {
					YTTemp.push(_iframe);
				}
				if (utils.isFunction(callback)) {
					callback();
				}
			};
			var _iframe = createIframe(_video_url, data.width, data.height, _finalCallback, slideMedia);
			_iframe.id = video_id;
			_iframe.className = 'youtube-video gvideo';
			if (this.settings.autoplayVideos && !isMobile) {
				_iframe.className += ' wait-autoplay';
			}
		}
		if (source == 'local') {
			var _html = '<video id="' + video_id + '" ';
			_html += 'style="background:#000; width: ' + data.width + 'px; height: ' + data.height + 'px;" ';
			_html += 'preload="metadata" ';
			_html += 'x-webkit-airplay="allow" ';
			_html += 'webkit-playsinline="" ';
			_html += 'controls ';
			_html += 'class="gvideo">';
			var format = url.toLowerCase().split('.').pop();
			var sources = {
				'mp4': '',
				'ogg': '',
				'webm': ''
			};
			sources[format] = url;
			for (var key in sources) {
				if (sources.hasOwnProperty(key)) {
					var videoFile = sources[key];
					if (data.hasOwnProperty(key)) {
						videoFile = data[key];
					}
					if (videoFile !== '') {
						_html += '<source src="' + videoFile + '" type="video/' + key + '">';
					}
				}
			}
			_html += '</video>';
			var video = createHTML(_html);
			slideMedia.appendChild(video);
			var vnode = document.getElementById(video_id);
			if (this.settings.jwplayer !== null && this.settings.jwplayer.api !== null) {
				var jwplayerConfig = this.settings.jwplayer;
				var jwplayerApi = this.settings.jwplayer.api;
				if (!jwplayerApi) {
					console.warn('Missing jwplayer api file');
					if (utils.isFunction(callback))
						callback();
					return false;
				}
				injectVideoApi(jwplayerApi, function () {
					var jwconfig = extend(_this2.settings.jwplayer.params, {
							width: data.width + 'px',
							height: data.height + 'px',
							file: url
						});
					jwplayer.key = _this2.settings.jwplayer.licenseKey;
					var player = jwplayer(video_id);
					player.setup(jwconfig);
					videoPlayers[video_id] = player;
					player.on('ready', function () {
						vnode = slideMedia.querySelector('.jw-video');
						addClass(vnode, 'gvideo');
						vnode.id = video_id;
						if (utils.isFunction(callback))
							callback();
					});
				});
			} else {
				addClass(vnode, 'html5-video');
				videoPlayers[video_id] = vnode;
				if (utils.isFunction(callback))
					callback();
			}
		}
	}
	/**
	 * Create an iframe element
	 *
	 * @param {string} url
	 * @param {numeric} width
	 * @param {numeric} height
	 * @param {function} callback
	 */
	function createIframe(url, width, height, callback, appendTo) {
		var iframe = document.createElement('iframe');
		var winWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
		iframe.className = 'vimeo-video gvideo';
		iframe.src = url;
		if (isMobile && winWidth < 767) {
			iframe.style.height = '';
		} else {
			iframe.style.height = height + 'px';
		}
		iframe.style.width = width + 'px';
		iframe.setAttribute('allowFullScreen', '');
		iframe.onload = function () {
			addClass(iframe, 'iframe-ready');
			if (utils.isFunction(callback)) {
				callback();
			}
		};
		if (appendTo) {
			appendTo.appendChild(iframe);
		}
		return iframe;
	}
	/**
	 * Get youtube ID
	 *
	 * @param {string} url
	 * @returns {string} video id
	 */
	function getYoutubeID(url) {
		var videoID = '';
		url = url.replace(/(>|<)/gi, '').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
		if (url[2] !== undefined) {
			videoID = url[2].split(/[^0-9a-z_\-]/i);
			videoID = videoID[0];
		} else {
			videoID = url;
		}
		return videoID;
	}
	/**
	 * Inject videos api
	 * used for youtube, vimeo and jwplayer
	 *
	 * @param {string} url
	 * @param {function} callback
	 */
	function injectVideoApi(url, callback) {
		if (utils.isNil(url)) {
			console.error('Inject videos api error');
			return;
		}
		var found = document.querySelectorAll('script[src="' + url + '"]');
		if (utils.isNil(found) || found.length == 0) {
			var script = document.createElement('script');
			script.type = 'text/javascript';
			script.src = url;
			script.onload = function () {
				if (utils.isFunction(callback))
					callback();
			};
			document.body.appendChild(script);
			return false;
		}
		if (utils.isFunction(callback))
			callback();
	}
	/**
	 * Handle youtube Api
	 * This is a simple fix, when the video
	 * is ready sometimes the youtube api is still
	 * loading so we can not autoplay or pause
	 * we need to listen onYouTubeIframeAPIReady and
	 * register the videos if required
	 */
	function youtubeApiHandle() {
		for (var i = 0; i < YTTemp.length; i++) {
			var iframe = YTTemp[i];
			var player = new YT.Player(iframe);
			videoPlayers[iframe.id] = player;
		}
	}
	if (typeof window.onYouTubeIframeAPIReady !== 'undefined') {
		window.onYouTubeIframeAPIReady = function () {
			window.onYouTubeIframeAPIReady();
			youtubeApiHandle();
		};
	} else {
		window.onYouTubeIframeAPIReady = youtubeApiHandle;
	}
	/**
	 * Wait until
	 * wait until all the validations
	 * are passed
	 *
	 * @param {function} check
	 * @param {function} onComplete
	 * @param {numeric} delay
	 * @param {numeric} timeout
	 */
	function waitUntil(check, onComplete, delay, timeout) {
		if (check()) {
			onComplete();
			return;
		}
		if (!delay)
			delay = 100;
		var timeoutPointer;
		var intervalPointer = setInterval(function () {
				if (!check())
					return;
				clearInterval(intervalPointer);
				if (timeoutPointer)
					clearTimeout(timeoutPointer);
				onComplete();
			}, delay);
		if (timeout)
			timeoutPointer = setTimeout(function () {
					clearInterval(intervalPointer);
				}, timeout);
	}
	/**
	 * Parse url params
	 * convert an object in to a
	 * url query string parameters
	 *
	 * @param {object} params
	 */
	function parseUrlParams(params) {
		var qs = '';
		var i = 0;
		each(params, function (val, key) {
			if (i > 0) {
				qs += '&amp;';
			}
			qs += key + '=' + val;
			i += 1;
		});
		return qs;
	}
	/**
	 * Set slide inline content
	 * we'll extend this to make http
	 * requests using the fetch api
	 * but for now we keep it simple
	 *
	 * @param {node} slide
	 * @param {object} data
	 * @param {function} callback
	 */
	function setInlineContent(slide, data, callback) {
		var slideMedia = slide.querySelector('.gslide-media');
		var div = document.getElementById(data.inlined.replace('#', ''));
		if (div) {
			var cloned = div.cloneNode(true);
			cloned.style.height = data.height + 'px';
			cloned.style.maxWidth = data.width + 'px';
			addClass(cloned, 'ginlined-content');
			slideMedia.appendChild(cloned);
			if (utils.isFunction(callback)) {
				callback();
			}
			return;
		}
	}
	/**
	 * Get source type
	 * gte the source type of a url
	 *
	 * @param {string} url
	 */
	var getSourceType = function getSourceType(url) {
		var origin = url;
		url = url.toLowerCase();
		var data = {};
		if (url.match(/\.(jpeg|jpg|gif|png)$/) !== null) {
			data.sourcetype = 'image';
			return data;
		}
		if (url.match(/(youtube\.com|youtube-nocookie\.com)\/watch\?v=([a-zA-Z0-9\-_]+)/) || url.match(/youtu\.be\/([a-zA-Z0-9\-_]+)/)) {
			data.sourcetype = 'video';
			data.source = 'youtube';
			return data;
		}
		if (url.match(/vimeo\.com\/([0-9]*)/)) {
			data.sourcetype = 'video';
			data.source = 'vimeo';
			return data;
		}
		if (url.match(/\.(mp4|ogg|webm)$/) !== null) {
			data.sourcetype = 'video';
			data.source = 'local';
			return data;
		}
		// Check if inline content
		if (url.indexOf("#") > -1) {
			var hash = origin.split('#').pop();
			if (hash.trim() !== '') {
				data.sourcetype = 'inline';
				data.source = url;
				data.inlined = '#' + hash;
				return data;
			}
		}
		// Ajax
		if (url.includes("gajax=true")) {
			data.sourcetype = 'ajax';
			data.source = url;
		}
		// Any other url
		data.sourcetype = 'external';
		data.source = url;
		return data;
	};
	/**
	 * Desktop keyboard navigation
	 */
	function keyboardNavigation() {
		var _this3 = this;
		if (this.events.hasOwnProperty('keyboard')) {
			return false;
		}
		this.events['keyboard'] = addEvent('keydown', {
				onElement: window,
				withCallback: function withCallback(event, target) {
					event = event || window.event;
					var key = event.keyCode;
					if (key == 39)
						_this3.nextSlide();
					if (key == 37)
						_this3.prevSlide();
					if (key == 27)
						_this3.close();
				}
			});
	}
	/**
	 * Touch navigation
	 */
	function touchNavigation() {
		var _this4 = this;
		if (this.events.hasOwnProperty('touchStart')) {
			return false;
		}
		var index = void 0,
		hDistance = void 0,
		vDistance = void 0,
		hDistanceLast = void 0,
		vDistanceLast = void 0,
		hDistancePercent = void 0,
		vSwipe = false,
		hSwipe = false,
		hSwipMinDistance = 0,
		vSwipMinDistance = 0,
		doingPinch = false,
		pinchBigger = false,
		startCoords = {},
		endCoords = {},
		slider = this.slidesContainer,
		activeSlide = null,
		xDown = 0,
		yDown = 0,
		activeSlideImage = null,
		activeSlideMedia = null,
		activeSlideDesc = null;
		var winWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
		var winHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
		this.events['doctouchmove'] = addEvent('touchmove', {
				onElement: document,
				withCallback: function withCallback(e, target) {
					if (hasClass(body, 'gdesc-open')) {
						e.preventDefault();
						return false;
					}
				}
			});
		this.events['touchStart'] = addEvent('touchstart', {
				onElement: body,
				withCallback: function withCallback(e, target) {
					if (hasClass(body, 'gdesc-open')) {
						return;
					}
					addClass(body, 'touching');
					activeSlide = _this4.getActiveSlide();
					activeSlideImage = activeSlide.querySelector('.gslide-image');
					activeSlideMedia = activeSlide.querySelector('.gslide-media');
					activeSlideDesc = activeSlide.querySelector('.gslide-description');
					index = _this4.index;
					endCoords = e.targetTouches[0];
					startCoords.pageX = e.targetTouches[0].pageX;
					startCoords.pageY = e.targetTouches[0].pageY;
					xDown = e.targetTouches[0].clientX;
					yDown = e.targetTouches[0].clientY;
				}
			});
		this.events['gestureStart'] = addEvent('gesturestart', {
				onElement: body,
				withCallback: function withCallback(e, target) {
					if (activeSlideImage) {
						e.preventDefault();
						doingPinch = true;
					}
				}
			});
		this.events['gestureChange'] = addEvent('gesturechange', {
				onElement: body,
				withCallback: function withCallback(e, target) {
					e.preventDefault();
					slideCSSTransform(activeSlideImage, 'scale(' + e.scale + ')');
				}
			});
		this.events['gesturEend'] = addEvent('gestureend', {
				onElement: body,
				withCallback: function withCallback(e, target) {
					doingPinch = false;
					if (e.scale < 1) {
						pinchBigger = false;
						slideCSSTransform(activeSlideImage, 'scale(1)');
					} else {
						pinchBigger = true;
					}
				}
			});
		this.events['touchMove'] = addEvent('touchmove', {
				onElement: body,
				withCallback: function withCallback(e, target) {
					if (!hasClass(body, 'touching')) {
						return;
					}
					if (hasClass(body, 'gdesc-open') || doingPinch || pinchBigger) {
						return;
					}
					e.preventDefault();
					endCoords = e.targetTouches[0];
					var slideHeight = activeSlide.querySelector('.gslide-inner-content').offsetHeight;
					var slideWidth = activeSlide.querySelector('.gslide-inner-content').offsetWidth;
					var xUp = e.targetTouches[0].clientX;
					var yUp = e.targetTouches[0].clientY;
					var xDiff = xDown - xUp;
					var yDiff = yDown - yUp;
					if (Math.abs(xDiff) > Math.abs(yDiff)) {
						/*most significant*/
						vSwipe = false;
						hSwipe = true;
					} else {
						hSwipe = false;
						vSwipe = true;
					}
					if (vSwipe) {
						vDistanceLast = vDistance;
						vDistance = endCoords.pageY - startCoords.pageY;
						if (Math.abs(vDistance) >= vSwipMinDistance || vSwipe) {
							var opacity = 0.75 - Math.abs(vDistance) / slideHeight;
							activeSlideMedia.style.opacity = opacity;
							if (activeSlideDesc) {
								activeSlideDesc.style.opacity = opacity;
							}
							slideCSSTransform(activeSlideMedia, 'translate3d(0, ' + vDistance + 'px, 0)');
						}
						return;
					}
					hDistanceLast = hDistance;
					hDistance = endCoords.pageX - startCoords.pageX;
					hDistancePercent = hDistance * 100 / winWidth;
					if (hSwipe) {
						if (_this4.index + 1 == _this4.elements.length && hDistance < -60) {
							resetSlideMove(activeSlide);
							return false;
						}
						if (_this4.index - 1 < 0 && hDistance > 60) {
							resetSlideMove(activeSlide);
							return false;
						}
						var _opacity = 0.75 - Math.abs(hDistance) / slideWidth;
						activeSlideMedia.style.opacity = _opacity;
						if (activeSlideDesc) {
							activeSlideDesc.style.opacity = _opacity;
						}
						slideCSSTransform(activeSlideMedia, 'translate3d(' + hDistancePercent + '%, 0, 0)');
					}
				}
			});
		this.events['touchEnd'] = addEvent('touchend', {
				onElement: body,
				withCallback: function withCallback(e, target) {
					vDistance = endCoords.pageY - startCoords.pageY;
					hDistance = endCoords.pageX - startCoords.pageX;
					hDistancePercent = hDistance * 100 / winWidth;
					removeClass(body, 'touching');
					var slideHeight = activeSlide.querySelector('.gslide-inner-content').offsetHeight;
					var slideWidth = activeSlide.querySelector('.gslide-inner-content').offsetWidth;
					// Swipe to top/bottom to close
					if (vSwipe) {
						var onEnd = slideHeight / 2;
						vSwipe = false;
						if (Math.abs(vDistance) >= onEnd) {
							_this4.close();
							return;
						}
						resetSlideMove(activeSlide);
						return;
					}
					if (hSwipe) {
						hSwipe = false;
						var where = 'prev';
						var asideExist = true;
						if (hDistance < 0) {
							where = 'next';
							hDistance = Math.abs(hDistance);
						}
						if (where == 'prev' && _this4.index - 1 < 0) {
							asideExist = false;
						}
						if (where == 'next' && _this4.index + 1 >= _this4.elements.length) {
							asideExist = false;
						}
						if (asideExist && hDistance >= slideWidth / 2 - 90) {
							if (where == 'next') {
								_this4.nextSlide();
							} else {
								_this4.prevSlide();
							}
							return;
						}
						resetSlideMove(activeSlide);
					}
				}
			});
	}
	function slideCSSTransform(slide) {
		var translate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
		if (translate == '') {
			slide.style.webkitTransform = '';
			slide.style.MozTransform = '';
			slide.style.msTransform = '';
			slide.style.OTransform = '';
			slide.style.transform = '';
			return false;
		}
		slide.style.webkitTransform = translate;
		slide.style.MozTransform = translate;
		slide.style.msTransform = translate;
		slide.style.OTransform = translate;
		slide.style.transform = translate;
	}
	function resetSlideMove(slide) {
		var media = slide.querySelector('.gslide-media');
		var desc = slide.querySelector('.gslide-description');
		addClass(media, 'greset');
		slideCSSTransform(media, 'translate3d(0, 0, 0)');
		var animation = addEvent(transitionEnd, {
				onElement: media,
				once: true,
				withCallback: function withCallback(event, target) {
					removeClass(media, 'greset');
				}
			});
		media.style.opacity = '';
		if (desc) {
			desc.style.opacity = '';
		}
	}
	function slideShortDesc(string) {
		var n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 50;
		var wordBoundary = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
		var useWordBoundary = wordBoundary;
		string = string.trim();
		if (string.length <= n) {
			return string;
		}
		var subString = string.substr(0, n - 1);
		if (!useWordBoundary) {
			return subString;
		}
		return subString + '... <a href="#" class="desc-more">' + wordBoundary + '</a>';
	}
	function slideDescriptionEvents(desc, data) {
		var moreLink = desc.querySelector('.desc-more');
		if (!moreLink) {
			return false;
		}
		addEvent('click', {
			onElement: moreLink,
			withCallback: function withCallback(event, target) {
				event.preventDefault();
				var desc = getClosest(target, '.gslide-desc');
				if (!desc) {
					return false;
				}
				desc.innerHTML = data.description;
				addClass(body, 'gdesc-open');
				var shortEvent = addEvent('click', {
						onElement: [body, getClosest(desc, '.gslide-description')],
						withCallback: function withCallback(event, target) {
							if (event.target.nodeName.toLowerCase() !== 'a') {
								removeClass(body, 'gdesc-open');
								addClass(body, 'gdesc-closed');
								desc.innerHTML = data.smallDescription;
								slideDescriptionEvents(desc, data);
								setTimeout(function () {
									removeClass(body, 'gdesc-closed');
								}, 400);
								shortEvent.destroy();
							}
						}
					});
			}
		});
	}
	/**
	 * GLightbox Class
	 * Class and public methods
	 */
	var GlightboxInit = function () {
		function GlightboxInit(options) {
			_classCallCheck(this, GlightboxInit);
			this.settings = extend(defaults, options || {});
			this.effectsClasses = this.getAnimationClasses();
		}
		_createClass(GlightboxInit, [{
					key: 'init',
					value: function init() {
						var _this5 = this;
						this.baseEvents = addEvent('click', {
								onElement: '.' + this.settings.selector,
								withCallback: function withCallback(e, target) {
									e.preventDefault();
									_this5.open(target);
								}
							});
					}
				}, {
					key: 'open',
					value: function open() {
						var element = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
						this.elements = this.getElements(element);
						if (this.elements.length == 0)
							return false;
						this.activeSlide = null;
						this.prevActiveSlideIndex = null;
						this.prevActiveSlide = null;
						var index = this.settings.startAt;
						if (element) {
							// if element passed, get the index
							index = this.elements.indexOf(element);
							if (index < 0) {
								index = 0;
							}
						}
						this.build();
						animateElement(this.overlay, this.settings.openEffect == 'none' ? 'none' : this.settings.cssEfects.fade.in);
						var bodyWidth = body.offsetWidth;
						body.style.width = bodyWidth + 'px';
						addClass(body, 'glightbox-open');
						addClass(html, 'glightbox-open');
						if (isMobile) {
							addClass(html, 'glightbox-mobile');
							this.settings.slideEffect = 'slide';
						}
						this.showSlide(index, true);
						if (this.elements.length == 1) {
							hide(this.prevButton);
							hide(this.nextButton);
						} else {
							show(this.prevButton);
							show(this.nextButton);
						}
						this.lightboxOpen = true;
						if (utils.isFunction(this.settings.onOpen)) {
							this.settings.onOpen();
						}
						if (isMobile && isTouch && this.settings.touchNavigation) {
							touchNavigation.apply(this);
							return false;
						}
						if (this.settings.keyboardNavigation) {
							keyboardNavigation.apply(this);
						}
					}
				}, {
					key: 'showSlide',
					value: function showSlide() {
						var _this6 = this;
						var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
						var first = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
						show(this.loader);
						this.index = index;
						var current = this.slidesContainer.querySelector('.current');
						if (current) {
							removeClass(current, 'current');
						}
						// hide prev slide
						this.slideAnimateOut();
						var slide = this.slidesContainer.querySelectorAll('.gslide')[index];
						show(this.slidesContainer);
						// Check if slide's content is alreay loaded
						if (hasClass(slide, 'loaded')) {
							this.slideAnimateIn(slide, first);
							hide(this.loader);
						} else {
							// If not loaded add the slide content
							show(this.loader);
							// console.log("a", this.settings);
							var slide_data = getSlideData(this.elements[index], this.settings);
							// console.log(slide_data);
							slide_data.index = index;
							setSlideContent.apply(this, [slide, slide_data, function () {
										hide(_this6.loader);
										_this6.slideAnimateIn(slide, first);
									}
								]);
						}
						// Preload subsequent slides
						this.preloadSlide(index + 1);
						this.preloadSlide(index - 1);
						// Handle navigation arrows
						removeClass(this.nextButton, 'disabled');
						removeClass(this.prevButton, 'disabled');
						if (index === 0) {
							addClass(this.prevButton, 'disabled');
						} else if (index === this.elements.length - 1 && this.settings.loopAtEnd !== true) {
							addClass(this.nextButton, 'disabled');
						}
						this.activeSlide = slide;
					}
				}, {
					key: 'preloadSlide',
					value: function preloadSlide(index) {
						var _this7 = this;
						// Verify slide index, it can not be lower than 0
						// and it can not be greater than the total elements
						if (index < 0 || index > this.elements.length)
							return false;
						if (utils.isNil(this.elements[index]))
							return false;
						var slide = this.slidesContainer.querySelectorAll('.gslide')[index];
						if (hasClass(slide, 'loaded')) {
							return false;
						}
						var slide_data = getSlideData(this.elements[index], this.settings);
						slide_data.index = index;
						var type = slide_data.sourcetype;
						if (type == 'video' || type == 'external') {
							setTimeout(function () {
								setSlideContent.apply(_this7, [slide, slide_data]);
							}, 200);
						} else {
							setSlideContent.apply(this, [slide, slide_data]);
						}
					}
				}, {
					key: 'prevSlide',
					value: function prevSlide() {
						var prev = this.index - 1;
						if (prev < 0) {
							return false;
						}
						this.goToSlide(prev);
					}
				}, {
					key: 'nextSlide',
					value: function nextSlide() {
						var next = this.index + 1;
						if (next > this.elements.length)
							return false;
						this.goToSlide(next);
					}
				}, {
					key: 'goToSlide',
					value: function goToSlide() {
						var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
						if (index > -1) {
							this.prevActiveSlide = this.activeSlide;
							this.prevActiveSlideIndex = this.index;
							if (index < this.elements.length) {
								this.showSlide(index);
							} else {
								if (this.settings.loopAtEnd === true) {
									index = 0;
									this.showSlide(index);
								}
							}
						}
					}
				}, {
					key: 'slideAnimateIn',
					value: function slideAnimateIn(slide, first) {
						var _this8 = this;
						var slideMedia = slide.querySelector('.gslide-media');
						var slideDesc = slide.querySelector('.gslide-description');
						var prevData = {
							index: this.prevActiveSlideIndex,
							slide: this.prevActiveSlide
						};
						var nextData = {
							index: this.index,
							slide: this.activeSlide
						};
						if (slideMedia.offsetWidth > 0 && slideDesc) {
							hide(slideDesc);
							slide.querySelector('.ginner-container').style.maxWidth = slideMedia.offsetWidth + 'px';
							slideDesc.style.display = '';
						}
						removeClass(slide, this.effectsClasses);
						if (first) {
							animateElement(slide, this.settings.openEffect, function () {
								if (!isMobile && _this8.settings.autoplayVideos) {
									_this8.playSlideVideo(slide);
								}
								if (utils.isFunction(_this8.settings.afterSlideChange)) {
									_this8.settings.afterSlideChange.apply(_this8, [prevData, nextData]);
								}
							});
						} else {
							var effect_name = this.settings.slideEffect;
							var animIn = effect_name !== 'none' ? this.settings.cssEfects[effect_name].in : effect_name;
							if (this.prevActiveSlideIndex > this.index) {
								if (this.settings.slideEffect == 'slide') {
									animIn = this.settings.cssEfects.slide_back.in;
								}
							}
							animateElement(slide, animIn, function () {
								if (!isMobile && _this8.settings.autoplayVideos) {
									_this8.playSlideVideo(slide);
								}
								if (utils.isFunction(_this8.settings.afterSlideChange)) {
									_this8.settings.afterSlideChange.apply(_this8, [prevData, nextData]);
								}
							});
						}
						addClass(slide, 'current');
					}
				}, {
					key: 'slideAnimateOut',
					value: function slideAnimateOut() {
						if (!this.prevActiveSlide) {
							return false;
						}
						var prevSlide = this.prevActiveSlide;
						removeClass(prevSlide, this.effectsClasses);
						addClass(prevSlide, 'prev');
						var animation = this.settings.slideEffect;
						var animOut = animation !== 'none' ? this.settings.cssEfects[animation].out : animation;
						this.stopSlideVideo(prevSlide);
						if (utils.isFunction(this.settings.beforeSlideChange)) {
							this.settings.beforeSlideChange.apply(this, [{
										index: this.prevActiveSlideIndex,
										slide: this.prevActiveSlide
									}, {
										index: this.index,
										slide: this.activeSlide
									}
								]);
						}
						if (this.prevActiveSlideIndex > this.index && this.settings.slideEffect == 'slide') {
							// going back
							animOut = this.settings.cssEfects.slide_back.out;
						}
						animateElement(prevSlide, animOut, function () {
							var media = prevSlide.querySelector('.gslide-media');
							var desc = prevSlide.querySelector('.gslide-description');
							media.style.transform = '';
							removeClass(media, 'greset');
							media.style.opacity = '';
							if (desc) {
								desc.style.opacity = '';
							}
							removeClass(prevSlide, 'prev');
						});
					}
				}, {
					key: 'stopSlideVideo',
					value: function stopSlideVideo(slide) {
						if (utils.isNumber(slide)) {
							slide = this.slidesContainer.querySelectorAll('.gslide')[slide];
						}
						var slideVideo = slide ? slide.querySelector('.gvideo') : null;
						if (!slideVideo) {
							return false;
						}
						var videoID = slideVideo.id;
						if (videoPlayers && videoPlayers.hasOwnProperty(videoID)) {
							var player = videoPlayers[videoID];
							if (hasClass(slideVideo, 'vimeo-video')) {
								player.pause();
							}
							if (hasClass(slideVideo, 'youtube-video')) {
								player.pauseVideo();
							}
							if (hasClass(slideVideo, 'jw-video')) {
								player.pause(true);
							}
							if (hasClass(slideVideo, 'html5-video')) {
								player.pause();
							}
						}
					}
				}, {
					key: 'playSlideVideo',
					value: function playSlideVideo(slide) {
						if (utils.isNumber(slide)) {
							slide = this.slidesContainer.querySelectorAll('.gslide')[slide];
						}
						var slideVideo = slide.querySelector('.gvideo');
						if (!slideVideo) {
							return false;
						}
						var videoID = slideVideo.id;
						if (videoPlayers && videoPlayers.hasOwnProperty(videoID)) {
							var player = videoPlayers[videoID];
							if (hasClass(slideVideo, 'vimeo-video')) {
								player.play();
							}
							if (hasClass(slideVideo, 'youtube-video')) {
								player.playVideo();
							}
							if (hasClass(slideVideo, 'jw-video')) {
								player.play();
							}
							if (hasClass(slideVideo, 'html5-video')) {
								player.play();
							}
							setTimeout(function () {
								removeClass(slideVideo, 'wait-autoplay');
							}, 300);
							return false;
						}
					}
				}, {
					key: 'setElements',
					value: function setElements(elements) {
						this.settings.elements = elements;
					}
				}, {
					key: 'getElements',
					value: function getElements() {
						var element = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
						this.elements = [];
						if (!utils.isNil(this.settings.elements) && utils.isArray(this.settings.elements)) {
							return this.settings.elements;
						}
						var nodes = false;
						if (element !== null) {
							var gallery = element.getAttribute('data-gallery');
							if (gallery && gallery !== '') {
								nodes = document.querySelectorAll('[data-gallery="' + gallery + '"]');
							}
						}
						if (nodes == false) {
							nodes = document.querySelectorAll('.' + this.settings.selector);
						}
						nodes = Array.prototype.slice.call(nodes);
						return nodes;
					}
				}, {
					key: 'getActiveSlide',
					value: function getActiveSlide() {
						return this.slidesContainer.querySelectorAll('.gslide')[this.index];
					}
				}, {
					key: 'getActiveSlideIndex',
					value: function getActiveSlideIndex() {
						return this.index;
					}
				}, {
					key: 'getAnimationClasses',
					value: function getAnimationClasses() {
						var effects = [];
						for (var key in this.settings.cssEfects) {
							if (this.settings.cssEfects.hasOwnProperty(key)) {
								var effect = this.settings.cssEfects[key];
								effects.push('g' + effect.in);
								effects.push('g' + effect.out);
							}
						}
						return effects.join(' ');
					}
				}, {
					key: 'build',
					value: function build() {
						var _this9 = this;
						if (this.built) {
							return false;
						}
						var lightbox_html = createHTML(this.settings.lightboxHtml);
						document.body.appendChild(lightbox_html);
						var modal = document.getElementById('glightbox-body');
						this.modal = modal;
						var closeButton = modal.querySelector('.gclose');
						this.prevButton = modal.querySelector('.gprev');
						this.nextButton = modal.querySelector('.gnext');
						this.overlay = modal.querySelector('.goverlay');
						this.loader = modal.querySelector('.gloader');
						this.slidesContainer = document.getElementById('glightbox-slider');
						this.events = {};
						addClass(this.modal, 'glightbox-' + this.settings.skin);
						if (this.settings.closeButton && closeButton) {
							this.events['close'] = addEvent('click', {
									onElement: closeButton,
									withCallback: function withCallback(e, target) {
										e.preventDefault();
										_this9.close();
									}
								});
						}
						if (closeButton && !this.settings.closeButton) {
							closeButton.parentNode.removeChild(closeButton);
						}
						if (this.nextButton) {
							this.events['next'] = addEvent('click', {
									onElement: this.nextButton,
									withCallback: function withCallback(e, target) {
										e.preventDefault();
										_this9.nextSlide();
									}
								});
						}
						if (this.prevButton) {
							this.events['prev'] = addEvent('click', {
									onElement: this.prevButton,
									withCallback: function withCallback(e, target) {
										e.preventDefault();
										_this9.prevSlide();
									}
								});
						}
						if (this.settings.closeOnOutsideClick) {
							this.events['outClose'] = addEvent('click', {
									onElement: modal,
									withCallback: function withCallback(e, target) {
										if (!getClosest(e.target, '.ginner-container')) {
											if (!hasClass(e.target, 'gnext') && !hasClass(e.target, 'gprev')) {
												_this9.close();
											}
										}
									}
								});
						}
						each(this.elements, function () {
							var slide = createHTML(_this9.settings.slideHtml);
							_this9.slidesContainer.appendChild(slide);
						});
						if (isTouch) {
							addClass(html, 'glightbox-touch');
						}
						this.built = true;
					}
				}, {
					key: 'reload',
					value: function reload() {
						this.init();
					}
				}, {
					key: 'close',
					value: function close() {
						var _this10 = this;
						if (this.closing) {
							return false;
						}
						this.closing = true;
						this.stopSlideVideo(this.activeSlide);
						addClass(this.modal, 'glightbox-closing');
						animateElement(this.overlay, this.settings.openEffect == 'none' ? 'none' : this.settings.cssEfects.fade.out);
						animateElement(this.activeSlide, this.settings.closeEffect, function () {
							_this10.activeSlide = null;
							_this10.prevActiveSlideIndex = null;
							_this10.prevActiveSlide = null;
							_this10.built = false;
							if (_this10.events) {
								for (var key in _this10.events) {
									if (_this10.events.hasOwnProperty(key)) {
										_this10.events[key].destroy();
									}
								}
							}
							removeClass(body, 'glightbox-open');
							removeClass(html, 'glightbox-open');
							removeClass(body, 'touching');
							removeClass(body, 'gdesc-open');
							body.style.width = '';
							_this10.modal.parentNode.removeChild(_this10.modal);
							if (utils.isFunction(_this10.settings.onClose)) {
								_this10.settings.onClose();
							}
							_this10.closing = null;
						});
					}
				}, {
					key: 'destroy',
					value: function destroy() {
						this.close();
						this.baseEvents.destroy();
					}
				}
			]);
		return GlightboxInit;
	}
	();
	module.exports = function () {
		var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
		var instance = new GlightboxInit(options);
		instance.init();
		return instance;
	};
	/*jshint validthis: false */
});
/*jshint +W069 */
/*jshint esnext: false */

/*!
 * imagesLoaded PACKAGED v4.1.4
 * JavaScript is all like "You images are done yet or what?"
 * MIT License
 */

/**
 * EvEmitter v1.1.0
 * Lil' event emitter
 * MIT License
 */

/* jshint unused: true, undef: true, strict: true */

(function (global, factory) {
	// universal module definition
	/* jshint strict: false */
	/* globals define, module, window */
	if (typeof define == 'function' && define.amd) {
		// AMD - RequireJS
		define('ev-emitter/ev-emitter', factory);
	} else if (typeof module == 'object' && module.exports) {
		// CommonJS - Browserify, Webpack
		module.exports = factory();
	} else {
		// Browser globals
		global.EvEmitter = factory();
	}

}
	(typeof window != 'undefined' ? window : this, function () {

		"use strict";

		function EvEmitter() {}

		var proto = EvEmitter.prototype;

		proto.on = function (eventName, listener) {
			if (!eventName || !listener) {
				return;
			}
			// set events hash
			var events = this._events = this._events || {};
			// set listeners array
			var listeners = events[eventName] = events[eventName] || [];
			// only add once
			if (listeners.indexOf(listener) == -1) {
				listeners.push(listener);
			}

			return this;
		};

		proto.once = function (eventName, listener) {
			if (!eventName || !listener) {
				return;
			}
			// add event
			this.on(eventName, listener);
			// set once flag
			// set onceEvents hash
			var onceEvents = this._onceEvents = this._onceEvents || {};
			// set onceListeners object
			var onceListeners = onceEvents[eventName] = onceEvents[eventName] || {};
			// set flag
			onceListeners[listener] = true;

			return this;
		};

		proto.off = function (eventName, listener) {
			var listeners = this._events && this._events[eventName];
			if (!listeners || !listeners.length) {
				return;
			}
			var index = listeners.indexOf(listener);
			if (index != -1) {
				listeners.splice(index, 1);
			}

			return this;
		};

		proto.emitEvent = function (eventName, args) {
			var listeners = this._events && this._events[eventName];
			if (!listeners || !listeners.length) {
				return;
			}
			// copy over to avoid interference if .off() in listener
			listeners = listeners.slice(0);
			args = args || [];
			// once stuff
			var onceListeners = this._onceEvents && this._onceEvents[eventName];

			for (var i = 0; i < listeners.length; i++) {
				var listener = listeners[i];
				var isOnce = onceListeners && onceListeners[listener];
				if (isOnce) {
					// remove listener
					// remove before trigger to prevent recursion
					this.off(eventName, listener);
					// unset once flag
					delete onceListeners[listener];
				}
				// trigger listener
				listener.apply(this, args);
			}

			return this;
		};

		proto.allOff = function () {
			delete this._events;
			delete this._onceEvents;
		};

		return EvEmitter;

	}));

/*!
 * imagesLoaded v4.1.4
 * JavaScript is all like "You images are done yet or what?"
 * MIT License
 */

(function (window, factory) {
	'use strict';
	// universal module definition

	/*global define: false, module: false, require: false */

	if (typeof define == 'function' && define.amd) {
		// AMD
		define([
				'ev-emitter/ev-emitter'
			], function (EvEmitter) {
			return factory(window, EvEmitter);
		});
	} else if (typeof module == 'object' && module.exports) {
		// CommonJS
		module.exports = factory(
				window,
				require('ev-emitter'));
	} else {
		// browser global
		window.imagesLoaded = factory(
				window,
				window.EvEmitter);
	}

})(typeof window !== 'undefined' ? window : this,

	// --------------------------  factory -------------------------- //

	function factory(window, EvEmitter) {

	"use strict";

	var $ = window.jQuery;
	var console = window.console;

	// -------------------------- helpers -------------------------- //

	// extend objects
	function extend(a, b) {
		for (var prop in b) {
			if (b.hasOwnProperty(prop)) {
				a[prop] = b[prop];
			}
		}
		return a;
	}

	var arraySlice = Array.prototype.slice;

	// turn element or nodeList into an array
	function makeArray(obj) {
		if (Array.isArray(obj)) {
			// use object if already an array
			return obj;
		}

		var isArrayLike = typeof obj == 'object' && typeof obj.length == 'number';
		if (isArrayLike) {
			// convert nodeList to array
			return arraySlice.call(obj);
		}

		// array of single index
		return [obj];
	}

	// -------------------------- imagesLoaded -------------------------- //

	/**
	 * @param {Array, Element, NodeList, String} elem
	 * @param {Object or Function} options - if function, use as callback
	 * @param {Function} onAlways - callback function
	 */
	function ImagesLoaded(elem, options, onAlways) {
		// coerce ImagesLoaded() without new, to be new ImagesLoaded()
		if (!(this instanceof ImagesLoaded)) {
			return new ImagesLoaded(elem, options, onAlways);
		}
		// use elem as selector string
		var queryElem = elem;
		if (typeof elem == 'string') {
			queryElem = document.querySelectorAll(elem);
		}
		// bail if bad element
		if (!queryElem) {
			console.error('Bad element for imagesLoaded ' + (queryElem || elem));
			return;
		}

		this.elements = makeArray(queryElem);
		this.options = extend({}, this.options);
		// shift arguments if no options set
		if (typeof options == 'function') {
			onAlways = options;
		} else {
			extend(this.options, options);
		}

		if (onAlways) {
			this.on('always', onAlways);
		}

		this.getImages();

		if ($) {
			// add jQuery Deferred object
			this.jqDeferred = new $.Deferred();
		}

		// HACK check async to allow time to bind listeners
		setTimeout(this.check.bind(this));
	}

	ImagesLoaded.prototype = Object.create(EvEmitter.prototype);

	ImagesLoaded.prototype.options = {};

	ImagesLoaded.prototype.getImages = function () {
		this.images = [];

		// filter & find items if we have an item selector
		this.elements.forEach(this.addElementImages, this);
	};

	/**
	 * @param {Node} element
	 */
	ImagesLoaded.prototype.addElementImages = function (elem) {
		// filter siblings
		if (elem.nodeName == 'IMG') {
			this.addImage(elem);
		}
		// get background image on element
		if (this.options.background === true) {
			this.addElementBackgroundImages(elem);
		}

		// find children
		// no non-element nodes, #143
		var nodeType = elem.nodeType;
		if (!nodeType || !elementNodeTypes[nodeType]) {
			return;
		}
		var childImgs = elem.querySelectorAll('img');
		// concat childElems to filterFound array
		for (var i = 0; i < childImgs.length; i++) {
			var img = childImgs[i];
			this.addImage(img);
		}

		// get child background images
		if (typeof this.options.background == 'string') {
			var children = elem.querySelectorAll(this.options.background);
			for (i = 0; i < children.length; i++) {
				var child = children[i];
				this.addElementBackgroundImages(child);
			}
		}
	};

	var elementNodeTypes = {
		1: true,
		9: true,
		11: true
	};

	ImagesLoaded.prototype.addElementBackgroundImages = function (elem) {
		var style = getComputedStyle(elem);
		if (!style) {
			// Firefox returns null if in a hidden iframe https://bugzil.la/548397
			return;
		}
		// get url inside url("...")
		var reURL = /url\((['"])?(.*?)\1\)/gi;
		var matches = reURL.exec(style.backgroundImage);
		while (matches !== null) {
			var url = matches && matches[2];
			if (url) {
				this.addBackground(url, elem);
			}
			matches = reURL.exec(style.backgroundImage);
		}
	};

	/**
	 * @param {Image} img
	 */
	ImagesLoaded.prototype.addImage = function (img) {
		var loadingImage = new LoadingImage(img);
		this.images.push(loadingImage);
	};

	ImagesLoaded.prototype.addBackground = function (url, elem) {
		var background = new Background(url, elem);
		this.images.push(background);
	};

	ImagesLoaded.prototype.check = function () {
		var _this = this;
		this.progressedCount = 0;
		this.hasAnyBroken = false;
		// complete if no images
		if (!this.images.length) {
			this.complete();
			return;
		}

		function onProgress(image, elem, message) {
			// HACK - Chrome triggers event before object properties have changed. #83
			setTimeout(function () {
				_this.progress(image, elem, message);
			});
		}

		this.images.forEach(function (loadingImage) {
			loadingImage.once('progress', onProgress);
			loadingImage.check();
		});
	};

	ImagesLoaded.prototype.progress = function (image, elem, message) {
		this.progressedCount++;
		this.hasAnyBroken = this.hasAnyBroken || !image.isLoaded;
		// progress event
		this.emitEvent('progress', [this, image, elem]);
		if (this.jqDeferred && this.jqDeferred.notify) {
			this.jqDeferred.notify(this, image);
		}
		// check if completed
		if (this.progressedCount == this.images.length) {
			this.complete();
		}

		if (this.options.debug && console) {
			console.log('progress: ' + message, image, elem);
		}
	};

	ImagesLoaded.prototype.complete = function () {
		var eventName = this.hasAnyBroken ? 'fail' : 'done';
		this.isComplete = true;
		this.emitEvent(eventName, [this]);
		this.emitEvent('always', [this]);
		if (this.jqDeferred) {
			var jqMethod = this.hasAnyBroken ? 'reject' : 'resolve';
			this.jqDeferred[jqMethod](this);
		}
	};

	// --------------------------  -------------------------- //

	function LoadingImage(img) {
		this.img = img;
	}

	LoadingImage.prototype = Object.create(EvEmitter.prototype);

	LoadingImage.prototype.check = function () {
		// If complete is true and browser supports natural sizes,
		// try to check for image status manually.
		var isComplete = this.getIsImageComplete();
		if (isComplete) {
			// report based on naturalWidth
			this.confirm(this.img.naturalWidth !== 0, 'naturalWidth');
			return;
		}

		// If none of the checks above matched, simulate loading on detached element.
		this.proxyImage = new Image();
		this.proxyImage.addEventListener('load', this);
		this.proxyImage.addEventListener('error', this);
		// bind to image as well for Firefox. #191
		this.img.addEventListener('load', this);
		this.img.addEventListener('error', this);
		this.proxyImage.src = this.img.src;
	};

	LoadingImage.prototype.getIsImageComplete = function () {
		// check for non-zero, non-undefined naturalWidth
		// fixes Safari+InfiniteScroll+Masonry bug infinite-scroll#671
		return this.img.complete && this.img.naturalWidth;
	};

	LoadingImage.prototype.confirm = function (isLoaded, message) {
		this.isLoaded = isLoaded;
		this.emitEvent('progress', [this, this.img, message]);
	};

	// ----- events ----- //

	// trigger specified handler for event type
	LoadingImage.prototype.handleEvent = function (event) {
		var method = 'on' + event.type;
		if (this[method]) {
			this[method](event);
		}
	};

	LoadingImage.prototype.onload = function () {
		this.confirm(true, 'onload');
		this.unbindEvents();
	};

	LoadingImage.prototype.onerror = function () {
		this.confirm(false, 'onerror');
		this.unbindEvents();
	};

	LoadingImage.prototype.unbindEvents = function () {
		this.proxyImage.removeEventListener('load', this);
		this.proxyImage.removeEventListener('error', this);
		this.img.removeEventListener('load', this);
		this.img.removeEventListener('error', this);
	};

	// -------------------------- Background -------------------------- //

	function Background(url, element) {
		this.url = url;
		this.element = element;
		this.img = new Image();
	}

	// inherit LoadingImage prototype
	Background.prototype = Object.create(LoadingImage.prototype);

	Background.prototype.check = function () {
		this.img.addEventListener('load', this);
		this.img.addEventListener('error', this);
		this.img.src = this.url;
		// check if image is already complete
		var isComplete = this.getIsImageComplete();
		if (isComplete) {
			this.confirm(this.img.naturalWidth !== 0, 'naturalWidth');
			this.unbindEvents();
		}
	};

	Background.prototype.unbindEvents = function () {
		this.img.removeEventListener('load', this);
		this.img.removeEventListener('error', this);
	};

	Background.prototype.confirm = function (isLoaded, message) {
		this.isLoaded = isLoaded;
		this.emitEvent('progress', [this, this.element, message]);
	};

	// -------------------------- jQuery -------------------------- //

	ImagesLoaded.makeJQueryPlugin = function (jQuery) {
		jQuery = jQuery || window.jQuery;
		if (!jQuery) {
			return;
		}
		// set local variable
		$ = jQuery;
		// $().imagesLoaded()
		$.fn.imagesLoaded = function (options, callback) {
			var instance = new ImagesLoaded(this, options, callback);
			return instance.jqDeferred.promise($(this));
		};
	};
	// try making plugin
	ImagesLoaded.makeJQueryPlugin();

	// --------------------------  -------------------------- //

	return ImagesLoaded;

});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var LazyLoad = function () {
	'use strict';

	var defaultSettings = {
		elements_selector: "img",
		container: document,
		threshold: 300,
		thresholds: null,
		data_src: "src",
		data_srcset: "srcset",
		data_sizes: "sizes",
		data_bg: "bg",
		class_loading: "loading",
		class_loaded: "loaded",
		class_error: "error",
		load_delay: 0,
		callback_load: null,
		callback_error: null,
		callback_set: null,
		callback_enter: null,
		callback_finish: null,
		to_webp: false
	};

	var getInstanceSettings = function getInstanceSettings(customSettings) {
		return _extends({}, defaultSettings, customSettings);
	};

	var dataPrefix = "data-";
	var processedDataName = "was-processed";
	var timeoutDataName = "ll-timeout";
	var trueString = "true";

	var getData = function getData(element, attribute) {
		return element.getAttribute(dataPrefix + attribute);
	};

	var setData = function setData(element, attribute, value) {
		var attrName = dataPrefix + attribute;
		if (value === null) {
			element.removeAttribute(attrName);
			return;
		}
		element.setAttribute(attrName, value);
	};

	var setWasProcessedData = function setWasProcessedData(element) {
		return setData(element, processedDataName, trueString);
	};

	var getWasProcessedData = function getWasProcessedData(element) {
		return getData(element, processedDataName) === trueString;
	};

	var setTimeoutData = function setTimeoutData(element, value) {
		return setData(element, timeoutDataName, value);
	};

	var getTimeoutData = function getTimeoutData(element) {
		return getData(element, timeoutDataName);
	};

	var purgeProcessedElements = function purgeProcessedElements(elements) {
		return elements.filter(function (element) {
			return !getWasProcessedData(element);
		});
	};

	var purgeOneElement = function purgeOneElement(elements, elementToPurge) {
		return elements.filter(function (element) {
			return element !== elementToPurge;
		});
	};

	/* Creates instance and notifies it through the window element */
	var createInstance = function createInstance(classObj, options) {
		var event;
		var eventString = "LazyLoad::Initialized";
		var instance = new classObj(options);
		try {
			// Works in modern browsers
			event = new CustomEvent(eventString, { detail: { instance: instance } });
		} catch (err) {
			// Works in Internet Explorer (all versions)
			event = document.createEvent("CustomEvent");
			event.initCustomEvent(eventString, false, false, { instance: instance });
		}
		window.dispatchEvent(event);
	};

	/* Auto initialization of one or more instances of lazyload, depending on the
     options passed in (plain object or an array) */
	function autoInitialize(classObj, options) {
		if (!options) {
			return;
		}
		if (!options.length) {
			// Plain object
			createInstance(classObj, options);
		} else {
			// Array of objects
			for (var i = 0, optionsItem; (optionsItem = options[i]); i += 1) {
				createInstance(classObj, optionsItem);
			}
		}
	}

	var replaceExtToWebp = function replaceExtToWebp(value, condition) {
		return condition ? value.replace(/\.(jpe?g|png)/gi, ".webp") : value;
	};

	var detectWebp = function detectWebp() {
		var webpString = "image/webp";
		var canvas = document.createElement("canvas");

		if (canvas.getContext && canvas.getContext("2d")) {
			return canvas.toDataURL(webpString).indexOf("data:" + webpString) === 0;
		}

		return false;
	};

	var runningOnBrowser = typeof window !== "undefined";

	var isBot = runningOnBrowser && !("onscroll" in window) || /(gle|ing|ro)bot|crawl|spider/i.test(navigator.userAgent);

	var supportsIntersectionObserver = runningOnBrowser && "IntersectionObserver" in window;

	var supportsClassList = runningOnBrowser && "classList" in document.createElement("p");

	var supportsWebp = runningOnBrowser && detectWebp();

	var setSourcesInChildren = function setSourcesInChildren(parentTag, attrName, dataAttrName, toWebpFlag) {
		for (var i = 0, childTag; (childTag = parentTag.children[i]); i += 1) {
			if (childTag.tagName === "SOURCE") {
				var attrValue = getData(childTag, dataAttrName);
				setAttributeIfValue(childTag, attrName, attrValue, toWebpFlag);
			}
		}
	};

	var setAttributeIfValue = function setAttributeIfValue(element, attrName, value, toWebpFlag) {
		if (!value) {
			return;
		}
		element.setAttribute(attrName, replaceExtToWebp(value, toWebpFlag));
	};

	var setSourcesImg = function setSourcesImg(element, settings) {
		var toWebpFlag = supportsWebp && settings.to_webp;
		var srcsetDataName = settings.data_srcset;
		var parent = element.parentNode;

		if (parent && parent.tagName === "PICTURE") {
			setSourcesInChildren(parent, "srcset", srcsetDataName, toWebpFlag);
		}
		var sizesDataValue = getData(element, settings.data_sizes);
		setAttributeIfValue(element, "sizes", sizesDataValue);
		var srcsetDataValue = getData(element, srcsetDataName);
		setAttributeIfValue(element, "srcset", srcsetDataValue, toWebpFlag);
		var srcDataValue = getData(element, settings.data_src);
		setAttributeIfValue(element, "src", srcDataValue, toWebpFlag);
	};

	var setSourcesIframe = function setSourcesIframe(element, settings) {
		var srcDataValue = getData(element, settings.data_src);

		setAttributeIfValue(element, "src", srcDataValue);
	};

	var setSourcesVideo = function setSourcesVideo(element, settings) {
		var srcDataName = settings.data_src;
		var srcDataValue = getData(element, srcDataName);

		setSourcesInChildren(element, "src", srcDataName);
		setAttributeIfValue(element, "src", srcDataValue);
		element.load();
	};

	var setSourcesBgImage = function setSourcesBgImage(element, settings) {
		var toWebpFlag = supportsWebp && settings.to_webp;
		var srcDataValue = getData(element, settings.data_src);
		var bgDataValue = getData(element, settings.data_bg);

		if (srcDataValue) {
			var setValue = replaceExtToWebp(srcDataValue, toWebpFlag);
			element.style.backgroundImage = "url(\"" + setValue + "\")";
		}

		if (bgDataValue) {
			var _setValue = replaceExtToWebp(bgDataValue, toWebpFlag);
			element.style.backgroundImage = _setValue;
		}
	};

	var setSourcesFunctions = {
		IMG: setSourcesImg,
		IFRAME: setSourcesIframe,
		VIDEO: setSourcesVideo
	};

	var setSources = function setSources(element, instance) {
		var settings = instance._settings;
		var tagName = element.tagName;
		var setSourcesFunction = setSourcesFunctions[tagName];
		if (setSourcesFunction) {
			setSourcesFunction(element, settings);
			instance._updateLoadingCount(1);
			instance._elements = purgeOneElement(instance._elements, element);
			return;
		}
		setSourcesBgImage(element, settings);
	};

	var addClass = function addClass(element, className) {
		if (supportsClassList) {
			element.classList.add(className);
			return;
		}
		element.className += (element.className ? " " : "") + className;
	};

	var removeClass = function removeClass(element, className) {
		if (supportsClassList) {
			element.classList.remove(className);
			return;
		}
		element.className = element.className.replace(new RegExp("(^|\\s+)" + className + "(\\s+|$)"), " ").replace(/^\s+/, "").replace(/\s+$/, "");
	};

	var callbackIfSet = function callbackIfSet(callback, argument) {
		if (callback) {
			callback(argument);
		}
	};

	var genericLoadEventName = "load";
	var mediaLoadEventName = "loadeddata";
	var errorEventName = "error";

	var addEventListener = function addEventListener(element, eventName, handler) {
		element.addEventListener(eventName, handler);
	};

	var removeEventListener = function removeEventListener(element, eventName, handler) {
		element.removeEventListener(eventName, handler);
	};

	var addEventListeners = function addEventListeners(element, loadHandler, errorHandler) {
		addEventListener(element, genericLoadEventName, loadHandler);
		addEventListener(element, mediaLoadEventName, loadHandler);
		addEventListener(element, errorEventName, errorHandler);
	};

	var removeEventListeners = function removeEventListeners(element, loadHandler, errorHandler) {
		removeEventListener(element, genericLoadEventName, loadHandler);
		removeEventListener(element, mediaLoadEventName, loadHandler);
		removeEventListener(element, errorEventName, errorHandler);
	};

	var eventHandler = function eventHandler(event, success, instance) {
		var settings = instance._settings;
		var className = success ? settings.class_loaded : settings.class_error;
		var callback = success ? settings.callback_load : settings.callback_error;
		var element = event.target;

		removeClass(element, settings.class_loading);
		addClass(element, className);
		callbackIfSet(callback, element);

		instance._updateLoadingCount(-1);
	};

	var addOneShotEventListeners = function addOneShotEventListeners(element, instance) {
		var loadHandler = function loadHandler(event) {
			eventHandler(event, true, instance);
			removeEventListeners(element, loadHandler, errorHandler);
		};
		var errorHandler = function errorHandler(event) {
			eventHandler(event, false, instance);
			removeEventListeners(element, loadHandler, errorHandler);
		};
		addEventListeners(element, loadHandler, errorHandler);
	};

	var managedTags = ["IMG", "IFRAME", "VIDEO"];

	var loadAndUnobserve = function loadAndUnobserve(element, observer, instance) {
		revealElement(element, instance);
		observer.unobserve(element);
	};

	var cancelDelayLoad = function cancelDelayLoad(element) {
		var timeoutId = getTimeoutData(element);
		if (!timeoutId) {
			return; // do nothing if timeout doesn't exist
		}
		clearTimeout(timeoutId);
		setTimeoutData(element, null);
	};

	var delayLoad = function delayLoad(element, observer, instance) {
		var loadDelay = instance._settings.load_delay;
		var timeoutId = getTimeoutData(element);
		if (timeoutId) {
			return; // do nothing if timeout already set
		}
		timeoutId = setTimeout(function () {
			loadAndUnobserve(element, observer, instance);
			cancelDelayLoad(element);
		}, loadDelay);
		setTimeoutData(element, timeoutId);
	};

	function revealElement(element, instance, force) {
		var settings = instance._settings;
		if (!force && getWasProcessedData(element)) {
			return; // element has already been processed and force wasn't true
		}
		callbackIfSet(settings.callback_enter, element);
		if (managedTags.indexOf(element.tagName) > -1) {
			addOneShotEventListeners(element, instance);
			addClass(element, settings.class_loading);
		}
		setSources(element, instance);
		setWasProcessedData(element);
		callbackIfSet(settings.callback_set, element);
	}

	/* entry.isIntersecting needs fallback because is null on some versions of MS Edge, and
    entry.intersectionRatio is not enough alone because it could be 0 on some intersecting elements */
	var isIntersecting = function isIntersecting(entry) {
		return entry.isIntersecting || entry.intersectionRatio > 0;
	};

	var getObserverSettings = function getObserverSettings(settings) {
		return {
			root: settings.container === document ? null : settings.container,
			rootMargin: settings.thresholds || settings.threshold + "px"
		};
	};

	var LazyLoad = function LazyLoad(customSettings, elements) {
		this._settings = getInstanceSettings(customSettings);
		this._setObserver();
		this._loadingCount = 0;
		this.update(elements);
	};

	LazyLoad.prototype = {
		_manageIntersection: function _manageIntersection(entry) {
			var observer = this._observer;
			var loadDelay = this._settings.load_delay;
			var element = entry.target;

			// WITHOUT LOAD DELAY
			if (!loadDelay) {
				if (isIntersecting(entry)) {
					loadAndUnobserve(element, observer, this);
				}
				return;
			}

			// WITH LOAD DELAY
			if (isIntersecting(entry)) {
				delayLoad(element, observer, this);
			} else {
				cancelDelayLoad(element);
			}
		},

		_onIntersection: function _onIntersection(entries) {
			entries.forEach(this._manageIntersection.bind(this));
		},

		_setObserver: function _setObserver() {
			if (!supportsIntersectionObserver) {
				return;
			}
			this._observer = new IntersectionObserver(this._onIntersection.bind(this), getObserverSettings(this._settings));
		},

		_updateLoadingCount: function _updateLoadingCount(plusMinus) {
			this._loadingCount += plusMinus;
			if (this._elements.length === 0 && this._loadingCount === 0) {
				callbackIfSet(this._settings.callback_finish);
			}
		},

		update: function update(elements) {
			var _this = this;

			var settings = this._settings;
			var nodeSet = elements || settings.container.querySelectorAll(settings.elements_selector);

			this._elements = purgeProcessedElements(Array.prototype.slice.call(nodeSet) // NOTE: nodeset to array for IE compatibility
			);

			if (isBot || !this._observer) {
				this.loadAll();
				return;
			}

			this._elements.forEach(function (element) {
				_this._observer.observe(element);
			});
		},

		destroy: function destroy() {
			var _this2 = this;

			if (this._observer) {
				this._elements.forEach(function (element) {
					_this2._observer.unobserve(element);
				});
				this._observer = null;
			}
			this._elements = null;
			this._settings = null;
		},

		load: function load(element, force) {
			revealElement(element, this, force);
		},

		loadAll: function loadAll() {
			var _this3 = this;

			var elements = this._elements;
			elements.forEach(function (element) {
				_this3.load(element);
			});
		}
	};

	/* Automatic instances creation if required (useful for async script loading) */
	if (runningOnBrowser) {
		autoInitialize(LazyLoad, window.lazyLoadOptions);
	}

	return LazyLoad;
}();

/*global define, global, module, require, self, picturefill */
/**!
 * lightgallery.js | 1.0.3 | August 8th 2018
 * http://sachinchoolur.github.io/lightgallery.js/
 * Copyright (c) 2016 Sachin N;
 * @license GPLv3
 */
(function (f) {
	if (typeof exports === "object" && typeof module !== "undefined") {
		module.exports = f();
	} else if (typeof define === "function" && define.amd) {
		define([], f);
	} else {
		var g;
		if (typeof window !== "undefined") {
			g = window;
		} else if (typeof global !== "undefined") {
			g = global;
		} else if (typeof self !== "undefined") {
			g = self;
		} else {
			g = this;
		}
		g.Lightgallery = f();
	}
})(function () {
	var define,
	module,
	exports;
	return (function () {
		function r(e, n, t) {
			function o(i, f) {
				if (!n[i]) {
					if (!e[i]) {
						var c = "function" == typeof require && require;
						if (!f && c)
							return c(i, !0);
						if (u)
							return u(i, !0);
						var a = new Error("Cannot find module '" + i + "'");
						throw (a.code = "MODULE_NOT_FOUND", a);
					}
					var p = n[i] = {
						exports: {}
					};
					e[i][0].call(p.exports, function (r) {
						var n = e[i][1][r];
						return o(n || r);
					}, p, p.exports, r, e, n, t);
				}
				return n[i].exports;
			}
			for (var u = "function" == typeof require && require, i = 0; i < t.length; i++)
				o(t[i]);
			return o;
		}
		return r;
	})()({
		1: [function (require, module, exports) {
				(function (global, factory) {
					if (typeof define === "function" && define.amd) {
						define(['exports'], factory);
					} else if (typeof exports !== "undefined") {
						factory(exports);
					} else {
						var mod = {
							exports: {}
						};
						factory(mod.exports);
						global.lgUtils = mod.exports;
					}
				})(this, function (exports) {
					'use strict';
					Object.defineProperty(exports, "__esModule", {
						value: true
					});
					/*
					 *@todo remove function from window and document. Update on and off functions
					 */
					window.getAttribute = function (label) {
						return window[label];
					};
					window.setAttribute = function (label, value) {
						window[label] = value;
					};
					document.getAttribute = function (label) {
						return document[label];
					};
					document.setAttribute = function (label, value) {
						document[label] = value;
					};
					var utils = {
						wrap: function wrap(el, className) {
							if (!el) {
								return;
							}
							var wrapper = document.createElement('div');
							wrapper.className = className;
							el.parentNode.insertBefore(wrapper, el);
							el.parentNode.removeChild(el);
							wrapper.appendChild(el);
						},
						addClass: function addClass(el, className) {
							if (!el) {
								return;
							}
							if (el.classList) {
								el.classList.add(className);
							} else {
								el.className += ' ' + className;
							}
						},
						removeClass: function removeClass(el, className) {
							if (!el) {
								return;
							}
							if (el.classList) {
								el.classList.remove(className);
							} else {
								el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
							}
						},
						hasClass: function hasClass(el, className) {
							if (el.classList) {
								return el.classList.contains(className);
							} else {
								return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
							}
							return false;
						},
						// ex Transform
						// ex TransitionTimingFunction
						setVendor: function setVendor(el, property, value) {
							if (!el) {
								return;
							}
							el.style[property.charAt(0).toLowerCase() + property.slice(1)] = value;
							el.style['webkit' + property] = value;
							el.style['moz' + property] = value;
							el.style['ms' + property] = value;
							el.style['o' + property] = value;
						},
						trigger: function trigger(el, event) {
							var detail = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
							if (!el) {
								return;
							}
							var customEvent = new CustomEvent(event, {
									detail: detail
								});
							el.dispatchEvent(customEvent);
						},
						Listener: {
							uid: 0
						},
						on: function on(el, events, fn) {
							if (!el) {
								return;
							}
							events.split(' ').forEach(function (event) {
								var _id = el.getAttribute('lg-event-uid') || '';
								utils.Listener.uid++;
								_id += '&' + utils.Listener.uid;
								el.setAttribute('lg-event-uid', _id);
								utils.Listener[event + utils.Listener.uid] = fn;
								el.addEventListener(event.split('.')[0], fn, false);
							});
						},
						off: function off(el, event) {
							if (!el) {
								return;
							}
							var _id = el.getAttribute('lg-event-uid');
							if (_id) {
								_id = _id.split('&');
								for (var i = 0; i < _id.length; i++) {
									if (_id[i]) {
										var _event = event + _id[i];
										if (_event.substring(0, 1) === '.') {
											for (var key in utils.Listener) {
												if (utils.Listener.hasOwnProperty(key)) {
													if (key.split('.').indexOf(_event.split('.')[1]) > -1) {
														el.removeEventListener(key.split('.')[0], utils.Listener[key]);
														el.setAttribute('lg-event-uid', el.getAttribute('lg-event-uid').replace('&' + _id[i], ''));
														delete utils.Listener[key];
													}
												}
											}
										} else {
											el.removeEventListener(_event.split('.')[0], utils.Listener[_event]);
											el.setAttribute('lg-event-uid', el.getAttribute('lg-event-uid').replace('&' + _id[i], ''));
											delete utils.Listener[_event];
										}
									}
								}
							}
						},
						param: function param(obj) {
							return Object.keys(obj).map(function (k) {
								return encodeURIComponent(k) + '=' + encodeURIComponent(obj[k]);
							}).join('&');
						}
					};
					exports.
				default = utils;
				});
			}, {}
		],
		2: [function (require, module, exports) {
				(function (global, factory) {
					if (typeof define === "function" && define.amd) {
						define(['./lg-utils'], factory);
					} else if (typeof exports !== "undefined") {
						factory(require('./lg-utils'));
					} else {
						var mod = {
							exports: {}
						};
						factory(global.lgUtils);
						global.lightgallery = mod.exports;
					}
				})(this, function (_lgUtils) {
					'use strict';
					var _lgUtils2 = _interopRequireDefault(_lgUtils);
					function _interopRequireDefault(obj) {
						return obj && obj.__esModule ? obj : {
						default:
							obj
						};
					}
					var _extends = Object.assign || function (target) {
						for (var i = 1; i < arguments.length; i++) {
							var source = arguments[i];
							for (var key in source) {
								if (Object.prototype.hasOwnProperty.call(source, key)) {
									target[key] = source[key];
								}
							}
						}
						return target;
					};
					/** Polyfill the CustomEvent() constructor functionality in Internet Explorer 9 and higher */
					(function () {
						if (typeof window.CustomEvent === 'function') {
							return false;
						}
						function CustomEvent(event, params) {
							params = params || {
								bubbles: false,
								cancelable: false,
								detail: undefined
							};
							var evt = document.createEvent('CustomEvent');
							evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
							return evt;
						}
						CustomEvent.prototype = window.Event.prototype;
						window.CustomEvent = CustomEvent;
					})();
					window.utils = _lgUtils2.
					default;
						window.lgData = {
							uid: 0
						};
						window.lgModules = {};
						var defaults = {
							mode: 'lg-slide',
							// Ex : 'ease'
							cssEasing: 'ease',
							//'for jquery animation'
							easing: 'linear',
							speed: 600,
							height: '100%',
							width: '100%',
							addClass: '',
							startClass: 'lg-start-zoom',
							backdropDuration: 150,
							hideBarsDelay: 6000,
							useLeft: false,
							closable: true,
							loop: true,
							escKey: true,
							keyPress: true,
							controls: true,
							slideEndAnimatoin: true,
							hideControlOnEnd: false,
							mousewheel: false,
							getCaptionFromTitleOrAlt: true,
							// .lg-item || '.lg-sub-html'
							appendSubHtmlTo: '.lg-sub-html',
							subHtmlSelectorRelative: false,
							/**
							 * @desc number of preload slides
							 * will exicute only after the current slide is fully loaded.
							 *
							 * @ex you clicked on 4th image and if preload = 1 then 3rd slide and 5th
							 * slide will be loaded in the background after the 4th slide is fully loaded..
							 * if preload is 2 then 2nd 3rd 5th 6th slides will be preloaded.. ... ...
							 *
							 */
							preload: 1,
							showAfterLoad: true,
							selector: '',
							selectWithin: '',
							nextHtml: '',
							prevHtml: '',
							// 0, 1
							index: false,
							iframeMaxWidth: '100%',
							download: true,
							counter: true,
							appendCounterTo: '.lg-toolbar',
							swipeThreshold: 50,
							enableSwipe: true,
							enableDrag: true,
							dynamic: false,
							dynamicEl: [],
							galleryId: 1
						};
						function Plugin(element, options) {
							// Current lightGallery element
							this.el = element;
							// lightGallery settings
							this.s = _extends({}, defaults, options);
							// When using dynamic mode, ensure dynamicEl is an array
							if (this.s.dynamic && this.s.dynamicEl !== 'undefined' && this.s.dynamicEl.constructor === Array && !this.s.dynamicEl.length) {
								throw 'When using dynamic mode, you must also define dynamicEl as an Array.';
							}
							// lightGallery modules
							this.modules = {};
							// false when lightgallery complete first slide;
							this.lGalleryOn = false;
							this.lgBusy = false;
							// Timeout function for hiding controls;
							this.hideBartimeout = false;
							// To determine browser supports for touch events;
							this.isTouch = 'ontouchstart' in document.documentElement;
							// Disable hideControlOnEnd if sildeEndAnimation is true
							if (this.s.slideEndAnimatoin) {
								this.s.hideControlOnEnd = false;
							}
							this.items = [];
							// Gallery items
							if (this.s.dynamic) {
								this.items = this.s.dynamicEl;
							} else {
								if (this.s.selector === 'this') {
									this.items.push(this.el);
								} else if (this.s.selector !== '') {
									if (this.s.selectWithin) {
										this.items = document.querySelector(this.s.selectWithin).querySelectorAll(this.s.selector);
									} else {
										this.items = this.el.querySelectorAll(this.s.selector);
									}
								} else {
									this.items = this.el.children;
								}
							}
							// .lg-item
							this.___slide = '';
							// .lg-outer
							this.outer = '';
							this.init();
							return this;
						}
						Plugin.prototype.init = function () {
							var _this = this;
							// s.preload should not be more than $item.length
							if (_this.s.preload > _this.items.length) {
								_this.s.preload = _this.items.length;
							}
							// if dynamic option is enabled execute immediately
							var _hash = window.location.hash;
							if (_hash.indexOf('lg=' + this.s.galleryId) > 0) {
								_this.index = parseInt(_hash.split('&slide=')[1], 10);
								_lgUtils2.
							default.addClass(document.body, 'lg-from-hash');
								if (!_lgUtils2.
								default.hasClass(document.body, 'lg-on')) {
										_lgUtils2.
									default.addClass(document.body, 'lg-on');
										setTimeout(function () {
											_this.build(_this.index);
										});
									}
							}
							if (_this.s.dynamic) {
								_lgUtils2.
							default.trigger(this.el, 'onBeforeOpen');
								_this.index = _this.s.index || 0;
								// prevent accidental double execution
								if (!_lgUtils2.
								default.hasClass(document.body, 'lg-on')) {
										_lgUtils2.
									default.addClass(document.body, 'lg-on');
										setTimeout(function () {
											_this.build(_this.index);
										});
									}
							} else {
								for (var i = 0; i < _this.items.length; i++) {
									/*jshint loopfunc: true */
									(function (index) {
										// Using different namespace for click because click event should not unbind if selector is same object('this')
										_lgUtils2.
									default.on(_this.items[index], 'click.lgcustom', function (e) {
											e.preventDefault();
											_lgUtils2.
										default.trigger(_this.el, 'onBeforeOpen');
											_this.index = _this.s.index || index;
											if (!_lgUtils2.
											default.hasClass(document.body, 'lg-on')) {
													_this.build(_this.index);
													_lgUtils2.
												default.addClass(document.body, 'lg-on');
												}
										});
									})(i);
								}
							}
						};
						Plugin.prototype.build = function (index) {
							var _this = this;
							_this.structure();
							for (var key in window.lgModules) {
								if (window.lgModules.hasOwnProperty(key)) {
									_this.modules[key] = new window.lgModules[key](_this.el);
								}
							}
							// initiate slide function
							_this.slide(index, false, false);
							if (_this.s.keyPress) {
								_this.keyPress();
							}
							if (_this.items.length > 1) {
								_this.arrow();
								setTimeout(function () {
									_this.enableDrag();
									_this.enableSwipe();
								}, 50);
								if (_this.s.mousewheel) {
									_this.mousewheel();
								}
							}
							_this.counter();
							_this.closeGallery();
							_lgUtils2.
						default.trigger(_this.el, 'onAfterOpen');
							// Hide controllers if mouse doesn't move for some period
							_lgUtils2.
						default.on(_this.outer, 'mousemove.lg click.lg touchstart.lg', function () {
								_lgUtils2.
							default.removeClass(_this.outer, 'lg-hide-items');
								clearTimeout(_this.hideBartimeout);
								// Timeout will be cleared on each slide movement also
								_this.hideBartimeout = setTimeout(function () {
										_lgUtils2.
									default.addClass(_this.outer, 'lg-hide-items');
									}, _this.s.hideBarsDelay);
							});
						};
						Plugin.prototype.structure = function () {
							var list = '';
							var controls = '';
							var i = 0;
							var subHtmlCont = '';
							var template;
							var _this = this;
							document.body.insertAdjacentHTML('beforeend', '<div class="lg-backdrop"></div>');
							_lgUtils2.
						default.setVendor(document.querySelector('.lg-backdrop'), 'TransitionDuration', this.s.backdropDuration + 'ms');
							// Create gallery items
							for (i = 0; i < this.items.length; i++) {
								list += '<div class="lg-item"></div>';
							}
							// Create controlls
							if (this.s.controls && this.items.length > 1) {
								controls = '<div class="lg-actions">' + '<div class="lg-prev lg-icon">' + this.s.prevHtml + '</div>' + '<div class="lg-next lg-icon">' + this.s.nextHtml + '</div>' + '</div>';
							}
							if (this.s.appendSubHtmlTo === '.lg-sub-html') {
								subHtmlCont = '<div class="lg-sub-html"></div>';
							}
							template = '<div class="lg-outer ' + this.s.addClass + ' ' + this.s.startClass + '">' + '<div class="lg" style="width:' + this.s.width + '; height:' + this.s.height + '">' + '<div class="lg-inner">' + list + '</div>' + '<div class="lg-toolbar group">' + '<span class="lg-close lg-icon"></span>' + '</div>' + controls + subHtmlCont + '</div>' + '</div>';
							document.body.insertAdjacentHTML('beforeend', template);
							this.outer = document.querySelector('.lg-outer');
							this.___slide = this.outer.querySelectorAll('.lg-item');
							if (this.s.useLeft) {
								_lgUtils2.
							default.addClass(this.outer, 'lg-use-left');
								// Set mode lg-slide if use left is true;
								this.s.mode = 'lg-slide';
							} else {
								_lgUtils2.
							default.addClass(this.outer, 'lg-use-css3');
							}
							// For fixed height gallery
							_this.setTop();
							_lgUtils2.
						default.on(window, 'resize.lg orientationchange.lg', function () {
								setTimeout(function () {
									_this.setTop();
								}, 100);
							});
							// add class lg-current to remove initial transition
							_lgUtils2.
						default.addClass(this.___slide[this.index], 'lg-current');
							// add Class for css support and transition mode
							if (this.doCss()) {
								_lgUtils2.
							default.addClass(this.outer, 'lg-css3');
							} else {
								_lgUtils2.
							default.addClass(this.outer, 'lg-css');
								// Set speed 0 because no animation will happen if browser doesn't support css3
								this.s.speed = 0;
							}
							_lgUtils2.
						default.addClass(this.outer, this.s.mode);
							if (this.s.enableDrag && this.items.length > 1) {
								_lgUtils2.
							default.addClass(this.outer, 'lg-grab');
							}
							if (this.s.showAfterLoad) {
								_lgUtils2.
							default.addClass(this.outer, 'lg-show-after-load');
							}
							if (this.doCss()) {
								var inner = this.outer.querySelector('.lg-inner');
								_lgUtils2.
							default.setVendor(inner, 'TransitionTimingFunction', this.s.cssEasing);
								_lgUtils2.
							default.setVendor(inner, 'TransitionDuration', this.s.speed + 'ms');
							}
							setTimeout(function () {
								_lgUtils2.
							default.addClass(document.querySelector('.lg-backdrop'), 'in');
							});
							setTimeout(function () {
								_lgUtils2.
							default.addClass(_this.outer, 'lg-visible');
							}, this.s.backdropDuration);
							if (this.s.download) {
								this.outer.querySelector('.lg-toolbar').insertAdjacentHTML('beforeend', '<a id="lg-download" target="_blank" download class="lg-download lg-icon"></a>');
							}
							// Store the current scroll top value to scroll back after closing the gallery..
							this.prevScrollTop = document.documentElement.scrollTop || document.body.scrollTop;
						};
						// For fixed height gallery
						Plugin.prototype.setTop = function () {
							if (this.s.height !== '100%') {
								var wH = window.innerHeight;
								var top = (wH - parseInt(this.s.height, 10)) / 2;
								var lGallery = this.outer.querySelector('.lg');
								if (wH >= parseInt(this.s.height, 10)) {
									lGallery.style.top = top + 'px';
								} else {
									lGallery.style.top = '0px';
								}
							}
						};
						// Find css3 support
						Plugin.prototype.doCss = function () {
							// check for css animation support
							var support = function support() {
								var transition = ['transition', 'MozTransition', 'WebkitTransition', 'OTransition', 'msTransition', 'KhtmlTransition'];
								var root = document.documentElement;
								var i = 0;
								for (i = 0; i < transition.length; i++) {
									if (transition[i]in root.style) {
										return true;
									}
								}
							};
							if (support()) {
								return true;
							}
							return false;
						};
						/**
						 *  @desc Check the given src is video
						 *  @param {String} src
						 *  @return {Object} video type
						 *  Ex:{ youtube  :  ["//www.youtube.com/watch?v=c0asJgSyxcY", "c0asJgSyxcY"] }
						 */
						Plugin.prototype.isVideo = function (src, index) {
							var html;
							if (this.s.dynamic) {
								html = this.s.dynamicEl[index].html;
							} else {
								html = this.items[index].getAttribute('data-html');
							}
							if (!src && html) {
								return {
									html5: true
								};
							}
							var youtube = src.match(/\/\/(?:www\.)?youtu(?:\.be|be\.com)\/(?:watch\?v=|embed\/)?([a-z0-9\-\_\%]+)/i);
							var vimeo = src.match(/\/\/(?:www\.)?vimeo.com\/([0-9a-z\-_]+)/i);
							var dailymotion = src.match(/\/\/(?:www\.)?dai.ly\/([0-9a-z\-_]+)/i);
							var vk = src.match(/\/\/(?:www\.)?(?:vk\.com|vkontakte\.ru)\/(?:video_ext\.php\?)(.*)/i);
							if (youtube) {
								return {
									youtube: youtube
								};
							} else if (vimeo) {
								return {
									vimeo: vimeo
								};
							} else if (dailymotion) {
								return {
									dailymotion: dailymotion
								};
							} else if (vk) {
								return {
									vk: vk
								};
							}
						};
						/**
						 *  @desc Create image counter
						 *  Ex: 1/10
						 */
						Plugin.prototype.counter = function () {
							if (this.s.counter) {
								this.outer.querySelector(this.s.appendCounterTo).insertAdjacentHTML('beforeend', '<div id="lg-counter"><span id="lg-counter-current">' + (parseInt(this.index, 10) + 1) + '</span> / <span id="lg-counter-all">' + this.items.length + '</span></div>');
							}
						};
						/**
						 *  @desc add sub-html into the slide
						 *  @param {Number} index - index of the slide
						 */
						Plugin.prototype.addHtml = function (index) {
							var subHtml = null;
							var currentEle;
							if (this.s.dynamic) {
								subHtml = this.s.dynamicEl[index].subHtml;
							} else {
								currentEle = this.items[index];
								subHtml = currentEle.getAttribute('data-sub-html');
								if (this.s.getCaptionFromTitleOrAlt && !subHtml) {
									subHtml = currentEle.getAttribute('title');
									if (subHtml && currentEle.querySelector('img')) {
										subHtml = currentEle.querySelector('img').getAttribute('alt');
									}
								}
							}
							if (typeof subHtml !== 'undefined' && subHtml !== null) {
								// get first letter of subhtml
								// if first letter starts with . or # get the html form the jQuery object
								var fL = subHtml.substring(0, 1);
								if (fL === '.' || fL === '#') {
									if (this.s.subHtmlSelectorRelative && !this.s.dynamic) {
										subHtml = currentEle.querySelector(subHtml).innerHTML;
									} else {
										subHtml = document.querySelector(subHtml).innerHTML;
									}
								}
							} else {
								subHtml = '';
							}
							if (this.s.appendSubHtmlTo === '.lg-sub-html') {
								this.outer.querySelector(this.s.appendSubHtmlTo).innerHTML = subHtml;
							} else {
								this.___slide[index].insertAdjacentHTML('beforeend', subHtml);
							}
							// Add lg-empty-html class if title doesn't exist
							if (typeof subHtml !== 'undefined' && subHtml !== null) {
								if (subHtml === '') {
									_lgUtils2.
								default.addClass(this.outer.querySelector(this.s.appendSubHtmlTo), 'lg-empty-html');
								} else {
									_lgUtils2.
								default.removeClass(this.outer.querySelector(this.s.appendSubHtmlTo), 'lg-empty-html');
								}
							}
							_lgUtils2.
						default.trigger(this.el, 'onAfterAppendSubHtml', {
								index: index
							});
						};
						/**
						 *  @desc Preload slides
						 *  @param {Number} index - index of the slide
						 */
						Plugin.prototype.preload = function (index) {
							var i = 1;
							var j = 1;
							for (i = 1; i <= this.s.preload; i++) {
								if (i >= this.items.length - index) {
									break;
								}
								this.loadContent(index + i, false, 0);
							}
							for (j = 1; j <= this.s.preload; j++) {
								if (index - j < 0) {
									break;
								}
								this.loadContent(index - j, false, 0);
							}
						};
						/**
						 *  @desc Load slide content into slide.
						 *  @param {Number} index - index of the slide.
						 *  @param {Boolean} rec - if true call loadcontent() function again.
						 *  @param {Boolean} delay - delay for adding complete class. it is 0 except first time.
						 */
						Plugin.prototype.loadContent = function (index, rec, delay) {
							var _this = this;
							var _hasPoster = false;
							var _img;
							var _src;
							var _poster;
							var _srcset;
							var _sizes;
							var _html;
							var getResponsiveSrc = function getResponsiveSrc(srcItms) {
								var rsWidth = [];
								var rsSrc = [];
								for (var i = 0; i < srcItms.length; i++) {
									var __src = srcItms[i].split(' ');
									// Manage empty space
									if (__src[0] === '') {
										__src.splice(0, 1);
									}
									rsSrc.push(__src[0]);
									rsWidth.push(__src[1]);
								}
								var wWidth = window.innerWidth;
								for (var j = 0; j < rsWidth.length; j++) {
									if (parseInt(rsWidth[j], 10) > wWidth) {
										_src = rsSrc[j];
										break;
									}
								}
							};
							if (_this.s.dynamic) {
								if (_this.s.dynamicEl[index].poster) {
									_hasPoster = true;
									_poster = _this.s.dynamicEl[index].poster;
								}
								_html = _this.s.dynamicEl[index].html;
								_src = _this.s.dynamicEl[index].src;
								if (_this.s.dynamicEl[index].responsive) {
									var srcDyItms = _this.s.dynamicEl[index].responsive.split(',');
									getResponsiveSrc(srcDyItms);
								}
								_srcset = _this.s.dynamicEl[index].srcset;
								_sizes = _this.s.dynamicEl[index].sizes;
							} else {
								if (_this.items[index].getAttribute('data-poster')) {
									_hasPoster = true;
									_poster = _this.items[index].getAttribute('data-poster');
								}
								_html = _this.items[index].getAttribute('data-html');
								_src = _this.items[index].getAttribute('href') || _this.items[index].getAttribute('data-src');
								if (_this.items[index].getAttribute('data-responsive')) {
									var srcItms = _this.items[index].getAttribute('data-responsive').split(',');
									getResponsiveSrc(srcItms);
								}
								_srcset = _this.items[index].getAttribute('data-srcset');
								_sizes = _this.items[index].getAttribute('data-sizes');
							}
							//if (_src || _srcset || _sizes || _poster) {
							var iframe = false;
							if (_this.s.dynamic) {
								if (_this.s.dynamicEl[index].iframe) {
									iframe = true;
								}
							} else {
								if (_this.items[index].getAttribute('data-iframe') === 'true') {
									iframe = true;
								}
							}
							var _isVideo = _this.isVideo(_src, index);
							if (!_lgUtils2.
							default.hasClass(_this.___slide[index], 'lg-loaded')) {
									if (iframe) {
										_this.___slide[index].insertAdjacentHTML('afterbegin', '<div class="lg-video-cont" style="max-width:' + _this.s.iframeMaxWidth + '"><div class="lg-video"><iframe class="lg-object" frameborder="0" src="' + _src + '"  allowfullscreen="true"></iframe></div></div>');
									} else if (_hasPoster) {
										var videoClass = '';
										if (_isVideo && _isVideo.youtube) {
											videoClass = 'lg-has-youtube';
										} else if (_isVideo && _isVideo.vimeo) {
											videoClass = 'lg-has-vimeo';
										} else {
											videoClass = 'lg-has-html5';
										}
										_this.___slide[index].insertAdjacentHTML('beforeend', '<div class="lg-video-cont ' + videoClass + ' "><div class="lg-video"><span class="lg-video-play"></span><img class="lg-object lg-has-poster" src="' + _poster + '" /></div></div>');
									} else if (_isVideo) {
										_this.___slide[index].insertAdjacentHTML('beforeend', '<div class="lg-video-cont "><div class="lg-video"></div></div>');
										_lgUtils2.
									default.trigger(_this.el, 'hasVideo', {
											index: index,
											src: _src,
											html: _html
										});
									} else {
										_this.___slide[index].insertAdjacentHTML('beforeend', '<div class="lg-img-wrap"><img class="lg-object lg-image" src="' + _src + '" /></div>');
									}
									_lgUtils2.
								default.trigger(_this.el, 'onAferAppendSlide', {
										index: index
									});
									_img = _this.___slide[index].querySelector('.lg-object');
									if (_sizes) {
										_img.setAttribute('sizes', _sizes);
									}
									if (_srcset) {
										_img.setAttribute('srcset', _srcset);
										try {
											picturefill({
												elements: [_img[0]]
											});
										} catch (e) {
											console.error('Make sure you have included Picturefill version 2');
										}
									}
									if (this.s.appendSubHtmlTo !== '.lg-sub-html') {
										_this.addHtml(index);
									}
									_lgUtils2.
								default.addClass(_this.___slide[index], 'lg-loaded');
								}
								_lgUtils2.
							default.on(_this.___slide[index].querySelector('.lg-object'), 'load.lg error.lg', function () {
									// For first time add some delay for displaying the start animation.
									var _speed = 0;
									// Do not change the delay value because it is required for zoom plugin.
									// If gallery opened from direct url (hash) speed value should be 0
									if (delay && !_lgUtils2.
									default.hasClass(document.body, 'lg-from-hash')) {
											_speed = delay;
										}
										setTimeout(function () {
											_lgUtils2.
										default.addClass(_this.___slide[index], 'lg-complete');
											_lgUtils2.
										default.trigger(_this.el, 'onSlideItemLoad', {
												index: index,
												delay: delay || 0
											});
										}, _speed);
								});
								// @todo check load state for html5 videos
								if (_isVideo && _isVideo.html5 && !_hasPoster) {
									_lgUtils2.
								default.addClass(_this.___slide[index], 'lg-complete');
								}
								if (rec === true) {
									if (!_lgUtils2.
									default.hasClass(_this.___slide[index], 'lg-complete')) {
											_lgUtils2.
										default.on(_this.___slide[index].querySelector('.lg-object'), 'load.lg error.lg', function () {
												_this.preload(index);
											});
										}
										else {
											_this.preload(index);
										}
								}
								//}
						};
						/**
						 *   @desc slide function for lightgallery
						 ** Slide() gets call on start
						 ** ** Set lg.on true once slide() function gets called.
						 ** Call loadContent() on slide() function inside setTimeout
						 ** ** On first slide we do not want any animation like slide of fade
						 ** ** So on first slide( if lg.on if false that is first slide) loadContent() should start loading immediately
						 ** ** Else loadContent() should wait for the transition to complete.
						 ** ** So set timeout s.speed + 50
						<=> ** loadContent() will load slide content in to the particular slide
						 ** ** It has recursion (rec) parameter. if rec === true loadContent() will call preload() function.
						 ** ** preload will execute only when the previous slide is fully loaded (images iframe)
						 ** ** avoid simultaneous image load
						<=> ** Preload() will check for s.preload value and call loadContent() again accoring to preload value
						 ** loadContent()  <====> Preload();
						 *   @param {Number} index - index of the slide
						 *   @param {Boolean} fromTouch - true if slide function called via touch event or mouse drag
						 *   @param {Boolean} fromThumb - true if slide function called via thumbnail click
						 */
						Plugin.prototype.slide = function (index, fromTouch, fromThumb) {
							var _prevIndex = 0;
							for (var i = 0; i < this.___slide.length; i++) {
								if (_lgUtils2.
								default.hasClass(this.___slide[i], 'lg-current')) {
										_prevIndex = i;
										break;
									}
							}
							var _this = this;
							// Prevent if multiple call
							// Required for hsh plugin
							if (_this.lGalleryOn && _prevIndex === index) {
								return;
							}
							var _length = this.___slide.length;
							var _time = _this.lGalleryOn ? this.s.speed : 0;
							var _next = false;
							var _prev = false;
							if (!_this.lgBusy) {
								if (this.s.download) {
									var _src;
									if (_this.s.dynamic) {
										_src = _this.s.dynamicEl[index].downloadUrl !== false && (_this.s.dynamicEl[index].downloadUrl || _this.s.dynamicEl[index].src);
									} else {
										_src = _this.items[index].getAttribute('data-download-url') !== 'false' && (_this.items[index].getAttribute('data-download-url') || _this.items[index].getAttribute('href') || _this.items[index].getAttribute('data-src'));
									}
									if (_src) {
										document.getElementById('lg-download').setAttribute('href', _src);
										_lgUtils2.
									default.removeClass(_this.outer, 'lg-hide-download');
									} else {
										_lgUtils2.
									default.addClass(_this.outer, 'lg-hide-download');
									}
								}
								_lgUtils2.
							default.trigger(_this.el, 'onBeforeSlide', {
									prevIndex: _prevIndex,
									index: index,
									fromTouch: fromTouch,
									fromThumb: fromThumb
								});
								_this.lgBusy = true;
								clearTimeout(_this.hideBartimeout);
								// Add title if this.s.appendSubHtmlTo === lg-sub-html
								if (this.s.appendSubHtmlTo === '.lg-sub-html') {
									// wait for slide animation to complete
									setTimeout(function () {
										_this.addHtml(index);
									}, _time);
								}
								this.arrowDisable(index);
								if (!fromTouch) {
									// remove all transitions
									_lgUtils2.
								default.addClass(_this.outer, 'lg-no-trans');
									for (var j = 0; j < this.___slide.length; j++) {
										_lgUtils2.
									default.removeClass(this.___slide[j], 'lg-prev-slide');
										_lgUtils2.
									default.removeClass(this.___slide[j], 'lg-next-slide');
									}
									if (index < _prevIndex) {
										_prev = true;
										if (index === 0 && _prevIndex === _length - 1 && !fromThumb) {
											_prev = false;
											_next = true;
										}
									} else if (index > _prevIndex) {
										_next = true;
										if (index === _length - 1 && _prevIndex === 0 && !fromThumb) {
											_prev = true;
											_next = false;
										}
									}
									if (_prev) {
										//prevslide
										_lgUtils2.
									default.addClass(this.___slide[index], 'lg-prev-slide');
										_lgUtils2.
									default.addClass(this.___slide[_prevIndex], 'lg-next-slide');
									} else if (_next) {
										// next slide
										_lgUtils2.
									default.addClass(this.___slide[index], 'lg-next-slide');
										_lgUtils2.
									default.addClass(this.___slide[_prevIndex], 'lg-prev-slide');
									}
									// give 50 ms for browser to add/remove class
									setTimeout(function () {
										_lgUtils2.
									default.removeClass(_this.outer.querySelector('.lg-current'), 'lg-current');
										//_this.$slide.eq(_prevIndex).removeClass('lg-current');
										_lgUtils2.
									default.addClass(_this.___slide[index], 'lg-current');
										// reset all transitions
										_lgUtils2.
									default.removeClass(_this.outer, 'lg-no-trans');
									}, 50);
								} else {
									var touchPrev = index - 1;
									var touchNext = index + 1;
									if (index === 0 && _prevIndex === _length - 1) {
										// next slide
										touchNext = 0;
										touchPrev = _length - 1;
									} else if (index === _length - 1 && _prevIndex === 0) {
										// prev slide
										touchNext = 0;
										touchPrev = _length - 1;
									}
									_lgUtils2.
								default.removeClass(_this.outer.querySelector('.lg-prev-slide'), 'lg-prev-slide');
									_lgUtils2.
								default.removeClass(_this.outer.querySelector('.lg-current'), 'lg-current');
									_lgUtils2.
								default.removeClass(_this.outer.querySelector('.lg-next-slide'), 'lg-next-slide');
									_lgUtils2.
								default.addClass(_this.___slide[touchPrev], 'lg-prev-slide');
									_lgUtils2.
								default.addClass(_this.___slide[touchNext], 'lg-next-slide');
									_lgUtils2.
								default.addClass(_this.___slide[index], 'lg-current');
								}
								if (_this.lGalleryOn) {
									setTimeout(function () {
										_this.loadContent(index, true, 0);
									}, this.s.speed + 50);
									setTimeout(function () {
										_this.lgBusy = false;
										_lgUtils2.
									default.trigger(_this.el, 'onAfterSlide', {
											prevIndex: _prevIndex,
											index: index,
											fromTouch: fromTouch,
											fromThumb: fromThumb
										});
									}, this.s.speed);
								} else {
									_this.loadContent(index, true, _this.s.backdropDuration);
									_this.lgBusy = false;
									_lgUtils2.
								default.trigger(_this.el, 'onAfterSlide', {
										prevIndex: _prevIndex,
										index: index,
										fromTouch: fromTouch,
										fromThumb: fromThumb
									});
								}
								_this.lGalleryOn = true;
								if (this.s.counter) {
									if (document.getElementById('lg-counter-current')) {
										document.getElementById('lg-counter-current').innerHTML = index + 1;
									}
								}
							}
						};
						/**
						 *  @desc Go to next slide
						 *  @param {Boolean} fromTouch - true if slide function called via touch event
						 */
						Plugin.prototype.goToNextSlide = function (fromTouch) {
							var _this = this;
							if (!_this.lgBusy) {
								if (_this.index + 1 < _this.___slide.length) {
									_this.index++;
									_lgUtils2.
								default.trigger(_this.el, 'onBeforeNextSlide', {
										index: _this.index
									});
									_this.slide(_this.index, fromTouch, false);
								} else {
									if (_this.s.loop) {
										_this.index = 0;
										_lgUtils2.
									default.trigger(_this.el, 'onBeforeNextSlide', {
											index: _this.index
										});
										_this.slide(_this.index, fromTouch, false);
									} else if (_this.s.slideEndAnimatoin) {
										_lgUtils2.
									default.addClass(_this.outer, 'lg-right-end');
										setTimeout(function () {
											_lgUtils2.
										default.removeClass(_this.outer, 'lg-right-end');
										}, 400);
									}
								}
							}
						};
						/**
						 *  @desc Go to previous slide
						 *  @param {Boolean} fromTouch - true if slide function called via touch event
						 */
						Plugin.prototype.goToPrevSlide = function (fromTouch) {
							var _this = this;
							if (!_this.lgBusy) {
								if (_this.index > 0) {
									_this.index--;
									_lgUtils2.
								default.trigger(_this.el, 'onBeforePrevSlide', {
										index: _this.index,
										fromTouch: fromTouch
									});
									_this.slide(_this.index, fromTouch, false);
								} else {
									if (_this.s.loop) {
										_this.index = _this.items.length - 1;
										_lgUtils2.
									default.trigger(_this.el, 'onBeforePrevSlide', {
											index: _this.index,
											fromTouch: fromTouch
										});
										_this.slide(_this.index, fromTouch, false);
									} else if (_this.s.slideEndAnimatoin) {
										_lgUtils2.
									default.addClass(_this.outer, 'lg-left-end');
										setTimeout(function () {
											_lgUtils2.
										default.removeClass(_this.outer, 'lg-left-end');
										}, 400);
									}
								}
							}
						};
						Plugin.prototype.keyPress = function () {
							var _this = this;
							if (this.items.length > 1) {
								_lgUtils2.
							default.on(window, 'keyup.lg', function (e) {
									if (_this.items.length > 1) {
										if (e.keyCode === 37) {
											e.preventDefault();
											_this.goToPrevSlide();
										}
										if (e.keyCode === 39) {
											e.preventDefault();
											_this.goToNextSlide();
										}
									}
								});
							}
							_lgUtils2.
						default.on(window, 'keydown.lg', function (e) {
								if (_this.s.escKey === true && e.keyCode === 27) {
									e.preventDefault();
									if (!_lgUtils2.
									default.hasClass(_this.outer, 'lg-thumb-open')) {
											_this.destroy();
										}
										else {
											_lgUtils2.
										default.removeClass(_this.outer, 'lg-thumb-open');
										}
								}
							});
						};
						Plugin.prototype.arrow = function () {
							var _this = this;
							_lgUtils2.
						default.on(this.outer.querySelector('.lg-prev'), 'click.lg', function () {
								_this.goToPrevSlide();
							});
							_lgUtils2.
						default.on(this.outer.querySelector('.lg-next'), 'click.lg', function () {
								_this.goToNextSlide();
							});
						};
						Plugin.prototype.arrowDisable = function (index) {
							// Disable arrows if s.hideControlOnEnd is true
							if (!this.s.loop && this.s.hideControlOnEnd) {
								var next = this.outer.querySelector('.lg-next');
								var prev = this.outer.querySelector('.lg-prev');
								if (index + 1 < this.___slide.length) {
									next.removeAttribute('disabled');
									_lgUtils2.
								default.removeClass(next, 'disabled');
								} else {
									next.setAttribute('disabled', 'disabled');
									_lgUtils2.
								default.addClass(next, 'disabled');
								}
								if (index > 0) {
									prev.removeAttribute('disabled');
									_lgUtils2.
								default.removeClass(prev, 'disabled');
								} else {
									next.setAttribute('disabled', 'disabled');
									_lgUtils2.
								default.addClass(next, 'disabled');
								}
							}
						};
						Plugin.prototype.setTranslate = function (el, xValue, yValue) {
							// jQuery supports Automatic CSS prefixing since jQuery 1.8.0
							if (this.s.useLeft) {
								el.style.left = xValue;
							} else {
								_lgUtils2.
							default.setVendor(el, 'Transform', 'translate3d(' + xValue + 'px, ' + yValue + 'px, 0px)');
							}
						};
						Plugin.prototype.touchMove = function (startCoords, endCoords) {
							var distance = endCoords - startCoords;
							if (Math.abs(distance) > 15) {
								// reset opacity and transition duration
								_lgUtils2.
							default.addClass(this.outer, 'lg-dragging');
								// move current slide
								this.setTranslate(this.___slide[this.index], distance, 0);
								// move next and prev slide with current slide
								this.setTranslate(document.querySelector('.lg-prev-slide'), -this.___slide[this.index].clientWidth + distance, 0);
								this.setTranslate(document.querySelector('.lg-next-slide'), this.___slide[this.index].clientWidth + distance, 0);
							}
						};
						Plugin.prototype.touchEnd = function (distance) {
							var _this = this;
							// keep slide animation for any mode while dragg/swipe
							if (_this.s.mode !== 'lg-slide') {
								_lgUtils2.
							default.addClass(_this.outer, 'lg-slide');
							}
							for (var i = 0; i < this.___slide.length; i++) {
								if (!_lgUtils2.
								default.hasClass(this.___slide[i], 'lg-current') && !_lgUtils2.
								default.hasClass(this.___slide[i], 'lg-prev-slide') && !_lgUtils2.
								default.hasClass(this.___slide[i], 'lg-next-slide')) {
										this.___slide[i].style.opacity = '0';
									}
							}
							// set transition duration
							setTimeout(function () {
								_lgUtils2.
							default.removeClass(_this.outer, 'lg-dragging');
								if (distance < 0 && Math.abs(distance) > _this.s.swipeThreshold) {
									_this.goToNextSlide(true);
								} else if (distance > 0 && Math.abs(distance) > _this.s.swipeThreshold) {
									_this.goToPrevSlide(true);
								} else if (Math.abs(distance) < 5) {
									// Trigger click if distance is less than 5 pix
									_lgUtils2.
								default.trigger(_this.el, 'onSlideClick');
								}
								for (var i = 0; i < _this.___slide.length; i++) {
									_this.___slide[i].removeAttribute('style');
								}
							});
							// remove slide class once drag/swipe is completed if mode is not slide
							setTimeout(function () {
								if (!_lgUtils2.
								default.hasClass(_this.outer, 'lg-dragging') && _this.s.mode !== 'lg-slide') {
										_lgUtils2.
									default.removeClass(_this.outer, 'lg-slide');
									}
							}, _this.s.speed + 100);
						};
						Plugin.prototype.enableSwipe = function () {
							var _this = this;
							var startCoords = 0;
							var endCoords = 0;
							var isMoved = false;
							if (_this.s.enableSwipe && _this.isTouch && _this.doCss()) {
								for (var i = 0; i < _this.___slide.length; i++) {
									/*jshint loopfunc: true */
									_lgUtils2.
								default.on(_this.___slide[i], 'touchstart.lg', function (e) {
										if (!_lgUtils2.
										default.hasClass(_this.outer, 'lg-zoomed') && !_this.lgBusy) {
												e.preventDefault();
												_this.manageSwipeClass();
												startCoords = e.targetTouches[0].pageX;
											}
									});
								}
								for (var j = 0; j < _this.___slide.length; j++) {
									/*jshint loopfunc: true */
									_lgUtils2.
								default.on(_this.___slide[j], 'touchmove.lg', function (e) {
										if (!_lgUtils2.
										default.hasClass(_this.outer, 'lg-zoomed')) {
												e.preventDefault();
												endCoords = e.targetTouches[0].pageX;
												_this.touchMove(startCoords, endCoords);
												isMoved = true;
											}
									});
								}
								for (var k = 0; k < _this.___slide.length; k++) {
									/*jshint loopfunc: true */
									_lgUtils2.
								default.on(_this.___slide[k], 'touchend.lg', function () {
										if (!_lgUtils2.
										default.hasClass(_this.outer, 'lg-zoomed')) {
												if (isMoved) {
													isMoved = false;
													_this.touchEnd(endCoords - startCoords);
												} else {
													_lgUtils2.
												default.trigger(_this.el, 'onSlideClick');
												}
											}
									});
								}
							}
						};
						Plugin.prototype.enableDrag = function () {
							var _this = this;
							var startCoords = 0;
							var endCoords = 0;
							var isDraging = false;
							var isMoved = false;
							if (_this.s.enableDrag && !_this.isTouch && _this.doCss()) {
								for (var i = 0; i < _this.___slide.length; i++) {
									/*jshint loopfunc: true */
									_lgUtils2.
								default.on(_this.___slide[i], 'mousedown.lg', function (e) {
										// execute only on .lg-object
										if (!_lgUtils2.
										default.hasClass(_this.outer, 'lg-zoomed')) {
												if (_lgUtils2.
												default.hasClass(e.target, 'lg-object') || _lgUtils2.
												default.hasClass(e.target, 'lg-video-play')) {
														e.preventDefault();
														if (!_this.lgBusy) {
															_this.manageSwipeClass();
															startCoords = e.pageX;
															isDraging = true;
															// ** Fix for webkit cursor issue https://code.google.com/p/chromium/issues/detail?id=26723
															_this.outer.scrollLeft += 1;
															_this.outer.scrollLeft -= 1;
															// *
															_lgUtils2.
														default.removeClass(_this.outer, 'lg-grab');
															_lgUtils2.
														default.addClass(_this.outer, 'lg-grabbing');
															_lgUtils2.
														default.trigger(_this.el, 'onDragstart');
														}
													}
											}
									});
								}
								_lgUtils2.
							default.on(window, 'mousemove.lg', function (e) {
									if (isDraging) {
										isMoved = true;
										endCoords = e.pageX;
										_this.touchMove(startCoords, endCoords);
										_lgUtils2.
									default.trigger(_this.el, 'onDragmove');
									}
								});
								_lgUtils2.
							default.on(window, 'mouseup.lg', function (e) {
									if (isMoved) {
										isMoved = false;
										_this.touchEnd(endCoords - startCoords);
										_lgUtils2.
									default.trigger(_this.el, 'onDragend');
									} else if (_lgUtils2.
									default.hasClass(e.target, 'lg-object') || _lgUtils2.
									default.hasClass(e.target, 'lg-video-play')) {
											_lgUtils2.
										default.trigger(_this.el, 'onSlideClick');
										}
										// Prevent execution on click
										if (isDraging) {
											isDraging = false;
											_lgUtils2.
										default.removeClass(_this.outer, 'lg-grabbing');
											_lgUtils2.
										default.addClass(_this.outer, 'lg-grab');
										}
								});
							}
						};
						Plugin.prototype.manageSwipeClass = function () {
							var touchNext = this.index + 1;
							var touchPrev = this.index - 1;
							var length = this.___slide.length;
							if (this.s.loop) {
								if (this.index === 0) {
									touchPrev = length - 1;
								} else if (this.index === length - 1) {
									touchNext = 0;
								}
							}
							for (var i = 0; i < this.___slide.length; i++) {
								_lgUtils2.
							default.removeClass(this.___slide[i], 'lg-next-slide');
								_lgUtils2.
							default.removeClass(this.___slide[i], 'lg-prev-slide');
							}
							if (touchPrev > -1) {
								_lgUtils2.
							default.addClass(this.___slide[touchPrev], 'lg-prev-slide');
							}
							_lgUtils2.
						default.addClass(this.___slide[touchNext], 'lg-next-slide');
						};
						Plugin.prototype.mousewheel = function () {
							var _this = this;
							_lgUtils2.
						default.on(_this.outer, 'mousewheel.lg', function (e) {
								if (!e.deltaY) {
									return;
								}
								if (e.deltaY > 0) {
									_this.goToPrevSlide();
								} else {
									_this.goToNextSlide();
								}
								e.preventDefault();
							});
						};
						Plugin.prototype.closeGallery = function () {
							var _this = this;
							var mousedown = false;
							_lgUtils2.
						default.on(this.outer.querySelector('.lg-close'), 'click.lg', function () {
								_this.destroy();
							});
							if (_this.s.closable) {
								// If you drag the slide and release outside gallery gets close on chrome
								// for preventing this check mousedown and mouseup happened on .lg-item or lg-outer
								_lgUtils2.
							default.on(_this.outer, 'mousedown.lg', function (e) {
									if (_lgUtils2.
									default.hasClass(e.target, 'lg-outer') || _lgUtils2.
									default.hasClass(e.target, 'lg-item') || _lgUtils2.
									default.hasClass(e.target, 'lg-img-wrap')) {
											mousedown = true;
										}
										else {
											mousedown = false;
										}
								});
								_lgUtils2.
							default.on(_this.outer, 'mouseup.lg', function (e) {
									if (_lgUtils2.
									default.hasClass(e.target, 'lg-outer') || _lgUtils2.
									default.hasClass(e.target, 'lg-item') || _lgUtils2.
									default.hasClass(e.target, 'lg-img-wrap') && mousedown) {
											if (!_lgUtils2.
											default.hasClass(_this.outer, 'lg-dragging')) {
													_this.destroy();
												}
										}
								});
							}
						};
						Plugin.prototype.destroy = function (d) {
							var _this = this;
							if (!d) {
								_lgUtils2.
							default.trigger(_this.el, 'onBeforeClose');
							}
							document.body.scrollTop = _this.prevScrollTop;
							document.documentElement.scrollTop = _this.prevScrollTop;
							/**
							 * if d is false or undefined destroy will only close the gallery
							 * plugins instance remains with the element
							 *
							 * if d is true destroy will completely remove the plugin
							 */
							if (d) {
								if (!_this.s.dynamic) {
									// only when not using dynamic mode is $items a jquery collection
									for (var i = 0; i < this.items.length; i++) {
										_lgUtils2.
									default.off(this.items[i], '.lg');
										_lgUtils2.
									default.off(this.items[i], '.lgcustom');
									}
								}
								var lguid = _this.el.getAttribute('lg-uid');
								delete window.lgData[lguid];
								_this.el.removeAttribute('lg-uid');
							}
							// Unbind all events added by lightGallery
							_lgUtils2.
						default.off(this.el, '.lgtm');
							// Distroy all lightGallery modules
							for (var key in window.lgModules) {
								if (_this.modules[key]) {
									_this.modules[key].destroy(d);
								}
							}
							this.lGalleryOn = false;
							clearTimeout(_this.hideBartimeout);
							this.hideBartimeout = false;
							_lgUtils2.
						default.off(window, '.lg');
							_lgUtils2.
						default.removeClass(document.body, 'lg-on');
							_lgUtils2.
						default.removeClass(document.body, 'lg-from-hash');
							if (_this.outer) {
								_lgUtils2.
							default.removeClass(_this.outer, 'lg-visible');
							}
							_lgUtils2.
						default.removeClass(document.querySelector('.lg-backdrop'), 'in');
							setTimeout(function () {
								try {
									if (_this.outer) {
										_this.outer.parentNode.removeChild(_this.outer);
									}
									if (document.querySelector('.lg-backdrop')) {
										document.querySelector('.lg-backdrop').parentNode.removeChild(document.querySelector('.lg-backdrop'));
									}
									if (!d) {
										_lgUtils2.
									default.trigger(_this.el, 'onCloseAfter');
									}
								} catch (err) {}
							}, _this.s.backdropDuration + 50);
						};
						window.lightGallery = function (el, options) {
							if (!el) {
								return;
							}
							try {
								if (!el.getAttribute('lg-uid')) {
									var uid = 'lg' + window.lgData.uid++;
									window.lgData[uid] = new Plugin(el, options);
									el.setAttribute('lg-uid', uid);
								} else {
									try {
										window.lgData[el.getAttribute('lg-uid')].init();
									} catch (err) {
										console.error('lightGallery has not initiated properly');
									}
								}
							} catch (err) {
								console.error('lightGallery has not initiated properly');
							}
						};
				});
			}, {
				"./lg-utils": 1
			}
		]
	}, {}, [2])(2);
});

/*global define, global, module, require, self, utils */
/**!
 * lg-fullscreen.js | 0.0.1 | July 25th 2016
 * http://sachinchoolur.github.io/lightGallery/
 * Copyright (c) 2016 Sachin N;
 * @license Apache 2.0
 */
(function (f) {
	if (typeof exports === "object" && typeof module !== "undefined") {
		module.exports = f();
	} else if (typeof define === "function" && define.amd) {
		define([], f);
	} else {
		var g;
		if (typeof window !== "undefined") {
			g = window;
		} else if (typeof global !== "undefined") {
			g = global;
		} else if (typeof self !== "undefined") {
			g = self;
		} else {
			g = this;
		}
		g.LgFullsceen = f();
	}
})(function () {
	var define,
	module,
	exports;
	return (function e(t, n, r) {
		function s(o, u) {
			if (!n[o]) {
				if (!t[o]) {
					var a = typeof require == "function" && require;
					if (!u && a)
						return a(o, !0);
					if (i)
						return i(o, !0);
					var f = new Error("Cannot find module '" + o + "'");
					throw (f.code = "MODULE_NOT_FOUND",
					f);
				}
				var l = n[o] = {
					exports: {}
				};
				t[o][0].call(l.exports, function (e) {
					var n = t[o][1][e];
					return s(n ? n : e);
				}, l, l.exports, e, t, n, r);
			}
			return n[o].exports;
		}
		var i = typeof require == "function" && require;
		for (var o = 0; o < r.length; o++)
			s(r[o]);
		return s;
	})({
		1: [function (require, module, exports) {
				(function (global, factory) {
					if (typeof define === "function" && define.amd) {
						define([], factory);
					} else if (typeof exports !== "undefined") {
						factory();
					} else {
						var mod = {
							exports: {}
						};
						factory();
						global.lgFullscreen = mod.exports;
					}
				})(this, function () {
					'use strict';
					var _extends = Object.assign || function (target) {
						for (var i = 1; i < arguments.length; i++) {
							var source = arguments[i];
							for (var key in source) {
								if (Object.prototype.hasOwnProperty.call(source, key)) {
									target[key] = source[key];
								}
							}
						}
						return target;
					};
					var fullscreenDefaults = {
						fullScreen: true
					};
					var Fullscreen = function Fullscreen(element) {
						this.el = element;
						this.core = window.lgData[this.el.getAttribute('lg-uid')];
						this.core.s = _extends({}, fullscreenDefaults, this.core.s);
						this.init();
						return this;
					};
					Fullscreen.prototype.init = function () {
						var fullScreen = '';
						if (this.core.s.fullScreen) {
							// check for fullscreen browser support
							if (!document.fullscreenEnabled && !document.webkitFullscreenEnabled && !document.mozFullScreenEnabled && !document.msFullscreenEnabled) {
								return;
							} else {
								fullScreen = '<span class="lg-fullscreen lg-icon"></span>';
								this.core.outer.querySelector('.lg-toolbar').insertAdjacentHTML('beforeend', fullScreen);
								this.fullScreen();
							}
						}
					};
					Fullscreen.prototype.requestFullscreen = function () {
						var el = document.documentElement;
						if (el.requestFullscreen) {
							el.requestFullscreen();
						} else if (el.msRequestFullscreen) {
							el.msRequestFullscreen();
						} else if (el.mozRequestFullScreen) {
							el.mozRequestFullScreen();
						} else if (el.webkitRequestFullscreen) {
							el.webkitRequestFullscreen();
						}
					};
					Fullscreen.prototype.exitFullscreen = function () {
						if (document.exitFullscreen) {
							document.exitFullscreen();
						} else if (document.msExitFullscreen) {
							document.msExitFullscreen();
						} else if (document.mozCancelFullScreen) {
							document.mozCancelFullScreen();
						} else if (document.webkitExitFullscreen) {
							document.webkitExitFullscreen();
						}
					};
					// https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/Using_full_screen_mode
					Fullscreen.prototype.fullScreen = function () {
						var _this = this;
						utils.on(document, 'fullscreenchange.lgfullscreen webkitfullscreenchange.lgfullscreen mozfullscreenchange.lgfullscreen MSFullscreenChange.lgfullscreen', function () {
							if (utils.hasClass(_this.core.outer, 'lg-fullscreen-on')) {
								utils.removeClass(_this.core.outer, 'lg-fullscreen-on');
							} else {
								utils.addClass(_this.core.outer, 'lg-fullscreen-on');
							}
						});
						utils.on(this.core.outer.querySelector('.lg-fullscreen'), 'click.lg', function () {
							if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
								_this.requestFullscreen();
							} else {
								_this.exitFullscreen();
							}
						});
					};
					Fullscreen.prototype.destroy = function () {
						// exit from fullscreen if activated
						this.exitFullscreen();
						utils.off(document, '.lgfullscreen');
					};
					window.lgModules.fullscreen = Fullscreen;
				});
			}, {}
		]
	}, {}, [1])(1);
});

/*global define, global, module, require, self, utils */
/**!
 * lg-hash.js | 0.0.1 | July 25th 2016
 * http://sachinchoolur.github.io/lightGallery/
 * Copyright (c) 2016 Sachin N;
 * @license Apache 2.0
 */
(function (f) {
	if (typeof exports === "object" && typeof module !== "undefined") {
		module.exports = f();
	} else if (typeof define === "function" && define.amd) {
		define([], f);
	} else {
		var g;
		if (typeof window !== "undefined") {
			g = window;
		} else if (typeof global !== "undefined") {
			g = global;
		} else if (typeof self !== "undefined") {
			g = self;
		} else {
			g = this;
		}
		g.LgHash = f();
	}
})(function () {
	var define,
	module,
	exports;
	return (function e(t, n, r) {
		function s(o, u) {
			if (!n[o]) {
				if (!t[o]) {
					var a = typeof require == "function" && require;
					if (!u && a)
						return a(o, !0);
					if (i)
						return i(o, !0);
					var f = new Error("Cannot find module '" + o + "'");
					throw (f.code = "MODULE_NOT_FOUND",
					f);
				}
				var l = n[o] = {
					exports: {}
				};
				t[o][0].call(l.exports, function (e) {
					var n = t[o][1][e];
					return s(n ? n : e);
				}, l, l.exports, e, t, n, r);
			}
			return n[o].exports;
		}
		var i = typeof require == "function" && require;
		for (var o = 0; o < r.length; o++)
			s(r[o]);
		return s;
	})({
		1: [function (require, module, exports) {
				(function (global, factory) {
					if (typeof define === "function" && define.amd) {
						define([], factory);
					} else if (typeof exports !== "undefined") {
						factory();
					} else {
						var mod = {
							exports: {}
						};
						factory();
						global.lgHash = mod.exports;
					}
				})(this, function () {
					'use strict';
					var _extends = Object.assign || function (target) {
						for (var i = 1; i < arguments.length; i++) {
							var source = arguments[i];
							for (var key in source) {
								if (Object.prototype.hasOwnProperty.call(source, key)) {
									target[key] = source[key];
								}
							}
						}
						return target;
					};
					var hashDefaults = {
						hash: true
					};
					var Hash = function Hash(element) {
						this.el = element;
						this.core = window.lgData[this.el.getAttribute('lg-uid')];
						this.core.s = _extends({}, hashDefaults, this.core.s);
						if (this.core.s.hash) {
							this.oldHash = window.location.hash;
							this.init();
						}
						return this;
					};
					Hash.prototype.init = function () {
						var _this = this;
						var _hash;
						// Change hash value on after each slide transition
						utils.on(_this.core.el, 'onAfterSlide.lgtm', function (event) {
							window.location.hash = 'lg=' + _this.core.s.galleryId + '&slide=' + event.detail.index;
						});
						// Listen hash change and change the slide according to slide value
						utils.on(window, 'hashchange.lghash', function () {
							_hash = window.location.hash;
							var _idx = parseInt(_hash.split('&slide=')[1], 10);
							// it galleryId doesn't exist in the url close the gallery
							if (_hash.indexOf('lg=' + _this.core.s.galleryId) > -1) {
								_this.core.slide(_idx, false, false);
							} else if (_this.core.lGalleryOn) {
								_this.core.destroy();
							}
						});
					};
					Hash.prototype.destroy = function () {
						if (!this.core.s.hash) {
							return;
						}
						// Reset to old hash value
						if (this.oldHash && this.oldHash.indexOf('lg=' + this.core.s.galleryId) < 0) {
							window.location.hash = this.oldHash;
						} else {
							if (history.pushState) {
								history.pushState('', document.title, window.location.pathname + window.location.search);
							} else {
								window.location.hash = '';
							}
						}
						utils.off(this.core.el, '.lghash');
					};
					window.lgModules.hash = Hash;
				});
			}, {}
		]
	}, {}, [1])(1);
});

/*global define, global, module, require, self, utils */
/**!
 * lg-thumbnail.js | 0.0.4 | August 9th 2016
 * http://sachinchoolur.github.io/lg-thumbnail.js
 * Copyright (c) 2016 Sachin N;
 * @license Apache 2.0
 */
(function (f) {
	if (typeof exports === "object" && typeof module !== "undefined") {
		module.exports = f();
	} else if (typeof define === "function" && define.amd) {
		define([], f);
	} else {
		var g;
		if (typeof window !== "undefined") {
			g = window;
		} else if (typeof global !== "undefined") {
			g = global;
		} else if (typeof self !== "undefined") {
			g = self;
		} else {
			g = this;
		}
		g.LgThumbnail = f();
	}
})(function () {
	var define,
	module,
	exports;
	return (function e(t, n, r) {
		function s(o, u) {
			if (!n[o]) {
				if (!t[o]) {
					var a = typeof require == "function" && require;
					if (!u && a)
						return a(o, !0);
					if (i)
						return i(o, !0);
					var f = new Error("Cannot find module '" + o + "'");
					throw (f.code = "MODULE_NOT_FOUND",
					f);
				}
				var l = n[o] = {
					exports: {}
				};
				t[o][0].call(l.exports, function (e) {
					var n = t[o][1][e];
					return s(n ? n : e);
				}, l, l.exports, e, t, n, r);
			}
			return n[o].exports;
		}
		var i = typeof require == "function" && require;
		for (var o = 0; o < r.length; o++)
			s(r[o]);
		return s;
	})({
		1: [function (require, module, exports) {
				(function (global, factory) {
					if (typeof define === "function" && define.amd) {
						define([], factory);
					} else if (typeof exports !== "undefined") {
						factory();
					} else {
						var mod = {
							exports: {}
						};
						factory();
						global.lgThumbnail = mod.exports;
					}
				})(this, function () {
					'use strict';
					var _extends = Object.assign || function (target) {
						for (var i = 1; i < arguments.length; i++) {
							var source = arguments[i];
							for (var key in source) {
								if (Object.prototype.hasOwnProperty.call(source, key)) {
									target[key] = source[key];
								}
							}
						}
						return target;
					};
					var thumbnailDefaults = {
						thumbnail: true,
						animateThumb: true,
						currentPagerPosition: 'middle',
						thumbWidth: 100,
						thumbContHeight: 100,
						thumbMargin: 5,
						exThumbImage: false,
						showThumbByDefault: true,
						toggleThumb: true,
						pullCaptionUp: true,
						enableThumbDrag: true,
						enableThumbSwipe: true,
						swipeThreshold: 50,
						loadYoutubeThumbnail: true,
						youtubeThumbSize: 1,
						loadVimeoThumbnail: true,
						vimeoThumbSize: 'thumbnail_small',
						loadDailymotionThumbnail: true
					};
					var Thumbnail = function Thumbnail(element) {
						this.el = element;
						this.core = window.lgData[this.el.getAttribute('lg-uid')];
						this.core.s = _extends({}, thumbnailDefaults, this.core.s);
						this.thumbOuter = null;
						this.thumbOuterWidth = 0;
						this.thumbTotalWidth = this.core.items.length * (this.core.s.thumbWidth + this.core.s.thumbMargin);
						this.thumbIndex = this.core.index;
						// Thumbnail animation value
						this.left = 0;
						this.init();
						return this;
					};
					Thumbnail.prototype.init = function () {
						var _this = this;
						if (this.core.s.thumbnail && this.core.items.length > 1) {
							if (this.core.s.showThumbByDefault) {
								setTimeout(function () {
									utils.addClass(_this.core.outer, 'lg-thumb-open');
								}, 700);
							}
							if (this.core.s.pullCaptionUp) {
								utils.addClass(this.core.outer, 'lg-pull-caption-up');
							}
							this.build();
							if (this.core.s.animateThumb) {
								if (this.core.s.enableThumbDrag && !this.core.isTouch && this.core.doCss()) {
									this.enableThumbDrag();
								}
								if (this.core.s.enableThumbSwipe && this.core.isTouch && this.core.doCss()) {
									this.enableThumbSwipe();
								}
								this.thumbClickable = false;
							} else {
								this.thumbClickable = true;
							}
							this.toggle();
							this.thumbkeyPress();
						}
					};
					Thumbnail.prototype.build = function () {
						var _this = this;
						var thumbList = '';
						var vimeoErrorThumbSize = '';
						var $thumb;
						var html = '<div class="lg-thumb-outer">' + '<div class="lg-thumb group">' + '</div>' + '</div>';
						switch (this.core.s.vimeoThumbSize) {
						case 'thumbnail_large':
							vimeoErrorThumbSize = '640';
							break;
						case 'thumbnail_medium':
							vimeoErrorThumbSize = '200x150';
							break;
						case 'thumbnail_small':
							vimeoErrorThumbSize = '100x75';
						}
						utils.addClass(_this.core.outer, 'lg-has-thumb');
						_this.core.outer.querySelector('.lg').insertAdjacentHTML('beforeend', html);
						_this.thumbOuter = _this.core.outer.querySelector('.lg-thumb-outer');
						_this.thumbOuterWidth = _this.thumbOuter.offsetWidth;
						if (_this.core.s.animateThumb) {
							_this.core.outer.querySelector('.lg-thumb').style.width = _this.thumbTotalWidth + 'px';
							_this.core.outer.querySelector('.lg-thumb').style.position = 'relative';
						}
						if (this.core.s.animateThumb) {
							_this.thumbOuter.style.height = _this.core.s.thumbContHeight + 'px';
						}
						function getThumb(src, thumb, index) {
							var isVideo = _this.core.isVideo(src, index) || {};
							var thumbImg;
							var vimeoId = '';
							if (isVideo.youtube || isVideo.vimeo || isVideo.dailymotion) {
								if (isVideo.youtube) {
									if (_this.core.s.loadYoutubeThumbnail) {
										thumbImg = '//img.youtube.com/vi/' + isVideo.youtube[1] + '/' + _this.core.s.youtubeThumbSize + '.jpg';
									} else {
										thumbImg = thumb;
									}
								} else if (isVideo.vimeo) {
									if (_this.core.s.loadVimeoThumbnail) {
										thumbImg = '//i.vimeocdn.com/video/error_' + vimeoErrorThumbSize + '.jpg';
										vimeoId = isVideo.vimeo[1];
									} else {
										thumbImg = thumb;
									}
								} else if (isVideo.dailymotion) {
									if (_this.core.s.loadDailymotionThumbnail) {
										thumbImg = '//www.dailymotion.com/thumbnail/video/' + isVideo.dailymotion[1];
									} else {
										thumbImg = thumb;
									}
								}
							} else {
								thumbImg = thumb;
							}
							thumbList += '<div data-vimeo-id="' + vimeoId + '" class="lg-thumb-item" style="width:' + _this.core.s.thumbWidth + 'px; margin-right: ' + _this.core.s.thumbMargin + 'px"><img src="' + thumbImg + '" /></div>';
							vimeoId = '';
						}
						if (_this.core.s.dynamic) {
							for (var j = 0; j < _this.core.s.dynamicEl.length; j++) {
								getThumb(_this.core.s.dynamicEl[j].src, _this.core.s.dynamicEl[j].thumb, j);
							}
						} else {
							for (var i = 0; i < _this.core.items.length; i++) {
								if (!_this.core.s.exThumbImage) {
									getThumb(_this.core.items[i].getAttribute('href') || _this.core.items[i].getAttribute('data-src'), _this.core.items[i].querySelector('img').getAttribute('src'), i);
								} else {
									getThumb(_this.core.items[i].getAttribute('href') || _this.core.items[i].getAttribute('data-src'), _this.core.items[i].getAttribute(_this.core.s.exThumbImage), i);
								}
							}
						}
						_this.core.outer.querySelector('.lg-thumb').innerHTML = thumbList;
						$thumb = _this.core.outer.querySelectorAll('.lg-thumb-item');
						for (var n = 0; n < $thumb.length; n++) {
							/*jshint loopfunc: true */
							(function (index) {
								var $this = $thumb[index];
								var vimeoVideoId = $this.getAttribute('data-vimeo-id');
								if (vimeoVideoId) {
									window['lgJsonP' + _this.el.getAttribute('lg-uid') + '' + n] = function (content) {
										$this.querySelector('img').setAttribute('src', content[0][_this.core.s.vimeoThumbSize]);
									};
									var script = document.createElement('script');
									script.className = 'lg-script';
									script.src = '//www.vimeo.com/api/v2/video/' + vimeoVideoId + '.json?callback=lgJsonP' + _this.el.getAttribute('lg-uid') + '' + n;
									document.body.appendChild(script);
								}
							})(n);
						}
						// manage active class for thumbnail
						utils.addClass($thumb[_this.core.index], 'active');
						utils.on(_this.core.el, 'onBeforeSlide.lgtm', function () {
							for (var j = 0; j < $thumb.length; j++) {
								utils.removeClass($thumb[j], 'active');
							}
							utils.addClass($thumb[_this.core.index], 'active');
						});
						for (var k = 0; k < $thumb.length; k++) {
							/*jshint loopfunc: true */
							(function (index) {
								utils.on($thumb[index], 'click.lg touchend.lg', function () {
									setTimeout(function () {
										// In IE9 and bellow touch does not support
										// Go to slide if browser does not support css transitions
										if (_this.thumbClickable && !_this.core.lgBusy || !_this.core.doCss()) {
											_this.core.index = index;
											_this.core.slide(_this.core.index, false, true);
										}
									}, 50);
								});
							})(k);
						}
						utils.on(_this.core.el, 'onBeforeSlide.lgtm', function () {
							_this.animateThumb(_this.core.index);
						});
						utils.on(window, 'resize.lgthumb orientationchange.lgthumb', function () {
							setTimeout(function () {
								_this.animateThumb(_this.core.index);
								_this.thumbOuterWidth = _this.thumbOuter.offsetWidth;
							}, 200);
						});
					};
					Thumbnail.prototype.setTranslate = function (value) {
						utils.setVendor(this.core.outer.querySelector('.lg-thumb'), 'Transform', 'translate3d(-' + value + 'px, 0px, 0px)');
					};
					Thumbnail.prototype.animateThumb = function (index) {
						var $thumb = this.core.outer.querySelector('.lg-thumb');
						if (this.core.s.animateThumb) {
							var position;
							switch (this.core.s.currentPagerPosition) {
							case 'left':
								position = 0;
								break;
							case 'middle':
								position = this.thumbOuterWidth / 2 - this.core.s.thumbWidth / 2;
								break;
							case 'right':
								position = this.thumbOuterWidth - this.core.s.thumbWidth;
							}
							this.left = (this.core.s.thumbWidth + this.core.s.thumbMargin) * index - 1 - position;
							if (this.left > this.thumbTotalWidth - this.thumbOuterWidth) {
								this.left = this.thumbTotalWidth - this.thumbOuterWidth;
							}
							if (this.left < 0) {
								this.left = 0;
							}
							if (this.core.lGalleryOn) {
								if (!utils.hasClass($thumb, 'on')) {
									utils.setVendor(this.core.outer.querySelector('.lg-thumb'), 'TransitionDuration', this.core.s.speed + 'ms');
								}
								if (!this.core.doCss()) {
									$thumb.style.left = -this.left + 'px';
								}
							} else {
								if (!this.core.doCss()) {
									$thumb.style.left = -this.left + 'px';
								}
							}
							this.setTranslate(this.left);
						}
					};
					// Enable thumbnail dragging and swiping
					Thumbnail.prototype.enableThumbDrag = function () {
						var _this = this;
						var startCoords = 0;
						var endCoords = 0;
						var isDraging = false;
						var isMoved = false;
						var tempLeft = 0;
						utils.addClass(_this.thumbOuter, 'lg-grab');
						utils.on(_this.core.outer.querySelector('.lg-thumb'), 'mousedown.lgthumb', function (e) {
							if (_this.thumbTotalWidth > _this.thumbOuterWidth) {
								// execute only on .lg-object
								e.preventDefault();
								startCoords = e.pageX;
								isDraging = true;
								// ** Fix for webkit cursor issue https://code.google.com/p/chromium/issues/detail?id=26723
								_this.core.outer.scrollLeft += 1;
								_this.core.outer.scrollLeft -= 1;
								// *
								_this.thumbClickable = false;
								utils.removeClass(_this.thumbOuter, 'lg-grab');
								utils.addClass(_this.thumbOuter, 'lg-grabbing');
							}
						});
						utils.on(window, 'mousemove.lgthumb', function (e) {
							if (isDraging) {
								tempLeft = _this.left;
								isMoved = true;
								endCoords = e.pageX;
								utils.addClass(_this.thumbOuter, 'lg-dragging');
								tempLeft = tempLeft - (endCoords - startCoords);
								if (tempLeft > _this.thumbTotalWidth - _this.thumbOuterWidth) {
									tempLeft = _this.thumbTotalWidth - _this.thumbOuterWidth;
								}
								if (tempLeft < 0) {
									tempLeft = 0;
								}
								// move current slide
								_this.setTranslate(tempLeft);
							}
						});
						utils.on(window, 'mouseup.lgthumb', function () {
							if (isMoved) {
								isMoved = false;
								utils.removeClass(_this.thumbOuter, 'lg-dragging');
								_this.left = tempLeft;
								if (Math.abs(endCoords - startCoords) < _this.core.s.swipeThreshold) {
									_this.thumbClickable = true;
								}
							} else {
								_this.thumbClickable = true;
							}
							if (isDraging) {
								isDraging = false;
								utils.removeClass(_this.thumbOuter, 'lg-grabbing');
								utils.addClass(_this.thumbOuter, 'lg-grab');
							}
						});
					};
					Thumbnail.prototype.enableThumbSwipe = function () {
						var _this = this;
						var startCoords = 0;
						var endCoords = 0;
						var isMoved = false;
						var tempLeft = 0;
						utils.on(_this.core.outer.querySelector('.lg-thumb'), 'touchstart.lg', function (e) {
							if (_this.thumbTotalWidth > _this.thumbOuterWidth) {
								e.preventDefault();
								startCoords = e.targetTouches[0].pageX;
								_this.thumbClickable = false;
							}
						});
						utils.on(_this.core.outer.querySelector('.lg-thumb'), 'touchmove.lg', function (e) {
							if (_this.thumbTotalWidth > _this.thumbOuterWidth) {
								e.preventDefault();
								endCoords = e.targetTouches[0].pageX;
								isMoved = true;
								utils.addClass(_this.thumbOuter, 'lg-dragging');
								tempLeft = _this.left;
								tempLeft = tempLeft - (endCoords - startCoords);
								if (tempLeft > _this.thumbTotalWidth - _this.thumbOuterWidth) {
									tempLeft = _this.thumbTotalWidth - _this.thumbOuterWidth;
								}
								if (tempLeft < 0) {
									tempLeft = 0;
								}
								// move current slide
								_this.setTranslate(tempLeft);
							}
						});
						utils.on(_this.core.outer.querySelector('.lg-thumb'), 'touchend.lg', function () {
							if (_this.thumbTotalWidth > _this.thumbOuterWidth) {
								if (isMoved) {
									isMoved = false;
									utils.removeClass(_this.thumbOuter, 'lg-dragging');
									if (Math.abs(endCoords - startCoords) < _this.core.s.swipeThreshold) {
										_this.thumbClickable = true;
									}
									_this.left = tempLeft;
								} else {
									_this.thumbClickable = true;
								}
							} else {
								_this.thumbClickable = true;
							}
						});
					};
					Thumbnail.prototype.toggle = function () {
						var _this = this;
						if (_this.core.s.toggleThumb) {
							utils.addClass(_this.core.outer, 'lg-can-toggle');
							_this.thumbOuter.insertAdjacentHTML('beforeend', '<span class="lg-toggle-thumb lg-icon"></span>');
							utils.on(_this.core.outer.querySelector('.lg-toggle-thumb'), 'click.lg', function () {
								if (utils.hasClass(_this.core.outer, 'lg-thumb-open')) {
									utils.removeClass(_this.core.outer, 'lg-thumb-open');
								} else {
									utils.addClass(_this.core.outer, 'lg-thumb-open');
								}
							});
						}
					};
					Thumbnail.prototype.thumbkeyPress = function () {
						var _this = this;
						utils.on(window, 'keydown.lgthumb', function (e) {
							if (e.keyCode === 38) {
								e.preventDefault();
								utils.addClass(_this.core.outer, 'lg-thumb-open');
							} else if (e.keyCode === 40) {
								e.preventDefault();
								utils.removeClass(_this.core.outer, 'lg-thumb-open');
							}
						});
					};
					Thumbnail.prototype.destroy = function () {
						if (this.core.s.thumbnail && this.core.items.length > 1) {
							utils.off(window, '.lgthumb');
							//https://github.com/sachinchoolur/lightgallery.js/issues/43#issuecomment-441119589
							if (this.thumbOuter.parentNode) {
								this.thumbOuter.parentNode.removeChild(this.thumbOuter);
							}
							//this.thumbOuter.parentNode.removeChild(this.thumbOuter);
							utils.removeClass(this.core.outer, 'lg-has-thumb');
							var lgScript = document.getElementsByClassName('lg-script');
							while (lgScript[0]) {
								lgScript[0].parentNode.removeChild(lgScript[0]);
							}
						}
					};
					window.lgModules.thumbnail = Thumbnail;
				});
			}, {}
		]
	}, {}, [1])(1);
});

/*global define, global, module, require, self, utils */
/**!
 * lg-zoom.js | 1.0.1 | December 22nd 2016
 * http://sachinchoolur.github.io/lg-zoom.js
 * Copyright (c) 2016 Sachin N;
 * @license GPLv3
 */
(function (f) {
	if (typeof exports === "object" && typeof module !== "undefined") {
		module.exports = f();
	} else if (typeof define === "function" && define.amd) {
		define([], f);
	} else {
		var g;
		if (typeof window !== "undefined") {
			g = window;
		} else if (typeof global !== "undefined") {
			g = global;
		} else if (typeof self !== "undefined") {
			g = self;
		} else {
			g = this;
		}
		g.LgZoom = f();
	}
})(function () {
	var define,
	module,
	exports;
	return (function e(t, n, r) {
		function s(o, u) {
			if (!n[o]) {
				if (!t[o]) {
					var a = typeof require == "function" && require;
					if (!u && a)
						return a(o, !0);
					if (i)
						return i(o, !0);
					var f = new Error("Cannot find module '" + o + "'");
					throw (f.code = "MODULE_NOT_FOUND",
					f);
				}
				var l = n[o] = {
					exports: {}
				};
				t[o][0].call(l.exports, function (e) {
					var n = t[o][1][e];
					return s(n ? n : e);
				}, l, l.exports, e, t, n, r);
			}
			return n[o].exports;
		}
		var i = typeof require == "function" && require;
		for (var o = 0; o < r.length; o++)
			s(r[o]);
		return s;
	})({
		1: [function (require, module, exports) {
				(function (global, factory) {
					if (typeof define === "function" && define.amd) {
						define([], factory);
					} else if (typeof exports !== "undefined") {
						factory();
					} else {
						var mod = {
							exports: {}
						};
						factory();
						global.lgZoom = mod.exports;
					}
				})(this, function () {
					'use strict';
					var _extends = Object.assign || function (target) {
						for (var i = 1; i < arguments.length; i++) {
							var source = arguments[i];
							for (var key in source) {
								if (Object.prototype.hasOwnProperty.call(source, key)) {
									target[key] = source[key];
								}
							}
						}
						return target;
					};
					var getUseLeft = function getUseLeft() {
						var useLeft = false;
						var isChrome = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
						if (isChrome && parseInt(isChrome[2], 10) < 54) {
							useLeft = true;
						}
						return useLeft;
					};
					var zoomDefaults = {
						scale: 1,
						zoom: true,
						actualSize: true,
						enableZoomAfter: 300,
						useLeftForZoom: getUseLeft()
					};
					var Zoom = function Zoom(element) {
						this.el = element;
						this.core = window.lgData[this.el.getAttribute('lg-uid')];
						this.core.s = _extends({}, zoomDefaults, this.core.s);
						if (this.core.s.zoom && this.core.doCss()) {
							this.init();
							// Store the zoomable timeout value just to clear it while closing
							this.zoomabletimeout = false;
							// Set the initial value center
							this.pageX = window.innerWidth / 2;
							this.pageY = window.innerHeight / 2 + (document.documentElement.scrollTop || document.body.scrollTop);
						}
						return this;
					};
					Zoom.prototype.init = function () {
						var _this = this;
						var zoomIcons = '<span id="lg-zoom-in" class="lg-icon"></span><span id="lg-zoom-out" class="lg-icon"></span>';
						if (_this.core.s.actualSize) {
							zoomIcons += '<span id="lg-actual-size" class="lg-icon"></span>';
						}
						if (_this.core.s.useLeftForZoom) {
							utils.addClass(_this.core.outer, 'lg-use-left-for-zoom');
						} else {
							utils.addClass(_this.core.outer, 'lg-use-transition-for-zoom');
						}
						this.core.outer.querySelector('.lg-toolbar').insertAdjacentHTML('beforeend', zoomIcons);
						// Add zoomable class
						utils.on(_this.core.el, 'onSlideItemLoad.lgtmzoom', function (event) {
							// delay will be 0 except first time
							var _speed = _this.core.s.enableZoomAfter + event.detail.delay;
							// set _speed value 0 if gallery opened from direct url and if it is first slide
							if (utils.hasClass(document.body, 'lg-from-hash') && event.detail.delay) {
								// will execute only once
								_speed = 0;
							} else {
								// Remove lg-from-hash to enable starting animation.
								utils.removeClass(document.body, 'lg-from-hash');
							}
							_this.zoomabletimeout = setTimeout(function () {
									utils.addClass(_this.core.___slide[event.detail.index], 'lg-zoomable');
								}, _speed + 30);
						});
						var scale = 1;
						/**
						 * @desc Image zoom
						 * Translate the wrap and scale the image to get better user experience
						 *
						 * @param {String} scaleVal - Zoom decrement/increment value
						 */
						var zoom = function zoom(scaleVal) {
							var image = _this.core.outer.querySelector('.lg-current .lg-image');
							var _x;
							var _y;
							// Find offset manually to avoid issue after zoom
							var offsetX = (window.innerWidth - image.clientWidth) / 2;
							var offsetY = (window.innerHeight - image.clientHeight) / 2 + (document.documentElement.scrollTop || document.body.scrollTop);
							_x = _this.pageX - offsetX;
							_y = _this.pageY - offsetY;
							var x = (scaleVal - 1) * _x;
							var y = (scaleVal - 1) * _y;
							utils.setVendor(image, 'Transform', 'scale3d(' + scaleVal + ', ' + scaleVal + ', 1)');
							image.setAttribute('data-scale', scaleVal);
							if (_this.core.s.useLeftForZoom) {
								image.parentElement.style.left = -x + 'px';
								image.parentElement.style.top = -y + 'px';
							} else {
								utils.setVendor(image.parentElement, 'Transform', 'translate3d(-' + x + 'px, -' + y + 'px, 0)');
							}
							image.parentElement.setAttribute('data-x', x);
							image.parentElement.setAttribute('data-y', y);
						};
						var callScale = function callScale() {
							if (scale > 1) {
								utils.addClass(_this.core.outer, 'lg-zoomed');
							} else {
								_this.resetZoom();
							}
							if (scale < 1) {
								scale = 1;
							}
							zoom(scale);
						};
						var actualSize = function actualSize(event, image, index, fromIcon) {
							var w = image.clientWidth;
							var nw;
							if (_this.core.s.dynamic) {
								nw = _this.core.s.dynamicEl[index].width || image.naturalWidth || w;
							} else {
								nw = _this.core.items[index].getAttribute('data-width') || image.naturalWidth || w;
							}
							var _scale;
							if (utils.hasClass(_this.core.outer, 'lg-zoomed')) {
								scale = 1;
							} else {
								if (nw > w) {
									_scale = nw / w;
									scale = _scale || 2;
								}
							}
							if (fromIcon) {
								_this.pageX = window.innerWidth / 2;
								_this.pageY = window.innerHeight / 2 + (document.documentElement.scrollTop || document.body.scrollTop);
							} else {
								_this.pageX = event.pageX || event.targetTouches[0].pageX;
								_this.pageY = event.pageY || event.targetTouches[0].pageY;
							}
							callScale();
							setTimeout(function () {
								utils.removeClass(_this.core.outer, 'lg-grabbing');
								utils.addClass(_this.core.outer, 'lg-grab');
							}, 10);
						};
						var tapped = false;
						// event triggered after appending slide content
						utils.on(_this.core.el, 'onAferAppendSlide.lgtmzoom', function (event) {
							var index = event.detail.index;
							// Get the current element
							var image = _this.core.___slide[index].querySelector('.lg-image');
							if (!_this.core.isTouch) {
								utils.on(image, 'dblclick', function (event) {
									actualSize(event, image, index);
								});
							}
							if (_this.core.isTouch) {
								utils.on(image, 'touchstart', function (event) {
									if (!tapped) {
										tapped = setTimeout(function () {
												tapped = null;
											}, 300);
									} else {
										clearTimeout(tapped);
										tapped = null;
										actualSize(event, image, index);
									}
									event.preventDefault();
								});
							}
						});
						// Update zoom on resize and orientationchange
						utils.on(window, 'resize.lgzoom scroll.lgzoom orientationchange.lgzoom', function () {
							_this.pageX = window.innerWidth / 2;
							_this.pageY = window.innerHeight / 2 + (document.documentElement.scrollTop || document.body.scrollTop);
							zoom(scale);
						});
						utils.on(document.getElementById('lg-zoom-out'), 'click.lg', function () {
							if (_this.core.outer.querySelector('.lg-current .lg-image')) {
								scale -= _this.core.s.scale;
								callScale();
							}
						});
						utils.on(document.getElementById('lg-zoom-in'), 'click.lg', function () {
							if (_this.core.outer.querySelector('.lg-current .lg-image')) {
								scale += _this.core.s.scale;
								callScale();
							}
						});
						utils.on(document.getElementById('lg-actual-size'), 'click.lg', function (event) {
							actualSize(event, _this.core.___slide[_this.core.index].querySelector('.lg-image'), _this.core.index, true);
						});
						// Reset zoom on slide change
						utils.on(_this.core.el, 'onBeforeSlide.lgtm', function () {
							scale = 1;
							_this.resetZoom();
						});
						// Drag option after zoom
						if (!_this.core.isTouch) {
							_this.zoomDrag();
						}
						if (_this.core.isTouch) {
							_this.zoomSwipe();
						}
					};
					// Reset zoom effect
					Zoom.prototype.resetZoom = function () {
						utils.removeClass(this.core.outer, 'lg-zoomed');
						for (var i = 0; i < this.core.___slide.length; i++) {
							if (this.core.___slide[i].querySelector('.lg-img-wrap')) {
								this.core.___slide[i].querySelector('.lg-img-wrap').removeAttribute('style');
								this.core.___slide[i].querySelector('.lg-img-wrap').removeAttribute('data-x');
								this.core.___slide[i].querySelector('.lg-img-wrap').removeAttribute('data-y');
							}
						}
						for (var j = 0; j < this.core.___slide.length; j++) {
							if (this.core.___slide[j].querySelector('.lg-image')) {
								this.core.___slide[j].querySelector('.lg-image').removeAttribute('style');
								this.core.___slide[j].querySelector('.lg-image').removeAttribute('data-scale');
							}
						}
						// Reset pagx pagy values to center
						this.pageX = window.innerWidth / 2;
						this.pageY = window.innerHeight / 2 + (document.documentElement.scrollTop || document.body.scrollTop);
					};
					Zoom.prototype.zoomSwipe = function () {
						var _this = this;
						var startCoords = {};
						var endCoords = {};
						var isMoved = false;
						// Allow x direction drag
						var allowX = false;
						// Allow Y direction drag
						var allowY = false;
						for (var i = 0; i < _this.core.___slide.length; i++) {
							/*jshint loopfunc: true */
							utils.on(_this.core.___slide[i], 'touchstart.lg', function (e) {
								if (utils.hasClass(_this.core.outer, 'lg-zoomed')) {
									var image = _this.core.___slide[_this.core.index].querySelector('.lg-object');
									allowY = image.offsetHeight * image.getAttribute('data-scale') > _this.core.outer.querySelector('.lg').clientHeight;
									allowX = image.offsetWidth * image.getAttribute('data-scale') > _this.core.outer.querySelector('.lg').clientWidth;
									if (allowX || allowY) {
										e.preventDefault();
										startCoords = {
											x: e.targetTouches[0].pageX,
											y: e.targetTouches[0].pageY
										};
									}
								}
							});
						}
						for (var j = 0; j < _this.core.___slide.length; j++) {
							/*jshint loopfunc: true */
							utils.on(_this.core.___slide[j], 'touchmove.lg', function (e) {
								if (utils.hasClass(_this.core.outer, 'lg-zoomed')) {
									var _el = _this.core.___slide[_this.core.index].querySelector('.lg-img-wrap');
									var distanceX;
									var distanceY;
									e.preventDefault();
									isMoved = true;
									endCoords = {
										x: e.targetTouches[0].pageX,
										y: e.targetTouches[0].pageY
									};
									// reset opacity and transition duration
									utils.addClass(_this.core.outer, 'lg-zoom-dragging');
									if (allowY) {
										distanceY = -Math.abs(_el.getAttribute('data-y')) + (endCoords.y - startCoords.y);
									} else {
										distanceY = -Math.abs(_el.getAttribute('data-y'));
									}
									if (allowX) {
										distanceX = -Math.abs(_el.getAttribute('data-x')) + (endCoords.x - startCoords.x);
									} else {
										distanceX = -Math.abs(_el.getAttribute('data-x'));
									}
									if (Math.abs(endCoords.x - startCoords.x) > 15 || Math.abs(endCoords.y - startCoords.y) > 15) {
										if (_this.core.s.useLeftForZoom) {
											_el.style.left = distanceX + 'px';
											_el.style.top = distanceY + 'px';
										} else {
											utils.setVendor(_el, 'Transform', 'translate3d(' + distanceX + 'px, ' + distanceY + 'px, 0)');
										}
									}
								}
							});
						}
						for (var k = 0; k < _this.core.___slide.length; k++) {
							/*jshint loopfunc: true */
							utils.on(_this.core.___slide[k], 'touchend.lg', function () {
								if (utils.hasClass(_this.core.outer, 'lg-zoomed')) {
									if (isMoved) {
										isMoved = false;
										utils.removeClass(_this.core.outer, 'lg-zoom-dragging');
										_this.touchendZoom(startCoords, endCoords, allowX, allowY);
									}
								}
							});
						}
					};
					Zoom.prototype.zoomDrag = function () {
						var _this = this;
						var startCoords = {};
						var endCoords = {};
						var isDraging = false;
						var isMoved = false;
						// Allow x direction drag
						var allowX = false;
						// Allow Y direction drag
						var allowY = false;
						for (var i = 0; i < _this.core.___slide.length; i++) {
							/*jshint loopfunc: true */
							utils.on(_this.core.___slide[i], 'mousedown.lgzoom', function (e) {
								// execute only on .lg-object
								var image = _this.core.___slide[_this.core.index].querySelector('.lg-object');
								allowY = image.offsetHeight * image.getAttribute('data-scale') > _this.core.outer.querySelector('.lg').clientHeight;
								allowX = image.offsetWidth * image.getAttribute('data-scale') > _this.core.outer.querySelector('.lg').clientWidth;
								if (utils.hasClass(_this.core.outer, 'lg-zoomed')) {
									if (utils.hasClass(e.target, 'lg-object') && (allowX || allowY)) {
										e.preventDefault();
										startCoords = {
											x: e.pageX,
											y: e.pageY
										};
										isDraging = true;
										// ** Fix for webkit cursor issue https://code.google.com/p/chromium/issues/detail?id=26723
										_this.core.outer.scrollLeft += 1;
										_this.core.outer.scrollLeft -= 1;
										utils.removeClass(_this.core.outer, 'lg-grab');
										utils.addClass(_this.core.outer, 'lg-grabbing');
									}
								}
							});
						}
						utils.on(window, 'mousemove.lgzoom', function (e) {
							if (isDraging) {
								var _el = _this.core.___slide[_this.core.index].querySelector('.lg-img-wrap');
								var distanceX;
								var distanceY;
								isMoved = true;
								endCoords = {
									x: e.pageX,
									y: e.pageY
								};
								// reset opacity and transition duration
								utils.addClass(_this.core.outer, 'lg-zoom-dragging');
								if (allowY) {
									distanceY = -Math.abs(_el.getAttribute('data-y')) + (endCoords.y - startCoords.y);
								} else {
									distanceY = -Math.abs(_el.getAttribute('data-y'));
								}
								if (allowX) {
									distanceX = -Math.abs(_el.getAttribute('data-x')) + (endCoords.x - startCoords.x);
								} else {
									distanceX = -Math.abs(_el.getAttribute('data-x'));
								}
								if (_this.core.s.useLeftForZoom) {
									_el.style.left = distanceX + 'px';
									_el.style.top = distanceY + 'px';
								} else {
									utils.setVendor(_el, 'Transform', 'translate3d(' + distanceX + 'px, ' + distanceY + 'px, 0)');
								}
							}
						});
						utils.on(window, 'mouseup.lgzoom', function (e) {
							if (isDraging) {
								isDraging = false;
								utils.removeClass(_this.core.outer, 'lg-zoom-dragging');
								// Fix for chrome mouse move on click
								if (isMoved && (startCoords.x !== endCoords.x || startCoords.y !== endCoords.y)) {
									endCoords = {
										x: e.pageX,
										y: e.pageY
									};
									_this.touchendZoom(startCoords, endCoords, allowX, allowY);
								}
								isMoved = false;
							}
							utils.removeClass(_this.core.outer, 'lg-grabbing');
							utils.addClass(_this.core.outer, 'lg-grab');
						});
					};
					Zoom.prototype.touchendZoom = function (startCoords, endCoords, allowX, allowY) {
						var _this = this;
						var _el = _this.core.___slide[_this.core.index].querySelector('.lg-img-wrap');
						var image = _this.core.___slide[_this.core.index].querySelector('.lg-object');
						var distanceX = -Math.abs(_el.getAttribute('data-x')) + (endCoords.x - startCoords.x);
						var distanceY = -Math.abs(_el.getAttribute('data-y')) + (endCoords.y - startCoords.y);
						var minY = (_this.core.outer.querySelector('.lg').clientHeight - image.offsetHeight) / 2;
						var maxY = Math.abs(image.offsetHeight * Math.abs(image.getAttribute('data-scale')) - _this.core.outer.querySelector('.lg').clientHeight + minY);
						var minX = (_this.core.outer.querySelector('.lg').clientWidth - image.offsetWidth) / 2;
						var maxX = Math.abs(image.offsetWidth * Math.abs(image.getAttribute('data-scale')) - _this.core.outer.querySelector('.lg').clientWidth + minX);
						if (Math.abs(endCoords.x - startCoords.x) > 15 || Math.abs(endCoords.y - startCoords.y) > 15) {
							if (allowY) {
								if (distanceY <= -maxY) {
									distanceY = -maxY;
								} else if (distanceY >= -minY) {
									distanceY = -minY;
								}
							}
							if (allowX) {
								if (distanceX <= -maxX) {
									distanceX = -maxX;
								} else if (distanceX >= -minX) {
									distanceX = -minX;
								}
							}
							if (allowY) {
								_el.setAttribute('data-y', Math.abs(distanceY));
							} else {
								distanceY = -Math.abs(_el.getAttribute('data-y'));
							}
							if (allowX) {
								_el.setAttribute('data-x', Math.abs(distanceX));
							} else {
								distanceX = -Math.abs(_el.getAttribute('data-x'));
							}
							if (_this.core.s.useLeftForZoom) {
								_el.style.left = distanceX + 'px';
								_el.style.top = distanceY + 'px';
							} else {
								utils.setVendor(_el, 'Transform', 'translate3d(' + distanceX + 'px, ' + distanceY + 'px, 0)');
							}
						}
					};
					Zoom.prototype.destroy = function () {
						var _this = this;
						// Unbind all events added by lightGallery zoom plugin
						utils.off(_this.core.el, '.lgzoom');
						utils.off(window, '.lgzoom');
						for (var i = 0; i < _this.core.___slide.length; i++) {
							utils.off(_this.core.___slide[i], '.lgzoom');
						}
						utils.off(_this.core.el, '.lgtmzoom');
						_this.resetZoom();
						clearTimeout(_this.zoomabletimeout);
						_this.zoomabletimeout = false;
					};
					window.lgModules.zoom = Zoom;
				});
			}, {}
		]
	}, {}, [1])(1);
});

/*global ActiveXObject, console */
(function (root, document) {
	"use strict";

	/* Helpers */
	Element.prototype.prependChild = function (child) {
		return this.insertBefore(child, this.firstChild);
	};

	Element.prototype.insertAfter = function (newNode, referenceNode) {
		return referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
	};

	var toArray = function toArray(obj) {
		if (!obj) {
			return [];
		}

		return Array.prototype.slice.call(obj);
	};

	var parseColor = function parseColor(color) {
		var RGB_match = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/;
		var hex_match = /^#(([0-9a-f]{1,2})([0-9a-f]{1,2})([0-9a-f]{1,2}))$/;

		var _color = color.toLowerCase();

		if (RGB_match.test(_color)) {
			return _color.match(RGB_match).slice(1);
		} else if (hex_match.test(_color)) {
			return _color.match(hex_match).slice(2).map(function (piece) {
				return parseInt(piece, 16);
			});
		}

		console.error("Unrecognized color format.");
		return null;
	};

	var calculateBrightness = function calculateBrightness(color) {
		return color.reduce(function (p, c) {
			return p + parseInt(c, 10);
		}, 0) / 3;
	};

	/*!
	 * @see {@link http://www.javascriptkit.com/javatutors/loadjavascriptcss2.shtml}
	 */
	var removeJsCssFile = function (filename, filetype) {
		var targetelement = filetype == "js" ? "script" : filetype == "css" ? "link" : "none";
		var targetattr = filetype == "js" ? "src" : filetype == "css" ? "href" : "none";
		var allsuspects = document.getElementsByTagName(targetelement) || "";
		for (var i = allsuspects.length; i >= 0; i--) {
			if (allsuspects[i] && allsuspects[i].getAttribute(targetattr) != null && allsuspects[i].getAttribute(targetattr).indexOf(filename) != -1) {
				allsuspects[i].parentNode.removeChild(allsuspects[i]);
				/* remove element by calling parentNode.removeChild() */
			}
		}
	};

	var _extends = function () {
		var _extends = Object.assign || function (target) {
			for (var i = 1; i < arguments.length; i++) {
				var source = arguments[i];
				for (var key in source) {
					if (Object.prototype.hasOwnProperty.call(source, key)) {
						target[key] = source[key];
					}
				}
			}
			return target;
		};
		return _extends.apply(this, arguments);
	};

	var parseDomFromString = function (responseText) {

		var tempDiv = document.createElement('div');
		tempDiv.innerHTML = responseText;
		return tempDiv;

	};

	/* Define UWP namespace */

	var UWP = {
		version: "2.0.0",

		/* Default config */
		config: {
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
		},

		/* Main init function */
		init: function init(params) {
			console.log("UWP.init()");
			/* Define main elements */

			UWP.head = document.head;
			UWP.body = document.body;
			UWP.pageTitle = document.createElement("h1");
			document.body.appendChild(UWP.pageTitle);
			UWP.header = document.createElement("header");
			document.body.appendChild(UWP.header);
			UWP.main = document.createElement("main");
			document.body.appendChild(UWP.main);
			/* Gets user-set config */

			UWP.getConfig(params);
			/* Set page title */

			UWP.pageTitle = UWP.config.pageTitle;
			/* Define additional variables */

			UWP.header.type = UWP.config.layoutType;
			UWP.body.setAttribute("data-layout-type", UWP.header.type);
			/* Handles clicking internal links */

			UWP.body.addEventListener("click", function (event) {
				if (event.target.getAttribute("data-target") !== null) {
					event.stopPropagation();
					event.preventDefault();
					UWP.navigate(event.target.getAttribute("data-target"));
				}
			});
			/* Gets navigation */

			UWP.getNavigation();
			/* Creates custom styles */

			UWP.createStyles();
			/* Handles navigation between pages */

			/* UWP.navigate(root.location.hash.split("=")[1], false); */
			UWP.navigate(root.location.hash.split(/#\//)[1], false);

			root.onhashchange = function () {
				/* UWP.navigate(root.location.hash.split("=")[1], false); */
				UWP.navigate(root.location.hash.split(/#\//)[1], false);
			};
			/* Prepares space for document's title, puts it in place */

			UWP.pageTitle = document.createElement("span");
			UWP.header.prependChild(UWP.pageTitle);
		},

		/* Gets document's navigation, puts it in place */
		getConfig: function getConfig(params) {
			console.log("UWP.getConfig()");
			UWP.config = _extends(UWP.config, params);
		},

		/* Gets document's navigation, puts it in place */
		getNavigation: function getNavigation(target) {
			console.log("UWP.getNavigation()");

			if (typeof target === "undefined") {
				target = UWP.config.navContainer;
			}

			function parseNavElement(el) {
				var elLabel = el ? el.getElementsByTagName("nav-label")[0] || "" : "";
				var navLabel = elLabel.textContent || "";
				var elTarget = el ? el.getElementsByTagName("nav-target")[0] || "" : "";
				var navTarget = elTarget.textContent || "";
				var elIcon = el ? el.getElementsByTagName("nav-icon")[0] || "" : "";
				var navIconSource = elIcon;
				var navElement = document.createElement("li");
				var navLink = document.createElement("a");
				/* jshint -W107 */
				navLink.href = "javascript:void(0);";
				/* jshint +W107 */
				navLink.title = navLabel;
				navLink.innerHTML = navLabel;

				if (navIconSource) {
					var navIcon = document.createElement("span");
					/* If that's a file, we'll create an img object with src pointed to it */

					if (/\.(jpg|png|gif|svg)/.test(navIconSource.textContent)) {
						var navIconImage = document.createElement("img");
						navIconImage.src = navIconSource.textContent;
						navIcon.appendChild(navIconImage);
					}
					/* ...otherwise, it must be Segoe MDL2 symbol */
					else {
						/* navIcon.innerHTML = navIconSource.textContent; */
						navIcon.innerHTML = navIconSource.innerHTML;
					}

					navLink.prependChild(navIcon);
				}

				navLink.addEventListener("click", function (event) {
					event.stopPropagation();
					event.preventDefault();
					/* if (root.location.hash !== "".concat("#", UWP.config.hashNavKey, "=", navTarget)) { */
					if (root.location.hash !== "".concat("#/", navTarget)) {
						UWP.menuList.classList.remove("active");
						UWP.navigate(navTarget);
					}
				});
				navLink.setAttribute("data-target", navTarget);
				navElement.appendChild(navLink);
				return navElement;
			}

			var URL = "".concat(UWP.config.includes, "/", target, ".html");

			var UWP_navigation_request = root.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");

			UWP_navigation_request.overrideMimeType("text/html;charset=utf-8");
			UWP_navigation_request.open("GET", URL, true);
			UWP_navigation_request.withCredentials = false;

			UWP_navigation_request.onreadystatechange = function () {

				if (UWP_navigation_request.status === 404 || UWP_navigation_request.status === 0) {
					console.log("Error XMLHttpRequest-ing file", UWP_navigation_request.status);
				} else if (UWP_navigation_request.readyState === 4 && UWP_navigation_request.status === 200 && UWP_navigation_request.responseText) {

					/* var parser = new DOMParser();
					var parsed = parser.parseFromString(UWP_navigation_request.responseText, "text/xml"); */
					var parsed = parseDomFromString(UWP_navigation_request.responseText);

					var elMainMenu = parsed.getElementsByTagName("nav-container")[0] || "";
					var navsSource = elMainMenu || "";
					UWP.nav = document.createElement("nav");
					/* Adds all the navigations to the DOM tree */

					var elList = navsSource ? navsSource.getElementsByTagName("nav-list") || "" : "";
					toArray(elList).forEach(function (navSource) {
						var navMain = document.createElement("ul");
						UWP.nav.appendChild(navMain);
						var elEl = navsSource ? navSource.getElementsByTagName("nav-item") || "" : "";
						toArray(elEl).forEach(function (el) {
							navMain.appendChild(parseNavElement(el));
						});
					});
					/* If navigation was constructed, adds it to the DOM tree and displays menu button */

					if (toArray(elList).length) {
						UWP.header.appendChild(UWP.nav);
						UWP.addMenuButton();
					}
				}
			};

			UWP_navigation_request.send(null);
		},

		/* Highlights current page in navigation */
		updateNavigation: function updateNavigation() {
			console.log("UWP.updateNavigation()");
			var nav = document.getElementsByTagName("nav")[0] || "";
			var navA = nav ? nav.getElementsByTagName("a") || "" : "";
			toArray(navA).forEach(function (link) {
				if (link.getAttribute("data-target") === UWP.config.currentPage) {
					link.parentElement.classList.add("active");
				} else {
					link.parentElement.classList.remove("active");
				}
			});
		},

		/* Creates custom styles based on config */
		createStyles: function createStyles() {
			console.log("UWP.createStyles()");
			UWP.customStyle = document.createElement("style");

			if (UWP.config.mainColor) {
				var mainColor_RGB = parseColor(UWP.config.mainColor);

				if (mainColor_RGB) {
					var mainColor_brightness = calculateBrightness(mainColor_RGB);

					if (mainColor_brightness >= 128) {
						UWP.body.classList.add("theme-light");
					} else {
						UWP.body.classList.add("theme-dark");
					}

					var mainColorDarkened = mainColor_RGB.map(function (color) {
							var newColor = color - 20;
							if (newColor < 0)
								newColor = 0;
							return newColor;
						});

					if (!UWP.config.mainColorDarkened) {
						UWP.config.mainColorDarkened = "rgb(".concat(mainColorDarkened, ")");
					}
				}
				/* var Darkened_RGB = parseColor(UWP.config.Darkened); */

				UWP.customStyle.innerHTML += "\n\t\t\t\t[data-layout-type=\"tabs\"] header {\n\t\t\t\t\tbackground: ".concat(UWP.config.mainColor, ";\n\t\t\t\t}\n\n\t\t\t\t[data-layout-type=\"overlay\"] header {\n\t\t\t\t\tbackground: ").concat(UWP.config.mainColor, ";\n\t\t\t\t}\n\t\t\t\t[data-layout-type=\"overlay\"] header nav:nth-of-type(1) {\n\t\t\t\t\tbackground-color: ").concat(UWP.config.mainColorDarkened, ";\n\t\t\t\t}\n\n\t\t\t\t[data-layout-type=\"docked-minimized\"] header {\n\t\t\t\t\tbackground: ").concat(UWP.config.mainColor, ";\n\t\t\t\t}\n\t\t\t\t[data-layout-type=\"docked-minimized\"] header nav:nth-of-type(1) {\n\t\t\t\t\tbackground: ").concat(UWP.config.mainColorDarkened, ";\n\t\t\t\t}\n\n\t\t\t\t[data-layout-type=\"docked\"] header {\n\t\t\t\t\tbackground: ").concat(UWP.config.mainColor, ";\n\t\t\t\t}\n\t\t\t\t[data-layout-type=\"docked\"] header nav:nth-of-type(1) {\n\t\t\t\t\tbackground: ").concat(UWP.config.mainColorDarkened, ";\n\t\t\t\t}\n\t\t\t");
			}

			if (UWP.config.activeColor) {
				var activeColor_RGB = parseColor(UWP.config.activeColor);

				if (activeColor_RGB) {
					var activeColor_brightness = calculateBrightness(activeColor_RGB);

					if (activeColor_brightness >= 128) {
						UWP.body.classList.add("active-light");
					} else {
						UWP.body.classList.add("active-dark");
					}
				}

				UWP.customStyle.innerHTML += "\n\t\t\t\t[data-layout-type=\"tabs\"] header nav:nth-of-type(1) ul li.active {\n\t\t\t\t\tcolor: ".concat(UWP.config.activeColor, ";\n\t\t\t\t\tborder-bottom-color: ").concat(UWP.config.activeColor, ";\n\t\t\t\t}\n\t\t\t\t[data-layout-type=\"overlay\"] header nav:nth-of-type(1) ul li.active {\n\t\t\t\t\tbackground-color: ").concat(UWP.config.activeColor, ";\n\t\t\t\t}\n\t\t\t\t[data-layout-type=\"docked-minimized\"] header nav:nth-of-type(1) ul li.active {\n\t\t\t\t\tbackground-color: ").concat(UWP.config.activeColor, ";\n\t\t\t\t}\n\t\t\t\t[data-layout-type=\"docked\"] header nav:nth-of-type(1) ul li.active {\n\t\t\t\t\tbackground-color: ").concat(UWP.config.activeColor, ";\n\t\t\t\t}\n\t\t\t");
			}

			if (UWP.customStyle.innerHTML.length) {
				UWP.body.appendChild(UWP.customStyle);
				/* UWP.body.insertBefore(UWP.customStyle, UWP.body.firstChild); */
			}
		},

		/* Puts a menu button in title bar */
		addMenuButton: function addMenuButton() {
			console.log("UWP.addMenuButton()");
			UWP.menuButton = document.createElement("button");
			/* UWP.menuButton.innerHTML = "&#xE700;"; */

			/* var GlobalNavButton = document.createElement("img");
			GlobalNavButton.src = "./static/img/svg/GlobalNavButton.svg";
			UWP.menuButton.appendChild(GlobalNavButton); */

			UWP.menuButton.innerHTML = '<svg width="1792" height="1792" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" transform="scale(1.75 1.75) translate(0 0)" d="M1024 320h-1024v-64h1024v64zm0 512h-1024v-64h1024v64zm0-256.5h-1024v-63.5h1024v63.5z"/></svg>';
			UWP.menuButton.setAttribute("aria-label", "Menu");

			var headerNav = UWP.header.getElementsByTagName("nav")[0] || "";

			UWP.menuList = headerNav || "";
			UWP.menuButton.addEventListener("click", function () {
				UWP.menuList.classList.toggle("active");
			});
			UWP.main.addEventListener("click", function () {
				UWP.menuList.classList.remove("active");
			});
			UWP.header.prependChild(UWP.menuButton);
		},

		/* Puts content in place */
		navigate: function navigate(target, addHistory) {
			console.log("UWP.navigate()");

			if (typeof target === "undefined") {
				target = UWP.config.home;
			}

			UWP.config.currentPage = target;
			/* Pushes history state */

			if (addHistory !== false) {
				/* history.pushState("", "", "".concat(root.location.href.split("#")[0], "#", UWP.config.hashNavKey, "=", target)); */
				history.pushState("", "", "".concat(root.location.href.split(/#\//)[0], "#/", target));
			}
			/* Clears the page content */

			UWP.main.classList.remove("error");
			UWP.main.innerHTML = "";
			/* Displays error message */

			function displayError(title) {
				UWP.main.classList.add("error");
				UWP.main.innerHTML = "\n\t\t\t\t<div class=\"error-container\">\n\t\t\t\t\t<h3>".concat(title, "</h3>\n\t\t\t\t\t<p>Ready for an adventure?</p>\n\t\t\t\t\t<p><a href=\"#\">Try again</a>\n\t\t\t\t</div>\n\t\t\t");
				var mainA = UWP.main.getElementsByTagName("a")[0] || "";
				mainA.addEventListener("click", function (event) {
					event.stopPropagation();
					event.preventDefault();
					UWP.navigate(target);
				});
				UWP.updateNavigation();
			}

			var URL = "".concat(UWP.config.includes, "/").concat(target, ".html");
			/* Requests page data */

			var UWP_navigate_request = root.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");

			UWP_navigate_request.overrideMimeType("text/html;charset=utf-8");
			UWP_navigate_request.open("GET", URL, true);
			UWP_navigate_request.withCredentials = false;

			UWP_navigate_request.onreadystatechange = function () {

				if (UWP_navigate_request.status === 404 || UWP_navigate_request.status === 0) {
					console.log("Error XMLHttpRequest-ing file", UWP_navigate_request.status);
					console.error("Something went wrong");
					displayError("Something went wrong");
				} else if (UWP_navigate_request.readyState === 4 && UWP_navigate_request.status === 200 && UWP_navigate_request.responseText) {

					/* var parser = new DOMParser();
					var parsed = parser.parseFromString(UWP_navigate_request.responseText, "text/xml"); */
					var parsed = parseDomFromString(UWP_navigate_request.responseText);

					var page = parsed.getElementsByTagName("page-container")[0] || "";

					if (!page) {
						console.error("Something went wrong");
						displayError("Something went wrong");
					}

					var elTitle = page ? page.getElementsByTagName("page-title")[0] || "" : "";
					var pageTitle = elTitle.textContent || "";
					var elBody = page ? page.getElementsByTagName("page-content")[0] || "" : "";
					var pageBody = elBody.innerHTML || "";
					var pageIncludeScript = page ? page.getElementsByTagName("include-script")[0] || "" : "";
					var pageIncludeStyle = page ? page.getElementsByTagName("include-style")[0] || "" : "";
					/* Puts the new content in place */

					UWP.main.innerHTML = "";
					UWP.main.innerHTML = pageBody;

					UWP.main.classList.remove("start-animation");

					/*!
					 * @see {@link https://stackoverflow.com/questions/30453078/uncaught-typeerror-cannot-set-property-offsetwidth-of-htmlelement-which-has/53089566#53089566}
					 */
					(function () {
						return UWP.main.offsetWidth;
					})();

					UWP.main.classList.add("start-animation");
					/* Puts the new page title in place */

					UWP.pageTitle.innerHTML = pageTitle;
					document.title = "".concat(pageTitle, " - ").concat(UWP.config.pageTitle);
					/* Runs defined script */

					if (pageIncludeScript) {
						var scriptName = pageIncludeScript.textContent;

						var _src = "".concat(UWP.config.includeScript, "/").concat(scriptName);

						removeJsCssFile(_src, "js");

						var script = document.createElement("script");
						script.setAttribute("src", _src);
						script.async = true;
						UWP.body.appendChild(script);
					}

					/* Loads defined style */

					if (pageIncludeStyle) {
						var styleName = pageIncludeStyle.textContent;

						var _href = "".concat(UWP.config.includeStyle, "/").concat(styleName);

						removeJsCssFile(_href, "css");

						var link = document.createElement("link");
						link.setAttribute("href", _href);
						link.setAttribute("property", "stylesheet");
						link.rel = "stylesheet";
						link.media = "all";
						/* UWP.head.appendChild(link); */
						UWP.body.appendChild(link);
					}

					UWP.updateNavigation();
				}
			};

			UWP_navigate_request.send(null);
		}
	};
	root.UWP = UWP;
})("undefined" !== typeof window ? window : void 0, document);

/*!
  LegoMushroom @legomushroom http://legomushroom.com
  MIT License 2014
 */
(function(){var e;e=function(){function e(e){this.o=null!=e?e:{},window.isAnyResizeEventInited||(this.vars(),this.redefineProto())}return e.prototype.vars=function(){return window.isAnyResizeEventInited=!0,this.allowedProtos=[HTMLDivElement,HTMLFormElement,HTMLLinkElement,HTMLBodyElement,HTMLParagraphElement,HTMLFieldSetElement,HTMLLegendElement,HTMLLabelElement,HTMLButtonElement,HTMLUListElement,HTMLOListElement,HTMLLIElement,HTMLHeadingElement,HTMLQuoteElement,HTMLPreElement,HTMLBRElement,HTMLFontElement,HTMLHRElement,HTMLModElement,HTMLParamElement,HTMLMapElement,HTMLTableElement,HTMLTableCaptionElement,HTMLImageElement,HTMLTableCellElement,HTMLSelectElement,HTMLInputElement,HTMLTextAreaElement,HTMLAnchorElement,HTMLObjectElement,HTMLTableColElement,HTMLTableSectionElement,HTMLTableRowElement],this.timerElements={img:1,textarea:1,input:1,embed:1,object:1,svg:1,canvas:1,tr:1,tbody:1,thead:1,tfoot:1,a:1,select:1,option:1,optgroup:1,dl:1,dt:1,br:1,basefont:1,font:1,col:1,iframe:1}},e.prototype.redefineProto=function(){var e,t,n,o;return t=this,o=function(){var o,i,r,a;for(r=this.allowedProtos,a=[],e=o=0,i=r.length;i>o;e=++o)n=r[e],null!=n.prototype&&a.push(function(e){var n,o;return n=e.prototype.addEventListener||e.prototype.attachEvent,function(n){var o;return o=function(){var e;return(this!==window||this!==document)&&(e="onresize"===arguments[0]&&!this.isAnyResizeEventInited,e&&t.handleResize({args:arguments,that:this})),n.apply(this,arguments)},e.prototype.addEventListener?e.prototype.addEventListener=o:e.prototype.attachEvent?e.prototype.attachEvent=o:void 0}(n),o=e.prototype.removeEventListener||e.prototype.detachEvent,function(t){var n;return n=function(){return this.isAnyResizeEventInited=!1,this.iframe&&this.removeChild(this.iframe),t.apply(this,arguments)},e.prototype.removeEventListener?e.prototype.removeEventListener=n:e.prototype.detachEvent?e.prototype.detachEvent=wrappedListener:void 0}(o)}(n));return a}.call(this)},e.prototype.handleResize=function(e){var t,n,o,i,r,a;return n=e.that,this.timerElements[n.tagName.toLowerCase()]?this.initTimer(n):(o=document.createElement("iframe"),n.appendChild(o),o.style.width="100%",o.style.height="100%",o.style.position="absolute",o.style.zIndex=-999,o.style.opacity=0,o.style.top=0,o.style.left=0,t=window.getComputedStyle?getComputedStyle(n):n.currentStyle,r="static"===t.position&&""===n.style.position,i=""===t.position&&""===n.style.position,(r||i)&&(n.style.position="relative"),null!=(a=o.contentWindow)&&(a.onresize=function(e){return function(){return e.dispatchEvent(n)}}(this)),n.iframe=o),n.isAnyResizeEventInited=!0},e.prototype.initTimer=function(e){var t,n;return n=0,t=0,this.interval=setInterval(function(o){return function(){var i,r;return r=e.offsetWidth,i=e.offsetHeight,r!==n||i!==t?(o.dispatchEvent(e),n=r,t=i):void 0}}(this),this.o.interval||200)},e.prototype.dispatchEvent=function(e){var t;return document.createEvent?(t=document.createEvent("HTMLEvents"),t.initEvent("onresize",!1,!1),e.dispatchEvent(t)):document.createEventObject?(t=document.createEventObject(),e.fireEvent("onresize",t)):!1},e.prototype.destroy=function(){var e,t,n,o,i,r,a;for(clearInterval(this.interval),this.interval=null,window.isAnyResizeEventInited=!1,t=this,r=this.allowedProtos,a=[],e=o=0,i=r.length;i>o;e=++o)n=r[e],null!=n.prototype&&a.push(function(e){var t;return t=e.prototype.addEventListener||e.prototype.attachEvent,e.prototype.addEventListener?e.prototype.addEventListener=Element.prototype.addEventListener:e.prototype.attachEvent&&(e.prototype.attachEvent=Element.prototype.attachEvent),e.prototype.removeEventListener?e.prototype.removeEventListener=Element.prototype.removeEventListener:e.prototype.detachEvent?e.prototype.detachEvent=Element.prototype.detachEvent:void 0}(n));return a},e}(),"function"==typeof define&&define.amd?define("any-resize-event",[],function(){return new e}):"object"==typeof module&&"object"==typeof module.exports?module.exports=new e:("undefined"!=typeof window&&null!==window&&(window.AnyResizeEvent=e),"undefined"!=typeof window&&null!==window&&(window.anyResizeEvent=new e))}).call(this);
var AdaptiveCards =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Size;
(function (Size) {
    Size[Size["Auto"] = 0] = "Auto";
    Size[Size["Stretch"] = 1] = "Stretch";
    Size[Size["Small"] = 2] = "Small";
    Size[Size["Medium"] = 3] = "Medium";
    Size[Size["Large"] = 4] = "Large";
})(Size = exports.Size || (exports.Size = {}));
var SizeUnit;
(function (SizeUnit) {
    SizeUnit[SizeUnit["Weight"] = 0] = "Weight";
    SizeUnit[SizeUnit["Pixel"] = 1] = "Pixel";
})(SizeUnit = exports.SizeUnit || (exports.SizeUnit = {}));
var TextSize;
(function (TextSize) {
    TextSize[TextSize["Small"] = 0] = "Small";
    TextSize[TextSize["Default"] = 1] = "Default";
    TextSize[TextSize["Medium"] = 2] = "Medium";
    TextSize[TextSize["Large"] = 3] = "Large";
    TextSize[TextSize["ExtraLarge"] = 4] = "ExtraLarge";
})(TextSize = exports.TextSize || (exports.TextSize = {}));
var Spacing;
(function (Spacing) {
    Spacing[Spacing["None"] = 0] = "None";
    Spacing[Spacing["Small"] = 1] = "Small";
    Spacing[Spacing["Default"] = 2] = "Default";
    Spacing[Spacing["Medium"] = 3] = "Medium";
    Spacing[Spacing["Large"] = 4] = "Large";
    Spacing[Spacing["ExtraLarge"] = 5] = "ExtraLarge";
    Spacing[Spacing["Padding"] = 6] = "Padding";
})(Spacing = exports.Spacing || (exports.Spacing = {}));
var TextWeight;
(function (TextWeight) {
    TextWeight[TextWeight["Lighter"] = 0] = "Lighter";
    TextWeight[TextWeight["Default"] = 1] = "Default";
    TextWeight[TextWeight["Bolder"] = 2] = "Bolder";
})(TextWeight = exports.TextWeight || (exports.TextWeight = {}));
var TextColor;
(function (TextColor) {
    TextColor[TextColor["Default"] = 0] = "Default";
    TextColor[TextColor["Dark"] = 1] = "Dark";
    TextColor[TextColor["Light"] = 2] = "Light";
    TextColor[TextColor["Accent"] = 3] = "Accent";
    TextColor[TextColor["Good"] = 4] = "Good";
    TextColor[TextColor["Warning"] = 5] = "Warning";
    TextColor[TextColor["Attention"] = 6] = "Attention";
})(TextColor = exports.TextColor || (exports.TextColor = {}));
var HorizontalAlignment;
(function (HorizontalAlignment) {
    HorizontalAlignment[HorizontalAlignment["Left"] = 0] = "Left";
    HorizontalAlignment[HorizontalAlignment["Center"] = 1] = "Center";
    HorizontalAlignment[HorizontalAlignment["Right"] = 2] = "Right";
})(HorizontalAlignment = exports.HorizontalAlignment || (exports.HorizontalAlignment = {}));
var VerticalAlignment;
(function (VerticalAlignment) {
    VerticalAlignment[VerticalAlignment["Top"] = 0] = "Top";
    VerticalAlignment[VerticalAlignment["Center"] = 1] = "Center";
    VerticalAlignment[VerticalAlignment["Bottom"] = 2] = "Bottom";
})(VerticalAlignment = exports.VerticalAlignment || (exports.VerticalAlignment = {}));
var ActionAlignment;
(function (ActionAlignment) {
    ActionAlignment[ActionAlignment["Left"] = 0] = "Left";
    ActionAlignment[ActionAlignment["Center"] = 1] = "Center";
    ActionAlignment[ActionAlignment["Right"] = 2] = "Right";
    ActionAlignment[ActionAlignment["Stretch"] = 3] = "Stretch";
})(ActionAlignment = exports.ActionAlignment || (exports.ActionAlignment = {}));
var ImageStyle;
(function (ImageStyle) {
    ImageStyle[ImageStyle["Default"] = 0] = "Default";
    ImageStyle[ImageStyle["Person"] = 1] = "Person";
})(ImageStyle = exports.ImageStyle || (exports.ImageStyle = {}));
var ShowCardActionMode;
(function (ShowCardActionMode) {
    ShowCardActionMode[ShowCardActionMode["Inline"] = 0] = "Inline";
    ShowCardActionMode[ShowCardActionMode["Popup"] = 1] = "Popup";
})(ShowCardActionMode = exports.ShowCardActionMode || (exports.ShowCardActionMode = {}));
var Orientation;
(function (Orientation) {
    Orientation[Orientation["Horizontal"] = 0] = "Horizontal";
    Orientation[Orientation["Vertical"] = 1] = "Vertical";
})(Orientation = exports.Orientation || (exports.Orientation = {}));
var BackgroundImageMode;
(function (BackgroundImageMode) {
    BackgroundImageMode[BackgroundImageMode["Stretch"] = 0] = "Stretch";
    BackgroundImageMode[BackgroundImageMode["RepeatHorizontally"] = 1] = "RepeatHorizontally";
    BackgroundImageMode[BackgroundImageMode["RepeatVertically"] = 2] = "RepeatVertically";
    BackgroundImageMode[BackgroundImageMode["Repeat"] = 3] = "Repeat";
})(BackgroundImageMode = exports.BackgroundImageMode || (exports.BackgroundImageMode = {}));
var ActionIconPlacement;
(function (ActionIconPlacement) {
    ActionIconPlacement[ActionIconPlacement["LeftOfTitle"] = 0] = "LeftOfTitle";
    ActionIconPlacement[ActionIconPlacement["AboveTitle"] = 1] = "AboveTitle";
})(ActionIconPlacement = exports.ActionIconPlacement || (exports.ActionIconPlacement = {}));
var InputTextStyle;
(function (InputTextStyle) {
    InputTextStyle[InputTextStyle["Text"] = 0] = "Text";
    InputTextStyle[InputTextStyle["Tel"] = 1] = "Tel";
    InputTextStyle[InputTextStyle["Url"] = 2] = "Url";
    InputTextStyle[InputTextStyle["Email"] = 3] = "Email";
})(InputTextStyle = exports.InputTextStyle || (exports.InputTextStyle = {}));
/*
    This should really be a string enum, e.g.
    
        export enum ContainerStyle {
            Default = "default",
            Emphasis = "emphasis"
        }

    However, some hosts do not use a version of TypeScript
    recent enough to understand string enums. This is
    a compatible construct that does not require using
    a more recent version of TypeScript.
*/
var ContainerStyle = /** @class */ (function () {
    function ContainerStyle() {
    }
    ContainerStyle.Default = "default";
    ContainerStyle.Emphasis = "emphasis";
    return ContainerStyle;
}());
exports.ContainerStyle = ContainerStyle;
var ValidationError;
(function (ValidationError) {
    ValidationError[ValidationError["Hint"] = 0] = "Hint";
    ValidationError[ValidationError["ActionTypeNotAllowed"] = 1] = "ActionTypeNotAllowed";
    ValidationError[ValidationError["CollectionCantBeEmpty"] = 2] = "CollectionCantBeEmpty";
    ValidationError[ValidationError["Deprecated"] = 3] = "Deprecated";
    ValidationError[ValidationError["ElementTypeNotAllowed"] = 4] = "ElementTypeNotAllowed";
    ValidationError[ValidationError["InteractivityNotAllowed"] = 5] = "InteractivityNotAllowed";
    ValidationError[ValidationError["InvalidPropertyValue"] = 6] = "InvalidPropertyValue";
    ValidationError[ValidationError["MissingCardType"] = 7] = "MissingCardType";
    ValidationError[ValidationError["PropertyCantBeNull"] = 8] = "PropertyCantBeNull";
    ValidationError[ValidationError["TooManyActions"] = 9] = "TooManyActions";
    ValidationError[ValidationError["UnknownActionType"] = 10] = "UnknownActionType";
    ValidationError[ValidationError["UnknownElementType"] = 11] = "UnknownElementType";
    ValidationError[ValidationError["UnsupportedCardVersion"] = 12] = "UnsupportedCardVersion";
})(ValidationError = exports.ValidationError || (exports.ValidationError = {}));
var ContainerFitStatus;
(function (ContainerFitStatus) {
    ContainerFitStatus[ContainerFitStatus["FullyInContainer"] = 0] = "FullyInContainer";
    ContainerFitStatus[ContainerFitStatus["Overflowing"] = 1] = "Overflowing";
    ContainerFitStatus[ContainerFitStatus["FullyOutOfContainer"] = 2] = "FullyOutOfContainer";
})(ContainerFitStatus = exports.ContainerFitStatus || (exports.ContainerFitStatus = {}));


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Enums = __webpack_require__(0);
/**
 * Fast UUID generator, RFC4122 version 4 compliant.
 * @author Jeff Ward (jcward.com).
 * @license MIT license
 * @link http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/21963136#21963136
 **/
var UUID = /** @class */ (function () {
    function UUID() {
    }
    UUID.generate = function () {
        var d0 = Math.random() * 0xffffffff | 0;
        var d1 = Math.random() * 0xffffffff | 0;
        var d2 = Math.random() * 0xffffffff | 0;
        var d3 = Math.random() * 0xffffffff | 0;
        return UUID.lut[d0 & 0xff] + UUID.lut[d0 >> 8 & 0xff] + UUID.lut[d0 >> 16 & 0xff] + UUID.lut[d0 >> 24 & 0xff] + '-' +
            UUID.lut[d1 & 0xff] + UUID.lut[d1 >> 8 & 0xff] + '-' + UUID.lut[d1 >> 16 & 0x0f | 0x40] + UUID.lut[d1 >> 24 & 0xff] + '-' +
            UUID.lut[d2 & 0x3f | 0x80] + UUID.lut[d2 >> 8 & 0xff] + '-' + UUID.lut[d2 >> 16 & 0xff] + UUID.lut[d2 >> 24 & 0xff] +
            UUID.lut[d3 & 0xff] + UUID.lut[d3 >> 8 & 0xff] + UUID.lut[d3 >> 16 & 0xff] + UUID.lut[d3 >> 24 & 0xff];
    };
    UUID.initialize = function () {
        for (var i = 0; i < 256; i++) {
            UUID.lut[i] = (i < 16 ? '0' : '') + i.toString(16);
        }
    };
    UUID.lut = [];
    return UUID;
}());
exports.UUID = UUID;
UUID.initialize();
exports.ContentTypes = {
    applicationJson: "application/json",
    applicationXWwwFormUrlencoded: "application/x-www-form-urlencoded"
};
function getValueOrDefault(obj, defaultValue) {
    return obj ? obj : defaultValue;
}
exports.getValueOrDefault = getValueOrDefault;
function isNullOrEmpty(value) {
    return value === undefined || value === null || value === "";
}
exports.isNullOrEmpty = isNullOrEmpty;
function appendChild(node, child) {
    if (child != null && child != undefined) {
        node.appendChild(child);
    }
}
exports.appendChild = appendChild;
function setProperty(target, propertyName, propertyValue, defaultValue) {
    if (defaultValue === void 0) { defaultValue = undefined; }
    if (propertyValue && (!defaultValue || defaultValue !== propertyValue)) {
        target[propertyName] = propertyValue;
    }
}
exports.setProperty = setProperty;
function setEnumProperty(enumType, target, propertyName, propertyValue, defaultValue) {
    if (defaultValue === undefined || defaultValue !== propertyValue) {
        target[propertyName] = enumType[propertyValue];
    }
}
exports.setEnumProperty = setEnumProperty;
function getEnumValueOrDefault(targetEnum, name, defaultValue) {
    if (isNullOrEmpty(name)) {
        return defaultValue;
    }
    for (var key in targetEnum) {
        var isValueProperty = parseInt(key, 10) >= 0;
        if (isValueProperty) {
            var value = targetEnum[key];
            if (value && typeof value === "string") {
                if (value.toLowerCase() === name.toLowerCase()) {
                    return parseInt(key, 10);
                }
            }
        }
    }
    return defaultValue;
}
exports.getEnumValueOrDefault = getEnumValueOrDefault;
function parseHostConfigEnum(targetEnum, value, defaultValue) {
    if (typeof value === "string") {
        return getEnumValueOrDefault(targetEnum, value, defaultValue);
    }
    else if (typeof value === "number") {
        return getValueOrDefault(value, defaultValue);
    }
    else {
        return defaultValue;
    }
}
exports.parseHostConfigEnum = parseHostConfigEnum;
function renderSeparation(separationDefinition, orientation) {
    if (separationDefinition.spacing > 0 || separationDefinition.lineThickness > 0) {
        var separator = document.createElement("div");
        if (orientation == Enums.Orientation.Horizontal) {
            if (separationDefinition.lineThickness) {
                separator.style.marginTop = (separationDefinition.spacing / 2) + "px";
                separator.style.paddingTop = (separationDefinition.spacing / 2) + "px";
                separator.style.borderTop = separationDefinition.lineThickness + "px solid " + stringToCssColor(separationDefinition.lineColor);
            }
            else {
                separator.style.height = separationDefinition.spacing + "px";
            }
        }
        else {
            if (separationDefinition.lineThickness) {
                separator.style.marginLeft = (separationDefinition.spacing / 2) + "px";
                separator.style.paddingLeft = (separationDefinition.spacing / 2) + "px";
                separator.style.borderLeft = separationDefinition.lineThickness + "px solid " + stringToCssColor(separationDefinition.lineColor);
            }
            else {
                separator.style.width = separationDefinition.spacing + "px";
            }
        }
        separator.style.overflow = "hidden";
        return separator;
    }
    else {
        return null;
    }
}
exports.renderSeparation = renderSeparation;
function stringToCssColor(color) {
    var regEx = /#([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})?/gi;
    var matches = regEx.exec(color);
    if (matches && matches[4]) {
        var a = parseInt(matches[1], 16) / 255;
        var r = parseInt(matches[2], 16);
        var g = parseInt(matches[3], 16);
        var b = parseInt(matches[4], 16);
        return "rgba(" + r + "," + g + "," + b + "," + a + ")";
    }
    else {
        return color;
    }
}
exports.stringToCssColor = stringToCssColor;
var StringWithSubstitutions = /** @class */ (function () {
    function StringWithSubstitutions() {
        this._isProcessed = false;
        this._original = null;
        this._processed = null;
    }
    StringWithSubstitutions.prototype.substituteInputValues = function (inputs, contentType) {
        this._processed = this._original;
        var regEx = /\{{2}([a-z0-9_$@]+).value\}{2}/gi;
        var matches;
        while ((matches = regEx.exec(this._original)) != null) {
            var matchedInput = null;
            for (var i = 0; i < inputs.length; i++) {
                if (inputs[i].id.toLowerCase() == matches[1].toLowerCase()) {
                    matchedInput = inputs[i];
                    break;
                }
            }
            if (matchedInput) {
                var valueForReplace = "";
                if (matchedInput.value) {
                    valueForReplace = matchedInput.value;
                }
                if (contentType === exports.ContentTypes.applicationJson) {
                    valueForReplace = JSON.stringify(valueForReplace);
                    valueForReplace = valueForReplace.slice(1, -1);
                }
                else if (contentType === exports.ContentTypes.applicationXWwwFormUrlencoded) {
                    valueForReplace = encodeURIComponent(valueForReplace);
                }
                this._processed = this._processed.replace(matches[0], valueForReplace);
            }
        }
        ;
        this._isProcessed = true;
    };
    StringWithSubstitutions.prototype.getOriginal = function () {
        return this._original;
    };
    StringWithSubstitutions.prototype.get = function () {
        if (!this._isProcessed) {
            return this._original;
        }
        else {
            return this._processed;
        }
    };
    StringWithSubstitutions.prototype.set = function (value) {
        this._original = value;
        this._isProcessed = false;
    };
    return StringWithSubstitutions;
}());
exports.StringWithSubstitutions = StringWithSubstitutions;
var SizeAndUnit = /** @class */ (function () {
    function SizeAndUnit(physicalSize, unit) {
        this.physicalSize = physicalSize;
        this.unit = unit;
    }
    SizeAndUnit.parse = function (input) {
        var result = new SizeAndUnit(0, Enums.SizeUnit.Weight);
        var regExp = /^([0-9]+)(px|\*)?$/g;
        var matches = regExp.exec(input);
        if (matches && matches.length >= 2) {
            result.physicalSize = parseInt(matches[1]);
            if (matches.length == 3) {
                if (matches[2] == "px") {
                    result.unit = Enums.SizeUnit.Pixel;
                }
            }
            return result;
        }
        throw new Error("Invalid size: " + input);
    };
    return SizeAndUnit;
}());
exports.SizeAndUnit = SizeAndUnit;
function truncate(element, maxHeight, lineHeight) {
    var fits = function () {
        // Allow a one pixel overflow to account for rounding differences
        // between browsers
        return maxHeight - element.scrollHeight >= -1.0;
    };
    if (fits())
        return;
    var fullText = element.innerHTML;
    var truncateAt = function (idx) {
        element.innerHTML = fullText.substring(0, idx) + '...';
    };
    var breakableIndices = findBreakableIndices(fullText);
    var lo = 0;
    var hi = breakableIndices.length;
    var bestBreakIdx = 0;
    // Do a binary search for the longest string that fits
    while (lo < hi) {
        var mid = Math.floor((lo + hi) / 2);
        truncateAt(breakableIndices[mid]);
        if (fits()) {
            bestBreakIdx = breakableIndices[mid];
            lo = mid + 1;
        }
        else {
            hi = mid;
        }
    }
    truncateAt(bestBreakIdx);
    // If we have extra room, try to expand the string letter by letter
    // (covers the case where we have to break in the middle of a long word)
    if (lineHeight && maxHeight - element.scrollHeight >= lineHeight - 1.0) {
        var idx = findNextCharacter(fullText, bestBreakIdx);
        while (idx < fullText.length) {
            truncateAt(idx);
            if (fits()) {
                bestBreakIdx = idx;
                idx = findNextCharacter(fullText, idx);
            }
            else {
                break;
            }
        }
        truncateAt(bestBreakIdx);
    }
}
exports.truncate = truncate;
function findBreakableIndices(html) {
    var results = [];
    var idx = findNextCharacter(html, -1);
    while (idx < html.length) {
        if (html[idx] == ' ') {
            results.push(idx);
        }
        idx = findNextCharacter(html, idx);
    }
    return results;
}
function findNextCharacter(html, currIdx) {
    currIdx += 1;
    // If we found the start of an HTML tag, keep advancing until we get
    // past it, so we don't end up truncating in the middle of the tag
    while (currIdx < html.length && html[currIdx] == '<') {
        while (currIdx < html.length && html[currIdx++] != '>')
            ;
    }
    return currIdx;
}
function getFitStatus(element, containerEnd) {
    var start = element.offsetTop;
    var end = start + element.clientHeight;
    if (end <= containerEnd) {
        return Enums.ContainerFitStatus.FullyInContainer;
    }
    else if (start < containerEnd) {
        return Enums.ContainerFitStatus.Overflowing;
    }
    else {
        return Enums.ContainerFitStatus.FullyOutOfContainer;
    }
}
exports.getFitStatus = getFitStatus;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Enums = __webpack_require__(0);
var Utils = __webpack_require__(1);
var TextColorDefinition = /** @class */ (function () {
    function TextColorDefinition(obj) {
        this.default = "#000000";
        this.subtle = "#666666";
        if (obj) {
            this.default = obj["default"] || this.default;
            this.subtle = obj["subtle"] || this.subtle;
        }
    }
    return TextColorDefinition;
}());
exports.TextColorDefinition = TextColorDefinition;
var AdaptiveCardConfig = /** @class */ (function () {
    function AdaptiveCardConfig(obj) {
        this.allowCustomStyle = false;
        if (obj) {
            this.allowCustomStyle = obj["allowCustomStyle"] || this.allowCustomStyle;
        }
    }
    return AdaptiveCardConfig;
}());
exports.AdaptiveCardConfig = AdaptiveCardConfig;
var ImageSetConfig = /** @class */ (function () {
    function ImageSetConfig(obj) {
        this.imageSize = Enums.Size.Medium;
        this.maxImageHeight = 100;
        if (obj) {
            this.imageSize = obj["imageSize"] != null ? obj["imageSize"] : this.imageSize;
            this.maxImageHeight = Utils.getValueOrDefault(obj["maxImageHeight"], 100);
        }
    }
    ImageSetConfig.prototype.toJSON = function () {
        return {
            imageSize: Enums.Size[this.imageSize],
            maxImageHeight: this.maxImageHeight
        };
    };
    return ImageSetConfig;
}());
exports.ImageSetConfig = ImageSetConfig;
var MediaConfig = /** @class */ (function () {
    function MediaConfig(obj) {
        this.allowInlinePlayback = true;
        if (obj) {
            this.defaultPoster = obj["defaultPoster"];
            this.allowInlinePlayback = obj["allowInlinePlayback"] || this.allowInlinePlayback;
        }
    }
    MediaConfig.prototype.toJSON = function () {
        return {
            defaultPoster: this.defaultPoster,
            allowInlinePlayback: this.allowInlinePlayback
        };
    };
    return MediaConfig;
}());
exports.MediaConfig = MediaConfig;
var FactTextDefinition = /** @class */ (function () {
    function FactTextDefinition(obj) {
        this.size = Enums.TextSize.Default;
        this.color = Enums.TextColor.Default;
        this.isSubtle = false;
        this.weight = Enums.TextWeight.Default;
        this.wrap = true;
        if (obj) {
            this.size = Utils.parseHostConfigEnum(Enums.TextSize, obj["size"], Enums.TextSize.Default);
            this.color = Utils.parseHostConfigEnum(Enums.TextColor, obj["color"], Enums.TextColor.Default);
            this.isSubtle = obj["isSubtle"] || this.isSubtle;
            this.weight = Utils.parseHostConfigEnum(Enums.TextWeight, obj["weight"], this.getDefaultWeight());
            this.wrap = obj["wrap"] != null ? obj["wrap"] : this.wrap;
        }
    }
    ;
    FactTextDefinition.prototype.getDefaultWeight = function () {
        return Enums.TextWeight.Default;
    };
    FactTextDefinition.prototype.toJSON = function () {
        return {
            size: Enums.TextSize[this.size],
            color: Enums.TextColor[this.color],
            isSubtle: this.isSubtle,
            weight: Enums.TextWeight[this.weight],
            wrap: this.wrap
        };
    };
    return FactTextDefinition;
}());
exports.FactTextDefinition = FactTextDefinition;
var FactTitleDefinition = /** @class */ (function (_super) {
    __extends(FactTitleDefinition, _super);
    function FactTitleDefinition(obj) {
        var _this = _super.call(this, obj) || this;
        _this.maxWidth = 150;
        _this.weight = Enums.TextWeight.Bolder;
        if (obj) {
            _this.maxWidth = obj["maxWidth"] != null ? obj["maxWidth"] : _this.maxWidth;
            _this.weight = Utils.parseHostConfigEnum(Enums.TextWeight, obj["weight"], Enums.TextWeight.Bolder);
        }
        return _this;
    }
    FactTitleDefinition.prototype.getDefaultWeight = function () {
        return Enums.TextWeight.Bolder;
    };
    return FactTitleDefinition;
}(FactTextDefinition));
exports.FactTitleDefinition = FactTitleDefinition;
var FactSetConfig = /** @class */ (function () {
    function FactSetConfig(obj) {
        this.title = new FactTitleDefinition();
        this.value = new FactTextDefinition();
        this.spacing = 10;
        if (obj) {
            this.title = new FactTitleDefinition(obj["title"]);
            this.value = new FactTextDefinition(obj["value"]);
            this.spacing = obj.spacing && obj.spacing != null ? obj.spacing && obj.spacing : this.spacing;
        }
    }
    return FactSetConfig;
}());
exports.FactSetConfig = FactSetConfig;
var ShowCardActionConfig = /** @class */ (function () {
    function ShowCardActionConfig(obj) {
        this.actionMode = Enums.ShowCardActionMode.Inline;
        this.inlineTopMargin = 16;
        this.style = Enums.ContainerStyle.Emphasis;
        if (obj) {
            this.actionMode = Utils.parseHostConfigEnum(Enums.ShowCardActionMode, obj["actionMode"], Enums.ShowCardActionMode.Inline);
            this.inlineTopMargin = obj["inlineTopMargin"] != null ? obj["inlineTopMargin"] : this.inlineTopMargin;
            this.style = obj["style"] && typeof obj["style"] === "string" ? obj["style"] : Enums.ContainerStyle.Emphasis;
        }
    }
    ShowCardActionConfig.prototype.toJSON = function () {
        return {
            actionMode: Enums.ShowCardActionMode[this.actionMode],
            inlineTopMargin: this.inlineTopMargin,
            style: this.style
        };
    };
    return ShowCardActionConfig;
}());
exports.ShowCardActionConfig = ShowCardActionConfig;
var ActionsConfig = /** @class */ (function () {
    function ActionsConfig(obj) {
        this.maxActions = 5;
        this.spacing = Enums.Spacing.Default;
        this.buttonSpacing = 20;
        this.showCard = new ShowCardActionConfig();
        this.preExpandSingleShowCardAction = false;
        this.actionsOrientation = Enums.Orientation.Horizontal;
        this.actionAlignment = Enums.ActionAlignment.Left;
        this.iconPlacement = Enums.ActionIconPlacement.LeftOfTitle;
        this.allowTitleToWrap = false;
        this.iconSize = 24;
        if (obj) {
            this.maxActions = obj["maxActions"] != null ? obj["maxActions"] : this.maxActions;
            this.spacing = Utils.parseHostConfigEnum(Enums.Spacing, obj.spacing && obj.spacing, Enums.Spacing.Default);
            this.buttonSpacing = obj["buttonSpacing"] != null ? obj["buttonSpacing"] : this.buttonSpacing;
            this.showCard = new ShowCardActionConfig(obj["showCard"]);
            this.preExpandSingleShowCardAction = Utils.getValueOrDefault(obj["preExpandSingleShowCardAction"], false);
            this.actionsOrientation = Utils.parseHostConfigEnum(Enums.Orientation, obj["actionsOrientation"], Enums.Orientation.Horizontal);
            this.actionAlignment = Utils.parseHostConfigEnum(Enums.ActionAlignment, obj["actionAlignment"], Enums.ActionAlignment.Left);
            this.iconPlacement = Utils.parseHostConfigEnum(Enums.ActionIconPlacement, obj["iconPlacement"], Enums.ActionIconPlacement.LeftOfTitle);
            this.allowTitleToWrap = obj["allowTitleToWrap"] != null ? obj["allowTitleToWrap"] : this.allowTitleToWrap;
            try {
                var sizeAndUnit = Utils.SizeAndUnit.parse(obj["iconSize"]);
                if (sizeAndUnit.unit == Enums.SizeUnit.Pixel) {
                    this.iconSize = sizeAndUnit.physicalSize;
                }
            }
            catch (e) {
                // Swallow this, keep default icon size
            }
        }
    }
    ActionsConfig.prototype.toJSON = function () {
        return {
            maxActions: this.maxActions,
            spacing: Enums.Spacing[this.spacing],
            buttonSpacing: this.buttonSpacing,
            showCard: this.showCard,
            preExpandSingleShowCardAction: this.preExpandSingleShowCardAction,
            actionsOrientation: Enums.Orientation[this.actionsOrientation],
            actionAlignment: Enums.ActionAlignment[this.actionAlignment]
        };
    };
    return ActionsConfig;
}());
exports.ActionsConfig = ActionsConfig;
var ContainerStyleDefinition = /** @class */ (function () {
    function ContainerStyleDefinition(obj) {
        this.foregroundColors = {
            default: new TextColorDefinition(),
            dark: new TextColorDefinition(),
            light: new TextColorDefinition(),
            accent: new TextColorDefinition(),
            good: new TextColorDefinition(),
            warning: new TextColorDefinition(),
            attention: new TextColorDefinition()
        };
        this.parse(obj);
    }
    ContainerStyleDefinition.prototype.getTextColorDefinitionOrDefault = function (obj, defaultValue) {
        return new TextColorDefinition(obj ? obj : defaultValue);
    };
    ContainerStyleDefinition.prototype.parse = function (obj) {
        if (obj) {
            this.backgroundColor = obj["backgroundColor"];
            if (obj.foregroundColors) {
                this.foregroundColors.default = this.getTextColorDefinitionOrDefault(obj.foregroundColors["default"], { default: "#333333", subtle: "#EE333333" });
                this.foregroundColors.dark = this.getTextColorDefinitionOrDefault(obj.foregroundColors["dark"], { default: "#000000", subtle: "#66000000" });
                this.foregroundColors.light = this.getTextColorDefinitionOrDefault(obj.foregroundColors["light"], { default: "#FFFFFF", subtle: "#33000000" });
                this.foregroundColors.accent = this.getTextColorDefinitionOrDefault(obj.foregroundColors["accent"], { default: "#2E89FC", subtle: "#882E89FC" });
                this.foregroundColors.good = this.getTextColorDefinitionOrDefault(obj.foregroundColors["good"], { default: "#54A254", subtle: "#DD54A254" });
                this.foregroundColors.warning = this.getTextColorDefinitionOrDefault(obj.foregroundColors["warning"], { default: "#E69500", subtle: "#DDE69500" });
                this.foregroundColors.attention = this.getTextColorDefinitionOrDefault(obj.foregroundColors["attention"], { default: "#CC3300", subtle: "#DDCC3300" });
            }
        }
    };
    Object.defineProperty(ContainerStyleDefinition.prototype, "isBuiltIn", {
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    return ContainerStyleDefinition;
}());
exports.ContainerStyleDefinition = ContainerStyleDefinition;
var BuiltInContainerStyleDefinition = /** @class */ (function (_super) {
    __extends(BuiltInContainerStyleDefinition, _super);
    function BuiltInContainerStyleDefinition() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(BuiltInContainerStyleDefinition.prototype, "isBuiltIn", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    return BuiltInContainerStyleDefinition;
}(ContainerStyleDefinition));
var ContainerStyleSet = /** @class */ (function () {
    function ContainerStyleSet(obj) {
        this._allStyles = {};
        this._allStyles[Enums.ContainerStyle.Default] = new BuiltInContainerStyleDefinition();
        this._allStyles[Enums.ContainerStyle.Emphasis] = new BuiltInContainerStyleDefinition();
        if (obj) {
            this._allStyles[Enums.ContainerStyle.Default].parse(obj[Enums.ContainerStyle.Default]);
            this._allStyles[Enums.ContainerStyle.Emphasis].parse(obj[Enums.ContainerStyle.Emphasis]);
            var customStyleArray = obj["customStyles"];
            if (customStyleArray && Array.isArray(customStyleArray)) {
                for (var _i = 0, customStyleArray_1 = customStyleArray; _i < customStyleArray_1.length; _i++) {
                    var customStyle = customStyleArray_1[_i];
                    if (customStyle) {
                        var styleName = customStyle["name"];
                        if (styleName && typeof styleName === "string") {
                            if (this._allStyles.hasOwnProperty(styleName)) {
                                this._allStyles[styleName].parse(customStyle["style"]);
                            }
                            else {
                                this._allStyles[styleName] = new ContainerStyleDefinition(customStyle["style"]);
                            }
                        }
                    }
                }
            }
        }
    }
    ContainerStyleSet.prototype.toJSON = function () {
        var _this = this;
        var customStyleArray = [];
        Object.keys(this._allStyles).forEach(function (key) {
            if (!_this._allStyles[key].isBuiltIn) {
                customStyleArray.push({
                    name: key,
                    style: _this._allStyles[key]
                });
            }
        });
        var result = {
            default: this.default,
            emphasis: this.emphasis
        };
        if (customStyleArray.length > 0) {
            result.customStyles = customStyleArray;
        }
        return result;
    };
    ContainerStyleSet.prototype.getStyleByName = function (name, defaultValue) {
        if (defaultValue === void 0) { defaultValue = null; }
        return this._allStyles.hasOwnProperty(name) ? this._allStyles[name] : defaultValue;
    };
    Object.defineProperty(ContainerStyleSet.prototype, "default", {
        get: function () {
            return this._allStyles[Enums.ContainerStyle.Default];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ContainerStyleSet.prototype, "emphasis", {
        get: function () {
            return this._allStyles[Enums.ContainerStyle.Emphasis];
        },
        enumerable: true,
        configurable: true
    });
    return ContainerStyleSet;
}());
exports.ContainerStyleSet = ContainerStyleSet;
var HostConfig = /** @class */ (function () {
    function HostConfig(obj) {
        this.choiceSetInputValueSeparator = ",";
        this.supportsInteractivity = true;
        this.fontFamily = "Segoe UI,Segoe,Segoe WP,Helvetica Neue,Helvetica,sans-serif";
        this.spacing = {
            small: 3,
            default: 8,
            medium: 20,
            large: 30,
            extraLarge: 40,
            padding: 15
        };
        this.separator = {
            lineThickness: 1,
            lineColor: "#EEEEEE"
        };
        this.fontSizes = {
            small: 12,
            default: 14,
            medium: 17,
            large: 21,
            extraLarge: 26
        };
        this.fontWeights = {
            lighter: 200,
            default: 400,
            bolder: 600
        };
        this.imageSizes = {
            small: 40,
            medium: 80,
            large: 160
        };
        this.containerStyles = new ContainerStyleSet();
        this.actions = new ActionsConfig();
        this.adaptiveCard = new AdaptiveCardConfig();
        this.imageSet = new ImageSetConfig();
        this.media = new MediaConfig();
        this.factSet = new FactSetConfig();
        this.cssClassNamePrefix = null;
        if (obj) {
            if (typeof obj === "string" || obj instanceof String) {
                obj = JSON.parse(obj);
            }
            this.choiceSetInputValueSeparator = (obj && typeof obj["choiceSetInputValueSeparator"] === "string") ? obj["choiceSetInputValueSeparator"] : this.choiceSetInputValueSeparator;
            this.supportsInteractivity = (obj && typeof obj["supportsInteractivity"] === "boolean") ? obj["supportsInteractivity"] : this.supportsInteractivity;
            this.fontFamily = obj["fontFamily"] || this.fontFamily;
            this.fontSizes = {
                small: obj.fontSizes && obj.fontSizes["small"] || this.fontSizes.small,
                default: obj.fontSizes && obj.fontSizes["default"] || this.fontSizes.default,
                medium: obj.fontSizes && obj.fontSizes["medium"] || this.fontSizes.medium,
                large: obj.fontSizes && obj.fontSizes["large"] || this.fontSizes.large,
                extraLarge: obj.fontSizes && obj.fontSizes["extraLarge"] || this.fontSizes.extraLarge
            };
            if (obj.lineHeights) {
                this.lineHeights = {
                    small: obj.lineHeights["small"],
                    default: obj.lineHeights["default"],
                    medium: obj.lineHeights["medium"],
                    large: obj.lineHeights["large"],
                    extraLarge: obj.lineHeights["extraLarge"]
                };
            }
            ;
            this.fontWeights = {
                lighter: obj.fontWeights && obj.fontWeights["lighter"] || this.fontWeights.lighter,
                default: obj.fontWeights && obj.fontWeights["default"] || this.fontWeights.default,
                bolder: obj.fontWeights && obj.fontWeights["bolder"] || this.fontWeights.bolder
            };
            this.imageSizes = {
                small: obj.imageSizes && obj.imageSizes["small"] || this.imageSizes.small,
                medium: obj.imageSizes && obj.imageSizes["medium"] || this.imageSizes.medium,
                large: obj.imageSizes && obj.imageSizes["large"] || this.imageSizes.large,
            };
            this.containerStyles = new ContainerStyleSet(obj["containerStyles"]);
            this.spacing = {
                small: obj.spacing && obj.spacing["small"] || this.spacing.small,
                default: obj.spacing && obj.spacing["default"] || this.spacing.default,
                medium: obj.spacing && obj.spacing["medium"] || this.spacing.medium,
                large: obj.spacing && obj.spacing["large"] || this.spacing.large,
                extraLarge: obj.spacing && obj.spacing["extraLarge"] || this.spacing.extraLarge,
                padding: obj.spacing && obj.spacing["padding"] || this.spacing.padding
            };
            this.separator = {
                lineThickness: obj.separator && obj.separator["lineThickness"] || this.separator.lineThickness,
                lineColor: obj.separator && obj.separator["lineColor"] || this.separator.lineColor
            };
            this.actions = new ActionsConfig(obj.actions || this.actions);
            this.adaptiveCard = new AdaptiveCardConfig(obj.adaptiveCard || this.adaptiveCard);
            this.imageSet = new ImageSetConfig(obj["imageSet"]);
            this.factSet = new FactSetConfig(obj["factSet"]);
        }
    }
    HostConfig.prototype.getEffectiveSpacing = function (spacing) {
        switch (spacing) {
            case Enums.Spacing.Small:
                return this.spacing.small;
            case Enums.Spacing.Default:
                return this.spacing.default;
            case Enums.Spacing.Medium:
                return this.spacing.medium;
            case Enums.Spacing.Large:
                return this.spacing.large;
            case Enums.Spacing.ExtraLarge:
                return this.spacing.extraLarge;
            case Enums.Spacing.Padding:
                return this.spacing.padding;
            default:
                return 0;
        }
    };
    HostConfig.prototype.makeCssClassName = function () {
        var classNames = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            classNames[_i] = arguments[_i];
        }
        var result = "";
        for (var i = 0; i < classNames.length; i++) {
            if (i > 0) {
                result += " ";
            }
            if (this.cssClassNamePrefix) {
                result += this.cssClassNamePrefix + "-";
            }
            result += classNames[i];
        }
        return result;
    };
    return HostConfig;
}());
exports.HostConfig = HostConfig;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(4);


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(5));
__export(__webpack_require__(0));
__export(__webpack_require__(2));
var utils_1 = __webpack_require__(1);
exports.getEnumValueOrDefault = utils_1.getEnumValueOrDefault;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Enums = __webpack_require__(0);
var Utils = __webpack_require__(1);
var HostConfig = __webpack_require__(2);
var TextFormatters = __webpack_require__(6);
function invokeSetCollection(action, collection) {
    if (action) {
        // Closest emulation of "internal" in TypeScript.
        action["setCollection"](collection);
    }
}
function isActionAllowed(action, forbiddenActionTypes) {
    if (forbiddenActionTypes) {
        for (var i = 0; i < forbiddenActionTypes.length; i++) {
            if (action.getJsonTypeName() === forbiddenActionTypes[i]) {
                return false;
            }
        }
    }
    return true;
}
function generateUniqueId() {
    return "__ac-" + Utils.UUID.generate();
}
function createActionInstance(json, errors) {
    var actionType = json["type"];
    var result = AdaptiveCard.actionTypeRegistry.createInstance(actionType);
    if (!result) {
        raiseParseError({
            error: Enums.ValidationError.UnknownActionType,
            message: "Unknown action type: " + actionType
        }, errors);
    }
    return result;
}
exports.createActionInstance = createActionInstance;
var SpacingDefinition = /** @class */ (function () {
    function SpacingDefinition(top, right, bottom, left) {
        if (top === void 0) { top = 0; }
        if (right === void 0) { right = 0; }
        if (bottom === void 0) { bottom = 0; }
        if (left === void 0) { left = 0; }
        this.left = 0;
        this.top = 0;
        this.right = 0;
        this.bottom = 0;
        this.top = top;
        this.right = right;
        this.bottom = bottom;
        this.left = left;
    }
    return SpacingDefinition;
}());
exports.SpacingDefinition = SpacingDefinition;
var PaddingDefinition = /** @class */ (function () {
    function PaddingDefinition(top, right, bottom, left) {
        if (top === void 0) { top = Enums.Spacing.None; }
        if (right === void 0) { right = Enums.Spacing.None; }
        if (bottom === void 0) { bottom = Enums.Spacing.None; }
        if (left === void 0) { left = Enums.Spacing.None; }
        this.top = Enums.Spacing.None;
        this.right = Enums.Spacing.None;
        this.bottom = Enums.Spacing.None;
        this.left = Enums.Spacing.None;
        this.top = top;
        this.right = right;
        this.bottom = bottom;
        this.left = left;
    }
    PaddingDefinition.prototype.toSpacingDefinition = function (hostConfig) {
        return new SpacingDefinition(hostConfig.getEffectiveSpacing(this.top), hostConfig.getEffectiveSpacing(this.right), hostConfig.getEffectiveSpacing(this.bottom), hostConfig.getEffectiveSpacing(this.left));
    };
    return PaddingDefinition;
}());
exports.PaddingDefinition = PaddingDefinition;
var SizeAndUnit = /** @class */ (function () {
    function SizeAndUnit(physicalSize, unit) {
        this.physicalSize = physicalSize;
        this.unit = unit;
    }
    SizeAndUnit.parse = function (input) {
        var result = new SizeAndUnit(0, Enums.SizeUnit.Weight);
        var regExp = /^([0-9]+)(px|\*)?$/g;
        var matches = regExp.exec(input);
        if (matches && matches.length >= 2) {
            result.physicalSize = parseInt(matches[1]);
            if (matches.length == 3) {
                if (matches[2] == "px") {
                    result.unit = Enums.SizeUnit.Pixel;
                }
            }
            return result;
        }
        throw new Error("Invalid size: " + input);
    };
    return SizeAndUnit;
}());
exports.SizeAndUnit = SizeAndUnit;
var CardElement = /** @class */ (function () {
    function CardElement() {
        this._lang = undefined;
        this._hostConfig = null;
        this._internalPadding = null;
        this._parent = null;
        this._renderedElement = null;
        this._separatorElement = null;
        this._isVisible = true;
        this._truncatedDueToOverflow = false;
        this._defaultRenderedElementDisplayMode = null;
        this._padding = null;
        this.horizontalAlignment = null;
        this.spacing = Enums.Spacing.Default;
        this.separator = false;
        this.height = "auto";
        this.customCssSelector = null;
    }
    CardElement.prototype.internalRenderSeparator = function () {
        return Utils.renderSeparation({
            spacing: this.hostConfig.getEffectiveSpacing(this.spacing),
            lineThickness: this.separator ? this.hostConfig.separator.lineThickness : null,
            lineColor: this.separator ? this.hostConfig.separator.lineColor : null
        }, this.separatorOrientation);
    };
    CardElement.prototype.updateRenderedElementVisibility = function () {
        if (this._renderedElement) {
            this._renderedElement.style.display = this._isVisible ? this._defaultRenderedElementDisplayMode : "none";
        }
        if (this._separatorElement) {
            if (this.parent && this.parent.isFirstElement(this)) {
                this._separatorElement.style.display = "none";
            }
            else {
                this._separatorElement.style.display = this._isVisible ? this._defaultRenderedElementDisplayMode : "none";
            }
        }
    };
    CardElement.prototype.hideElementDueToOverflow = function () {
        if (this._renderedElement && this._isVisible) {
            this._renderedElement.style.visibility = 'hidden';
            this._isVisible = false;
            raiseElementVisibilityChangedEvent(this, false);
        }
    };
    CardElement.prototype.showElementHiddenDueToOverflow = function () {
        if (this._renderedElement && !this._isVisible) {
            this._renderedElement.style.visibility = null;
            this._isVisible = true;
            raiseElementVisibilityChangedEvent(this, false);
        }
    };
    // Marked private to emulate internal access
    CardElement.prototype.handleOverflow = function (maxHeight) {
        if (this.isVisible || this.isHiddenDueToOverflow()) {
            var handled = this.truncateOverflow(maxHeight);
            // Even if we were unable to truncate the element to fit this time,
            // it still could have been previously truncated
            this._truncatedDueToOverflow = handled || this._truncatedDueToOverflow;
            if (!handled) {
                this.hideElementDueToOverflow();
            }
            else if (handled && !this._isVisible) {
                this.showElementHiddenDueToOverflow();
            }
        }
    };
    // Marked private to emulate internal access
    CardElement.prototype.resetOverflow = function () {
        var sizeChanged = false;
        if (this._truncatedDueToOverflow) {
            this.undoOverflowTruncation();
            this._truncatedDueToOverflow = false;
            sizeChanged = true;
        }
        if (this.isHiddenDueToOverflow) {
            this.showElementHiddenDueToOverflow();
        }
        return sizeChanged;
    };
    CardElement.prototype.createPlaceholderElement = function () {
        var element = document.createElement("div");
        element.style.border = "1px dashed #DDDDDD";
        element.style.padding = "4px";
        element.style.minHeight = "32px";
        element.style.fontSize = "10px";
        element.innerText = "Empty " + this.getJsonTypeName();
        return element;
    };
    CardElement.prototype.internalGetNonZeroPadding = function (padding, processTop, processRight, processBottom, processLeft) {
        if (processTop === void 0) { processTop = true; }
        if (processRight === void 0) { processRight = true; }
        if (processBottom === void 0) { processBottom = true; }
        if (processLeft === void 0) { processLeft = true; }
        if (processTop) {
            if (padding.top == Enums.Spacing.None) {
                padding.top = this.internalPadding.top;
            }
        }
        if (processRight) {
            if (padding.right == Enums.Spacing.None) {
                padding.right = this.internalPadding.right;
            }
        }
        if (processBottom) {
            if (padding.bottom == Enums.Spacing.None) {
                padding.bottom = this.internalPadding.bottom;
            }
        }
        if (processLeft) {
            if (padding.left == Enums.Spacing.None) {
                padding.left = this.internalPadding.left;
            }
        }
        if (this.parent) {
            this.parent.internalGetNonZeroPadding(padding, processTop && this.isAtTheVeryTop(), processRight && this.isAtTheVeryRight(), processBottom && this.isAtTheVeryBottom(), processLeft && this.isAtTheVeryLeft());
        }
    };
    CardElement.prototype.adjustRenderedElementSize = function (renderedElement) {
        if (this.height === "auto") {
            renderedElement.style.flex = "0 0 auto";
        }
        else {
            renderedElement.style.flex = "1 1 auto";
        }
    };
    /*
     * Called when this element overflows the bottom of the card.
     * maxHeight will be the amount of space still available on the card (0 if
     * the element is fully off the card).
     */
    CardElement.prototype.truncateOverflow = function (maxHeight) {
        // Child implementations should return true if the element handled
        // the truncation request such that its content fits within maxHeight,
        // false if the element should fall back to being hidden
        return false;
    };
    /*
     * This should reverse any changes performed in truncateOverflow().
     */
    CardElement.prototype.undoOverflowTruncation = function () { };
    CardElement.prototype.isDesignMode = function () {
        var rootElement = this.getRootElement();
        return rootElement instanceof AdaptiveCard && rootElement.designMode;
    };
    Object.defineProperty(CardElement.prototype, "useDefaultSizing", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CardElement.prototype, "allowCustomPadding", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CardElement.prototype, "defaultPadding", {
        get: function () {
            return new PaddingDefinition();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CardElement.prototype, "internalPadding", {
        get: function () {
            if (this._padding) {
                return this._padding;
            }
            else {
                return (this._internalPadding && this.allowCustomPadding) ? this._internalPadding : this.defaultPadding;
            }
        },
        set: function (value) {
            this._internalPadding = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CardElement.prototype, "separatorOrientation", {
        get: function () {
            return Enums.Orientation.Horizontal;
        },
        enumerable: true,
        configurable: true
    });
    CardElement.prototype.getPadding = function () {
        return this._padding;
    };
    CardElement.prototype.setPadding = function (value) {
        this._padding = value;
        if (this._padding) {
            AdaptiveCard.useAutomaticContainerBleeding = false;
        }
    };
    CardElement.prototype.toJSON = function () {
        var result = {};
        Utils.setProperty(result, "type", this.getJsonTypeName());
        Utils.setProperty(result, "id", this.id);
        if (this.horizontalAlignment !== null) {
            Utils.setEnumProperty(Enums.HorizontalAlignment, result, "horizontalAlignment", this.horizontalAlignment);
        }
        Utils.setEnumProperty(Enums.Spacing, result, "spacing", this.spacing, Enums.Spacing.Default);
        Utils.setProperty(result, "separator", this.separator, false);
        Utils.setProperty(result, "height", this.height, "auto");
        return result;
    };
    CardElement.prototype.setParent = function (value) {
        this._parent = value;
    };
    CardElement.prototype.getNonZeroPadding = function () {
        var padding = new PaddingDefinition();
        this.internalGetNonZeroPadding(padding);
        return padding;
    };
    CardElement.prototype.getForbiddenElementTypes = function () {
        return null;
    };
    CardElement.prototype.getForbiddenActionTypes = function () {
        return null;
    };
    CardElement.prototype.parse = function (json, errors) {
        raiseParseElementEvent(this, json, errors);
        this.id = json["id"];
        this.speak = json["speak"];
        this.horizontalAlignment = Utils.getEnumValueOrDefault(Enums.HorizontalAlignment, json["horizontalAlignment"], null);
        this.spacing = Utils.getEnumValueOrDefault(Enums.Spacing, json["spacing"], Enums.Spacing.Default);
        this.separator = json["separator"];
        var jsonSeparation = json["separation"];
        if (jsonSeparation !== undefined) {
            if (jsonSeparation === "none") {
                this.spacing = Enums.Spacing.None;
                this.separator = false;
            }
            else if (jsonSeparation === "strong") {
                this.spacing = Enums.Spacing.Large;
                this.separator = true;
            }
            else if (jsonSeparation === "default") {
                this.spacing = Enums.Spacing.Default;
                this.separator = false;
            }
            raiseParseError({
                error: Enums.ValidationError.Deprecated,
                message: "The \"separation\" property is deprecated and will be removed. Use the \"spacing\" and \"separator\" properties instead."
            }, errors);
        }
        var jsonHeight = json["height"];
        if (jsonHeight === "auto" || jsonHeight === "stretch") {
            this.height = jsonHeight;
        }
    };
    CardElement.prototype.getActionCount = function () {
        return 0;
    };
    CardElement.prototype.getActionAt = function (index) {
        throw new Error("Index out of range.");
    };
    CardElement.prototype.validate = function () {
        return [];
    };
    CardElement.prototype.remove = function () {
        if (this.parent && this.parent instanceof CardElementContainer) {
            return this.parent.removeItem(this);
        }
        return false;
    };
    CardElement.prototype.render = function () {
        this._renderedElement = this.internalRender();
        this._separatorElement = this.internalRenderSeparator();
        if (this._renderedElement) {
            if (this.customCssSelector) {
                this._renderedElement.classList.add(this.customCssSelector);
            }
            this._renderedElement.style.boxSizing = "border-box";
            this._defaultRenderedElementDisplayMode = this._renderedElement.style.display;
            this.adjustRenderedElementSize(this._renderedElement);
            this.updateLayout(false);
        }
        else if (this.isDesignMode()) {
            this._renderedElement = this.createPlaceholderElement();
        }
        return this._renderedElement;
    };
    CardElement.prototype.updateLayout = function (processChildren) {
        if (processChildren === void 0) { processChildren = true; }
        this.updateRenderedElementVisibility();
    };
    CardElement.prototype.indexOf = function (cardElement) {
        return -1;
    };
    CardElement.prototype.isRendered = function () {
        return this._renderedElement && this._renderedElement.offsetHeight > 0;
    };
    CardElement.prototype.isAtTheVeryTop = function () {
        return this.parent ? this.parent.isFirstElement(this) && this.parent.isAtTheVeryTop() : true;
    };
    CardElement.prototype.isFirstElement = function (element) {
        return true;
    };
    CardElement.prototype.isAtTheVeryBottom = function () {
        return this.parent ? this.parent.isLastElement(this) && this.parent.isAtTheVeryBottom() : true;
    };
    CardElement.prototype.isLastElement = function (element) {
        return true;
    };
    CardElement.prototype.isAtTheVeryLeft = function () {
        return this.parent ? this.parent.isLeftMostElement(this) && this.parent.isAtTheVeryLeft() : true;
    };
    CardElement.prototype.isBleeding = function () {
        return false;
    };
    CardElement.prototype.isLeftMostElement = function (element) {
        return true;
    };
    CardElement.prototype.isAtTheVeryRight = function () {
        return this.parent ? this.parent.isRightMostElement(this) && this.parent.isAtTheVeryRight() : true;
    };
    CardElement.prototype.isRightMostElement = function (element) {
        return true;
    };
    CardElement.prototype.isHiddenDueToOverflow = function () {
        return this._renderedElement && this._renderedElement.style.visibility == 'hidden';
    };
    CardElement.prototype.canContentBleed = function () {
        return this.parent ? this.parent.canContentBleed() : true;
    };
    CardElement.prototype.getRootElement = function () {
        var rootElement = this;
        while (rootElement.parent) {
            rootElement = rootElement.parent;
        }
        return rootElement;
    };
    CardElement.prototype.getParentContainer = function () {
        var currentElement = this.parent;
        while (currentElement) {
            if (currentElement instanceof Container) {
                return currentElement;
            }
            currentElement = currentElement.parent;
        }
        return null;
    };
    CardElement.prototype.getAllInputs = function () {
        return [];
    };
    CardElement.prototype.getResourceInformation = function () {
        return [];
    };
    CardElement.prototype.getElementById = function (id) {
        return this.id === id ? this : null;
    };
    CardElement.prototype.getActionById = function (id) {
        return null;
    };
    Object.defineProperty(CardElement.prototype, "lang", {
        get: function () {
            if (this._lang) {
                return this._lang;
            }
            else {
                if (this.parent) {
                    return this.parent.lang;
                }
                else {
                    return undefined;
                }
            }
        },
        set: function (value) {
            if (value && value != "") {
                var regEx = /^[a-z]{2,3}$/ig;
                var matches = regEx.exec(value);
                if (!matches) {
                    throw new Error("Invalid language identifier: " + value);
                }
            }
            this._lang = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CardElement.prototype, "hostConfig", {
        get: function () {
            if (this._hostConfig) {
                return this._hostConfig;
            }
            else {
                if (this.parent) {
                    return this.parent.hostConfig;
                }
                else {
                    return defaultHostConfig;
                }
            }
        },
        set: function (value) {
            this._hostConfig = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CardElement.prototype, "index", {
        get: function () {
            if (this.parent) {
                return this.parent.indexOf(this);
            }
            else {
                return 0;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CardElement.prototype, "isInteractive", {
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CardElement.prototype, "isStandalone", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CardElement.prototype, "parent", {
        get: function () {
            return this._parent;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CardElement.prototype, "isVisible", {
        get: function () {
            return this._isVisible;
        },
        set: function (value) {
            // If the element is going to be hidden, reset any changes that were due
            // to overflow truncation (this ensures that if the element is later
            // un-hidden it has the right content)
            if (AdaptiveCard.useAdvancedCardBottomTruncation && !value) {
                this.undoOverflowTruncation();
            }
            if (this._isVisible != value) {
                this._isVisible = value;
                this.updateRenderedElementVisibility();
                if (this._renderedElement) {
                    raiseElementVisibilityChangedEvent(this);
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CardElement.prototype, "hasVisibleSeparator", {
        get: function () {
            var parentContainer = this.getParentContainer();
            if (parentContainer) {
                return this.separatorElement && !parentContainer.isFirstElement(this);
            }
            else {
                return false;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CardElement.prototype, "renderedElement", {
        get: function () {
            return this._renderedElement;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CardElement.prototype, "separatorElement", {
        get: function () {
            return this._separatorElement;
        },
        enumerable: true,
        configurable: true
    });
    return CardElement;
}());
exports.CardElement = CardElement;
var CardElementContainer = /** @class */ (function (_super) {
    __extends(CardElementContainer, _super);
    function CardElementContainer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return CardElementContainer;
}(CardElement));
exports.CardElementContainer = CardElementContainer;
var TextBlock = /** @class */ (function (_super) {
    __extends(TextBlock, _super);
    function TextBlock() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._processedText = null;
        _this._selectAction = null;
        _this.size = Enums.TextSize.Default;
        _this.weight = Enums.TextWeight.Default;
        _this.color = Enums.TextColor.Default;
        _this.isSubtle = false;
        _this.wrap = false;
        _this.useMarkdown = true;
        return _this;
    }
    TextBlock.prototype.restoreOriginalContent = function () {
        var maxHeight = this.maxLines
            ? (this._computedLineHeight * this.maxLines) + 'px'
            : null;
        this.renderedElement.style.maxHeight = maxHeight;
        this.renderedElement.innerHTML = this._originalInnerHtml;
    };
    TextBlock.prototype.truncateIfSupported = function (maxHeight) {
        // For now, only truncate TextBlocks that contain just a single
        // paragraph -- since the maxLines calculation doesn't take into
        // account Markdown lists
        var children = this.renderedElement.children;
        var isTextOnly = !children.length;
        var truncationSupported = isTextOnly || children.length == 1
            && children[0].tagName.toLowerCase() == 'p';
        if (truncationSupported) {
            var element = isTextOnly
                ? this.renderedElement
                : children[0];
            Utils.truncate(element, maxHeight, this._computedLineHeight);
            return true;
        }
        return false;
    };
    TextBlock.prototype.getRenderedDomElementType = function () {
        return "div";
    };
    TextBlock.prototype.internalRender = function () {
        var _this = this;
        if (!Utils.isNullOrEmpty(this.text)) {
            var hostConfig = this.hostConfig;
            var element = document.createElement(this.getRenderedDomElementType());
            element.classList.add(hostConfig.makeCssClassName("ac-textBlock"));
            element.style.overflow = "hidden";
            this.applyStylesTo(element);
            if (this.selectAction) {
                element.onclick = function (e) {
                    _this.selectAction.execute();
                    e.cancelBubble = true;
                };
            }
            if (!this._processedText) {
                var formattedText = TextFormatters.formatText(this.lang, this.text);
                this._processedText = this.useMarkdown ? AdaptiveCard.processMarkdown(formattedText) : formattedText;
            }
            element.innerHTML = this._processedText;
            if (element.firstElementChild instanceof HTMLElement) {
                var firstElementChild = element.firstElementChild;
                firstElementChild.style.marginTop = "0px";
                firstElementChild.style.width = "100%";
                if (!this.wrap) {
                    firstElementChild.style.overflow = "hidden";
                    firstElementChild.style.textOverflow = "ellipsis";
                }
            }
            if (element.lastElementChild instanceof HTMLElement) {
                element.lastElementChild.style.marginBottom = "0px";
            }
            var anchors = element.getElementsByTagName("a");
            for (var i = 0; i < anchors.length; i++) {
                var anchor = anchors[i];
                anchor.classList.add(this.hostConfig.makeCssClassName("ac-anchor"));
                anchor.target = "_blank";
                anchor.onclick = function (e) {
                    if (raiseAnchorClickedEvent(_this, e.target)) {
                        e.preventDefault();
                    }
                };
            }
            if (this.wrap) {
                element.style.wordWrap = "break-word";
                if (this.maxLines > 0) {
                    element.style.maxHeight = (this._computedLineHeight * this.maxLines) + "px";
                    element.style.overflow = "hidden";
                }
            }
            else {
                element.style.whiteSpace = "nowrap";
                element.style.textOverflow = "ellipsis";
            }
            if (AdaptiveCard.useAdvancedTextBlockTruncation || AdaptiveCard.useAdvancedCardBottomTruncation) {
                this._originalInnerHtml = element.innerHTML;
            }
            if (this.selectAction != null && hostConfig.supportsInteractivity) {
                element.tabIndex = 0;
                element.setAttribute("role", "button");
                element.setAttribute("aria-label", this.selectAction.title);
                element.classList.add(hostConfig.makeCssClassName("ac-selectable"));
            }
            return element;
        }
        else {
            return null;
        }
    };
    TextBlock.prototype.truncateOverflow = function (maxHeight) {
        if (maxHeight >= this._computedLineHeight) {
            return this.truncateIfSupported(maxHeight);
        }
        return false;
    };
    TextBlock.prototype.undoOverflowTruncation = function () {
        this.restoreOriginalContent();
        if (AdaptiveCard.useAdvancedTextBlockTruncation && this.maxLines) {
            var maxHeight = this._computedLineHeight * this.maxLines;
            this.truncateIfSupported(maxHeight);
        }
    };
    TextBlock.prototype.toJSON = function () {
        var result = _super.prototype.toJSON.call(this);
        Utils.setEnumProperty(Enums.TextSize, result, "size", this.size, Enums.TextSize.Default);
        Utils.setEnumProperty(Enums.TextWeight, result, "weight", this.weight, Enums.TextWeight.Default);
        Utils.setEnumProperty(Enums.TextColor, result, "color", this.color, Enums.TextColor.Default);
        Utils.setProperty(result, "text", this.text);
        Utils.setProperty(result, "isSubtle", this.isSubtle, false);
        Utils.setProperty(result, "wrap", this.wrap, false);
        Utils.setProperty(result, "maxLines", this.maxLines, 0);
        return result;
    };
    TextBlock.prototype.applyStylesTo = function (targetElement) {
        if (this.hostConfig.fontFamily) {
            targetElement.style.fontFamily = this.hostConfig.fontFamily;
        }
        switch (this.horizontalAlignment) {
            case Enums.HorizontalAlignment.Center:
                targetElement.style.textAlign = "center";
                break;
            case Enums.HorizontalAlignment.Right:
                targetElement.style.textAlign = "right";
                break;
            default:
                targetElement.style.textAlign = "left";
                break;
        }
        var cssStyle = "text ";
        var fontSize;
        switch (this.size) {
            case Enums.TextSize.Small:
                fontSize = this.hostConfig.fontSizes.small;
                break;
            case Enums.TextSize.Medium:
                fontSize = this.hostConfig.fontSizes.medium;
                break;
            case Enums.TextSize.Large:
                fontSize = this.hostConfig.fontSizes.large;
                break;
            case Enums.TextSize.ExtraLarge:
                fontSize = this.hostConfig.fontSizes.extraLarge;
                break;
            default:
                fontSize = this.hostConfig.fontSizes.default;
                break;
        }
        if (this.hostConfig.lineHeights) {
            switch (this.size) {
                case Enums.TextSize.Small:
                    this._computedLineHeight = this.hostConfig.lineHeights.small;
                    break;
                case Enums.TextSize.Medium:
                    this._computedLineHeight = this.hostConfig.lineHeights.medium;
                    break;
                case Enums.TextSize.Large:
                    this._computedLineHeight = this.hostConfig.lineHeights.large;
                    break;
                case Enums.TextSize.ExtraLarge:
                    this._computedLineHeight = this.hostConfig.lineHeights.extraLarge;
                    break;
                default:
                    this._computedLineHeight = this.hostConfig.lineHeights.default;
                    break;
            }
        }
        else {
            // Looks like 1.33 is the magic number to compute line-height
            // from font size.
            this._computedLineHeight = fontSize * 1.33;
        }
        targetElement.style.fontSize = fontSize + "px";
        targetElement.style.lineHeight = this._computedLineHeight + "px";
        var parentContainer = this.getParentContainer();
        var styleDefinition = this.hostConfig.containerStyles.getStyleByName(parentContainer ? parentContainer.style : Enums.ContainerStyle.Default, this.hostConfig.containerStyles.default);
        var actualTextColor = this.color ? this.color : Enums.TextColor.Default;
        var colorDefinition;
        switch (actualTextColor) {
            case Enums.TextColor.Accent:
                colorDefinition = styleDefinition.foregroundColors.accent;
                break;
            case Enums.TextColor.Dark:
                colorDefinition = styleDefinition.foregroundColors.dark;
                break;
            case Enums.TextColor.Light:
                colorDefinition = styleDefinition.foregroundColors.light;
                break;
            case Enums.TextColor.Good:
                colorDefinition = styleDefinition.foregroundColors.good;
                break;
            case Enums.TextColor.Warning:
                colorDefinition = styleDefinition.foregroundColors.warning;
                break;
            case Enums.TextColor.Attention:
                colorDefinition = styleDefinition.foregroundColors.attention;
                break;
            default:
                colorDefinition = styleDefinition.foregroundColors.default;
                break;
        }
        targetElement.style.color = Utils.stringToCssColor(this.isSubtle ? colorDefinition.subtle : colorDefinition.default);
        var fontWeight;
        switch (this.weight) {
            case Enums.TextWeight.Lighter:
                fontWeight = this.hostConfig.fontWeights.lighter;
                break;
            case Enums.TextWeight.Bolder:
                fontWeight = this.hostConfig.fontWeights.bolder;
                break;
            default:
                fontWeight = this.hostConfig.fontWeights.default;
                break;
        }
        targetElement.style.fontWeight = fontWeight.toString();
    };
    TextBlock.prototype.parse = function (json, errors) {
        _super.prototype.parse.call(this, json, errors);
        this.text = json["text"];
        var sizeString = json["size"];
        if (sizeString && typeof sizeString === "string" && sizeString.toLowerCase() === "normal") {
            this.size = Enums.TextSize.Default;
            raiseParseError({
                error: Enums.ValidationError.Deprecated,
                message: "The TextBlock.size value \"normal\" is deprecated and will be removed. Use \"default\" instead."
            }, errors);
        }
        else {
            this.size = Utils.getEnumValueOrDefault(Enums.TextSize, sizeString, this.size);
        }
        var weightString = json["weight"];
        if (weightString && typeof weightString === "string" && weightString.toLowerCase() === "normal") {
            this.weight = Enums.TextWeight.Default;
            raiseParseError({
                error: Enums.ValidationError.Deprecated,
                message: "The TextBlock.weight value \"normal\" is deprecated and will be removed. Use \"default\" instead."
            }, errors);
        }
        else {
            this.weight = Utils.getEnumValueOrDefault(Enums.TextWeight, weightString, this.weight);
        }
        this.color = Utils.getEnumValueOrDefault(Enums.TextColor, json["color"], this.color);
        this.isSubtle = json["isSubtle"];
        this.wrap = json["wrap"] === undefined ? false : json["wrap"];
        if (typeof json["maxLines"] === "number") {
            this.maxLines = json["maxLines"];
        }
    };
    TextBlock.prototype.getJsonTypeName = function () {
        return "TextBlock";
    };
    TextBlock.prototype.renderSpeech = function () {
        if (this.speak != null)
            return this.speak + '\n';
        if (this.text)
            return '<s>' + this.text + '</s>\n';
        return null;
    };
    TextBlock.prototype.updateLayout = function (processChildren) {
        if (processChildren === void 0) { processChildren = false; }
        _super.prototype.updateLayout.call(this, processChildren);
        if (AdaptiveCard.useAdvancedTextBlockTruncation && this.maxLines && this.isRendered()) {
            // Reset the element's innerHTML in case the available room for
            // content has increased
            this.restoreOriginalContent();
            var maxHeight = this._computedLineHeight * this.maxLines;
            this.truncateIfSupported(maxHeight);
        }
    };
    Object.defineProperty(TextBlock.prototype, "text", {
        get: function () {
            return this._text;
        },
        set: function (value) {
            if (this._text != value) {
                this._text = value;
                this._processedText = null;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextBlock.prototype, "selectAction", {
        get: function () {
            return this._selectAction;
        },
        set: function (value) {
            this._selectAction = value;
            if (this._selectAction) {
                this._selectAction.setParent(this);
            }
        },
        enumerable: true,
        configurable: true
    });
    return TextBlock;
}(CardElement));
exports.TextBlock = TextBlock;
var Label = /** @class */ (function (_super) {
    __extends(Label, _super);
    function Label() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Label.prototype.getRenderedDomElementType = function () {
        return "label";
    };
    Label.prototype.internalRender = function () {
        var renderedElement = _super.prototype.internalRender.call(this);
        if (!Utils.isNullOrEmpty(this.forElementId)) {
            renderedElement.htmlFor = this.forElementId;
        }
        return renderedElement;
    };
    return Label;
}(TextBlock));
var Fact = /** @class */ (function () {
    function Fact(name, value) {
        if (name === void 0) { name = undefined; }
        if (value === void 0) { value = undefined; }
        this.name = name;
        this.value = value;
    }
    Fact.prototype.toJSON = function () {
        return { title: this.name, value: this.value };
    };
    Fact.prototype.renderSpeech = function () {
        if (this.speak != null) {
            return this.speak + '\n';
        }
        return '<s>' + this.name + ' ' + this.value + '</s>\n';
    };
    return Fact;
}());
exports.Fact = Fact;
var FactSet = /** @class */ (function (_super) {
    __extends(FactSet, _super);
    function FactSet() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.facts = [];
        return _this;
    }
    Object.defineProperty(FactSet.prototype, "useDefaultSizing", {
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    FactSet.prototype.internalRender = function () {
        var element = null;
        var hostConfig = this.hostConfig;
        if (this.facts.length > 0) {
            element = document.createElement("table");
            element.style.borderWidth = "0px";
            element.style.borderSpacing = "0px";
            element.style.borderStyle = "none";
            element.style.borderCollapse = "collapse";
            element.style.display = "block";
            element.style.overflow = "hidden";
            element.classList.add(hostConfig.makeCssClassName("ac-factset"));
            for (var i = 0; i < this.facts.length; i++) {
                var trElement = document.createElement("tr");
                if (i > 0) {
                    trElement.style.marginTop = this.hostConfig.factSet.spacing + "px";
                }
                var tdElement = document.createElement("td");
                tdElement.style.padding = "0";
                tdElement.classList.add(hostConfig.makeCssClassName("ac-fact-title"));
                if (this.hostConfig.factSet.title.maxWidth) {
                    tdElement.style.maxWidth = this.hostConfig.factSet.title.maxWidth + "px";
                }
                tdElement.style.verticalAlign = "top";
                var textBlock = new TextBlock();
                textBlock.hostConfig = this.hostConfig;
                textBlock.text = Utils.isNullOrEmpty(this.facts[i].name) ? "Title" : this.facts[i].name;
                textBlock.size = this.hostConfig.factSet.title.size;
                textBlock.color = this.hostConfig.factSet.title.color;
                textBlock.isSubtle = this.hostConfig.factSet.title.isSubtle;
                textBlock.weight = this.hostConfig.factSet.title.weight;
                textBlock.wrap = this.hostConfig.factSet.title.wrap;
                textBlock.spacing = Enums.Spacing.None;
                Utils.appendChild(tdElement, textBlock.render());
                Utils.appendChild(trElement, tdElement);
                tdElement = document.createElement("td");
                tdElement.style.padding = "0px 0px 0px 10px";
                tdElement.style.verticalAlign = "top";
                tdElement.classList.add(hostConfig.makeCssClassName("ac-fact-value"));
                textBlock = new TextBlock();
                textBlock.hostConfig = this.hostConfig;
                textBlock.text = Utils.isNullOrEmpty(this.facts[i].value) ? "Value" : this.facts[i].value;
                textBlock.size = this.hostConfig.factSet.value.size;
                textBlock.color = this.hostConfig.factSet.value.color;
                textBlock.isSubtle = this.hostConfig.factSet.value.isSubtle;
                textBlock.weight = this.hostConfig.factSet.value.weight;
                textBlock.wrap = this.hostConfig.factSet.value.wrap;
                textBlock.spacing = Enums.Spacing.None;
                Utils.appendChild(tdElement, textBlock.render());
                Utils.appendChild(trElement, tdElement);
                Utils.appendChild(element, trElement);
            }
        }
        return element;
    };
    FactSet.prototype.getJsonTypeName = function () {
        return "FactSet";
    };
    FactSet.prototype.toJSON = function () {
        var result = _super.prototype.toJSON.call(this);
        var facts = [];
        for (var _i = 0, _a = this.facts; _i < _a.length; _i++) {
            var fact = _a[_i];
            facts.push(fact.toJSON());
        }
        Utils.setProperty(result, "facts", facts);
        return result;
    };
    FactSet.prototype.parse = function (json, errors) {
        _super.prototype.parse.call(this, json, errors);
        this.facts = [];
        if (json["facts"] != null) {
            var jsonFacts = json["facts"];
            this.facts = [];
            for (var i = 0; i < jsonFacts.length; i++) {
                var fact = new Fact();
                fact.name = jsonFacts[i]["title"];
                fact.value = jsonFacts[i]["value"];
                fact.speak = jsonFacts[i]["speak"];
                this.facts.push(fact);
            }
        }
    };
    FactSet.prototype.renderSpeech = function () {
        if (this.speak != null) {
            return this.speak + '\n';
        }
        // render each fact
        var speak = null;
        if (this.facts.length > 0) {
            speak = '';
            for (var i = 0; i < this.facts.length; i++) {
                var speech = this.facts[i].renderSpeech();
                if (speech) {
                    speak += speech;
                }
            }
        }
        return '<p>' + speak + '\n</p>\n';
    };
    return FactSet;
}(CardElement));
exports.FactSet = FactSet;
var Image = /** @class */ (function (_super) {
    __extends(Image, _super);
    function Image() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.style = Enums.ImageStyle.Default;
        _this.size = Enums.Size.Auto;
        _this.pixelWidth = null;
        _this.pixelHeight = null;
        _this.altText = "";
        return _this;
    }
    Image.prototype.parseDimension = function (name, value, errors) {
        if (value) {
            if (typeof value === "string") {
                try {
                    var size = Utils.SizeAndUnit.parse(value);
                    if (size.unit == Enums.SizeUnit.Pixel) {
                        return size.physicalSize;
                    }
                }
                catch (_a) {
                    // Ignore error
                }
            }
            raiseParseError({
                error: Enums.ValidationError.InvalidPropertyValue,
                message: "Invalid image " + name + ": " + value
            }, errors);
        }
        return 0;
    };
    Image.prototype.applySize = function (element) {
        if (this.pixelWidth || this.pixelHeight) {
            if (this.pixelWidth) {
                element.style.width = this.pixelWidth + "px";
            }
            if (this.pixelHeight) {
                element.style.height = this.pixelHeight + "px";
            }
        }
        else {
            switch (this.size) {
                case Enums.Size.Stretch:
                    element.style.width = "100%";
                    break;
                case Enums.Size.Auto:
                    element.style.maxWidth = "100%";
                    break;
                case Enums.Size.Small:
                    element.style.width = this.hostConfig.imageSizes.small + "px";
                    break;
                case Enums.Size.Large:
                    element.style.width = this.hostConfig.imageSizes.large + "px";
                    break;
                case Enums.Size.Medium:
                    element.style.width = this.hostConfig.imageSizes.medium + "px";
                    break;
            }
        }
    };
    Object.defineProperty(Image.prototype, "useDefaultSizing", {
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Image.prototype.internalRender = function () {
        var _this = this;
        var element = null;
        if (!Utils.isNullOrEmpty(this.url)) {
            element = document.createElement("div");
            element.style.display = "flex";
            element.style.alignItems = "flex-start";
            element.onkeypress = function (e) {
                if (_this.selectAction) {
                    if (e.keyCode == 13 || e.keyCode == 32) { // enter or space pressed
                        _this.selectAction.execute();
                    }
                }
            };
            element.onclick = function (e) {
                if (_this.selectAction) {
                    _this.selectAction.execute();
                    e.cancelBubble = true;
                }
            };
            switch (this.horizontalAlignment) {
                case Enums.HorizontalAlignment.Center:
                    element.style.justifyContent = "center";
                    break;
                case Enums.HorizontalAlignment.Right:
                    element.style.justifyContent = "flex-end";
                    break;
                default:
                    element.style.justifyContent = "flex-start";
                    break;
            }
            // Cache hostConfig to avoid walking the parent hierarchy multiple times
            var hostConfig = this.hostConfig;
            var imageElement = document.createElement("img");
            imageElement.onload = function (e) {
                raiseImageLoadedEvent(_this);
            };
            imageElement.onerror = function (e) {
                var card = _this.getRootElement();
                _this.renderedElement.innerHTML = "";
                if (card && card.designMode) {
                    var errorElement = document.createElement("div");
                    errorElement.style.display = "flex";
                    errorElement.style.alignItems = "center";
                    errorElement.style.justifyContent = "center";
                    errorElement.style.backgroundColor = "#EEEEEE";
                    errorElement.style.color = "black";
                    errorElement.innerText = ":-(";
                    errorElement.style.padding = "10px";
                    _this.applySize(errorElement);
                    _this.renderedElement.appendChild(errorElement);
                }
                raiseImageLoadedEvent(_this);
            };
            imageElement.style.maxHeight = "100%";
            imageElement.style.minWidth = "0";
            imageElement.classList.add(hostConfig.makeCssClassName("ac-image"));
            if (this.selectAction != null && hostConfig.supportsInteractivity) {
                imageElement.tabIndex = 0;
                imageElement.setAttribute("role", "button");
                imageElement.setAttribute("aria-label", this.selectAction.title);
                imageElement.classList.add(hostConfig.makeCssClassName("ac-selectable"));
            }
            this.applySize(imageElement);
            if (this.style === Enums.ImageStyle.Person) {
                imageElement.style.borderRadius = "50%";
                imageElement.style.backgroundPosition = "50% 50%";
                imageElement.style.backgroundRepeat = "no-repeat";
            }
            if (!Utils.isNullOrEmpty(this.backgroundColor)) {
                imageElement.style.backgroundColor = Utils.stringToCssColor(this.backgroundColor);
            }
            imageElement.src = this.url;
            imageElement.alt = this.altText;
            element.appendChild(imageElement);
        }
        return element;
    };
    Image.prototype.toJSON = function () {
        var result = _super.prototype.toJSON.call(this);
        if (this._selectAction) {
            Utils.setProperty(result, "selectAction", this._selectAction.toJSON());
        }
        Utils.setEnumProperty(Enums.ImageStyle, result, "style", this.style, Enums.ImageStyle.Default);
        Utils.setProperty(result, "backgroundColor", this.backgroundColor);
        Utils.setProperty(result, "url", this.url);
        Utils.setEnumProperty(Enums.Size, result, "size", this.size, Enums.Size.Auto);
        if (this.pixelWidth) {
            Utils.setProperty(result, "width", this.pixelWidth + "px");
        }
        if (this.pixelHeight) {
            Utils.setProperty(result, "height", this.pixelHeight + "px");
        }
        Utils.setProperty(result, "altText", this.altText);
        return result;
    };
    Image.prototype.getJsonTypeName = function () {
        return "Image";
    };
    Image.prototype.getActionById = function (id) {
        var result = _super.prototype.getActionById.call(this, id);
        if (!result && this.selectAction) {
            result = this.selectAction.getActionById(id);
        }
        return result;
    };
    Image.prototype.parse = function (json, errors) {
        _super.prototype.parse.call(this, json, errors);
        this.url = json["url"];
        this.backgroundColor = json["backgroundColor"];
        var styleString = json["style"];
        if (styleString && typeof styleString === "string" && styleString.toLowerCase() === "normal") {
            this.style = Enums.ImageStyle.Default;
            raiseParseError({
                error: Enums.ValidationError.Deprecated,
                message: "The Image.style value \"normal\" is deprecated and will be removed. Use \"default\" instead."
            }, errors);
        }
        else {
            this.style = Utils.getEnumValueOrDefault(Enums.ImageStyle, styleString, this.style);
        }
        this.size = Utils.getEnumValueOrDefault(Enums.Size, json["size"], this.size);
        this.altText = json["altText"];
        // pixelWidth and pixelHeight are only parsed for backwards compatibility.
        // Payloads should use the width and height proerties instead.
        if (json["pixelWidth"] && typeof json["pixelWidth"] === "number") {
            this.pixelWidth = json["pixelWidth"];
            raiseParseError({
                error: Enums.ValidationError.Deprecated,
                message: "The pixelWidth property is deprecated and will be removed. Use the width property instead."
            }, errors);
        }
        if (json["pixelHeight"] && typeof json["pixelHeight"] === "number") {
            this.pixelHeight = json["pixelHeight"];
            raiseParseError({
                error: Enums.ValidationError.Deprecated,
                message: "The pixelHeight property is deprecated and will be removed. Use the height property instead."
            }, errors);
        }
        var size = this.parseDimension("width", json["width"], errors);
        if (size > 0) {
            this.pixelWidth = size;
        }
        size = this.parseDimension("height", json["height"], errors);
        if (size > 0) {
            this.pixelHeight = size;
        }
        var selectActionJson = json["selectAction"];
        if (selectActionJson != undefined) {
            this.selectAction = createActionInstance(selectActionJson, errors);
            if (this.selectAction) {
                this.selectAction.setParent(this);
                this.selectAction.parse(selectActionJson);
            }
        }
    };
    Image.prototype.getResourceInformation = function () {
        if (!Utils.isNullOrEmpty(this.url)) {
            return [{ url: this.url, mimeType: "image" }];
        }
        else {
            return [];
        }
    };
    Image.prototype.renderSpeech = function () {
        if (this.speak != null) {
            return this.speak + '\n';
        }
        return null;
    };
    Object.defineProperty(Image.prototype, "selectAction", {
        get: function () {
            return this._selectAction;
        },
        set: function (value) {
            this._selectAction = value;
            if (this._selectAction) {
                this._selectAction.setParent(this);
            }
        },
        enumerable: true,
        configurable: true
    });
    return Image;
}(CardElement));
exports.Image = Image;
var ImageSet = /** @class */ (function (_super) {
    __extends(ImageSet, _super);
    function ImageSet() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._images = [];
        _this.imageSize = Enums.Size.Medium;
        return _this;
    }
    ImageSet.prototype.internalRender = function () {
        var element = null;
        if (this._images.length > 0) {
            element = document.createElement("div");
            element.style.display = "flex";
            element.style.flexWrap = "wrap";
            for (var i = 0; i < this._images.length; i++) {
                this._images[i].size = this.imageSize;
                var renderedImage = this._images[i].render();
                renderedImage.style.display = "inline-flex";
                renderedImage.style.margin = "0px";
                renderedImage.style.marginRight = "10px";
                renderedImage.style.maxHeight = this.hostConfig.imageSet.maxImageHeight + "px";
                Utils.appendChild(element, renderedImage);
            }
        }
        return element;
    };
    ImageSet.prototype.getItemCount = function () {
        return this._images.length;
    };
    ImageSet.prototype.getItemAt = function (index) {
        return this._images[index];
    };
    ImageSet.prototype.getResourceInformation = function () {
        var result = [];
        for (var _i = 0, _a = this._images; _i < _a.length; _i++) {
            var image = _a[_i];
            result = result.concat(image.getResourceInformation());
        }
        return result;
    };
    ImageSet.prototype.removeItem = function (item) {
        if (item instanceof Image) {
            var itemIndex = this._images.indexOf(item);
            if (itemIndex >= 0) {
                this._images.splice(itemIndex, 1);
                item.setParent(null);
                this.updateLayout();
                return true;
            }
        }
        return false;
    };
    ImageSet.prototype.getJsonTypeName = function () {
        return "ImageSet";
    };
    ImageSet.prototype.toJSON = function () {
        var result = _super.prototype.toJSON.call(this);
        Utils.setEnumProperty(Enums.Size, result, "imageSize", this.imageSize, Enums.Size.Medium);
        if (this._images.length > 0) {
            var images = [];
            for (var _i = 0, _a = this._images; _i < _a.length; _i++) {
                var image = _a[_i];
                images.push(image.toJSON());
            }
            Utils.setProperty(result, "images", images);
        }
        return result;
    };
    ImageSet.prototype.parse = function (json, errors) {
        _super.prototype.parse.call(this, json, errors);
        this.imageSize = Utils.getEnumValueOrDefault(Enums.Size, json["imageSize"], Enums.Size.Medium);
        if (json["images"] != null) {
            var jsonImages = json["images"];
            this._images = [];
            for (var i = 0; i < jsonImages.length; i++) {
                var image = new Image();
                image.parse(jsonImages[i], errors);
                this.addImage(image);
            }
        }
    };
    ImageSet.prototype.addImage = function (image) {
        if (!image.parent) {
            this._images.push(image);
            image.setParent(this);
        }
        else {
            throw new Error("This image already belongs to another ImageSet");
        }
    };
    ImageSet.prototype.indexOf = function (cardElement) {
        return cardElement instanceof Image ? this._images.indexOf(cardElement) : -1;
    };
    ImageSet.prototype.renderSpeech = function () {
        if (this.speak != null) {
            return this.speak;
        }
        var speak = null;
        if (this._images.length > 0) {
            speak = '';
            for (var i = 0; i < this._images.length; i++) {
                speak += this._images[i].renderSpeech();
            }
        }
        return speak;
    };
    return ImageSet;
}(CardElementContainer));
exports.ImageSet = ImageSet;
var MediaSource = /** @class */ (function () {
    function MediaSource(url, mimeType) {
        if (url === void 0) { url = undefined; }
        if (mimeType === void 0) { mimeType = undefined; }
        this.url = url;
        this.mimeType = mimeType;
    }
    MediaSource.prototype.parse = function (json, errors) {
        this.mimeType = json["mimeType"];
        this.url = json["url"];
    };
    MediaSource.prototype.toJSON = function () {
        return {
            mimeType: this.mimeType,
            url: this.url
        };
    };
    return MediaSource;
}());
exports.MediaSource = MediaSource;
var Media = /** @class */ (function (_super) {
    __extends(Media, _super);
    function Media() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.sources = [];
        return _this;
    }
    Media.prototype.getPosterUrl = function () {
        return this.poster ? this.poster : this.hostConfig.media.defaultPoster;
    };
    Media.prototype.processSources = function () {
        this._selectedSources = [];
        this._selectedMediaType = undefined;
        for (var _i = 0, _a = this.sources; _i < _a.length; _i++) {
            var source = _a[_i];
            var mimeComponents = source.mimeType.split('/');
            if (mimeComponents.length == 2) {
                if (!this._selectedMediaType) {
                    var index = Media.supportedMediaTypes.indexOf(mimeComponents[0]);
                    if (index >= 0) {
                        this._selectedMediaType = Media.supportedMediaTypes[index];
                    }
                }
                if (mimeComponents[0] == this._selectedMediaType) {
                    this._selectedSources.push(source);
                }
            }
        }
    };
    Media.prototype.renderPoster = function () {
        var _this = this;
        var playButtonArrowWidth = 12;
        var playButtonArrowHeight = 15;
        var posterRootElement = document.createElement("div");
        posterRootElement.className = "ac-media-poster";
        posterRootElement.setAttribute("role", "contentinfo");
        posterRootElement.setAttribute("aria-label", this.altText ? this.altText : "Media content");
        posterRootElement.style.position = "relative";
        posterRootElement.style.display = "flex";
        var posterUrl = this.getPosterUrl();
        if (posterUrl) {
            var posterImageElement_1 = document.createElement("img");
            posterImageElement_1.style.width = "100%";
            posterImageElement_1.style.height = "100%";
            posterImageElement_1.onerror = function (e) {
                posterImageElement_1.parentNode.removeChild(posterImageElement_1);
                posterRootElement.classList.add("empty");
                posterRootElement.style.minHeight = "150px";
            };
            posterImageElement_1.src = posterUrl;
            posterRootElement.appendChild(posterImageElement_1);
        }
        else {
            posterRootElement.classList.add("empty");
            posterRootElement.style.minHeight = "150px";
        }
        if (this.hostConfig.supportsInteractivity && this._selectedSources.length > 0) {
            var playButtonOuterElement = document.createElement("div");
            playButtonOuterElement.setAttribute("role", "button");
            playButtonOuterElement.setAttribute("aria-label", "Play media");
            playButtonOuterElement.className = "ac-media-playButton";
            playButtonOuterElement.style.display = "flex";
            playButtonOuterElement.style.alignItems = "center";
            playButtonOuterElement.style.justifyContent = "center";
            playButtonOuterElement.onclick = function (e) {
                if (_this.hostConfig.media.allowInlinePlayback) {
                    var mediaPlayerElement = _this.renderMediaPlayer();
                    _this.renderedElement.innerHTML = "";
                    _this.renderedElement.appendChild(mediaPlayerElement);
                    mediaPlayerElement.play();
                }
                else {
                    if (Media.onPlay) {
                        Media.onPlay(_this);
                    }
                }
            };
            var playButtonInnerElement = document.createElement("div");
            playButtonInnerElement.className = "ac-media-playButton-arrow";
            playButtonInnerElement.style.width = playButtonArrowWidth + "px";
            playButtonInnerElement.style.height = playButtonArrowHeight + "px";
            playButtonInnerElement.style.borderTopWidth = (playButtonArrowHeight / 2) + "px";
            playButtonInnerElement.style.borderBottomWidth = (playButtonArrowHeight / 2) + "px";
            playButtonInnerElement.style.borderLeftWidth = playButtonArrowWidth + "px";
            playButtonInnerElement.style.borderRightWidth = "0";
            playButtonInnerElement.style.borderStyle = "solid";
            playButtonInnerElement.style.borderTopColor = "transparent";
            playButtonInnerElement.style.borderRightColor = "transparent";
            playButtonInnerElement.style.borderBottomColor = "transparent";
            playButtonInnerElement.style.transform = "translate(" + (playButtonArrowWidth / 10) + "px,0px)";
            playButtonOuterElement.appendChild(playButtonInnerElement);
            var playButtonContainer = document.createElement("div");
            playButtonContainer.style.position = "absolute";
            playButtonContainer.style.left = "0";
            playButtonContainer.style.top = "0";
            playButtonContainer.style.width = "100%";
            playButtonContainer.style.height = "100%";
            playButtonContainer.style.display = "flex";
            playButtonContainer.style.justifyContent = "center";
            playButtonContainer.style.alignItems = "center";
            playButtonContainer.appendChild(playButtonOuterElement);
            posterRootElement.appendChild(playButtonContainer);
        }
        return posterRootElement;
    };
    Media.prototype.renderMediaPlayer = function () {
        var mediaElement;
        if (this._selectedMediaType == "video") {
            var videoPlayer = document.createElement("video");
            var posterUrl = this.getPosterUrl();
            if (posterUrl) {
                videoPlayer.poster = posterUrl;
            }
            mediaElement = videoPlayer;
        }
        else {
            mediaElement = document.createElement("audio");
        }
        mediaElement.controls = true;
        mediaElement.preload = "none";
        mediaElement.style.width = "100%";
        for (var _i = 0, _a = this.sources; _i < _a.length; _i++) {
            var source = _a[_i];
            var src = document.createElement("source");
            src.src = source.url;
            src.type = source.mimeType;
            mediaElement.appendChild(src);
        }
        return mediaElement;
    };
    Media.prototype.internalRender = function () {
        var element = document.createElement("div");
        element.className = this.hostConfig.makeCssClassName("ac-media");
        this.processSources();
        element.appendChild(this.renderPoster());
        return element;
    };
    Media.prototype.parse = function (json, errors) {
        _super.prototype.parse.call(this, json, errors);
        this.poster = json["poster"];
        this.altText = json["altText"];
        if (json["sources"] != null) {
            var jsonSources = json["sources"];
            this.sources = [];
            for (var i = 0; i < jsonSources.length; i++) {
                var source = new MediaSource();
                source.parse(jsonSources[i], errors);
                this.sources.push(source);
            }
        }
    };
    Media.prototype.toJSON = function () {
        var result = _super.prototype.toJSON.call(this);
        Utils.setProperty(result, "poster", this.poster);
        Utils.setProperty(result, "altText", this.altText);
        if (this.sources.length > 0) {
            var serializedSources = [];
            for (var _i = 0, _a = this.sources; _i < _a.length; _i++) {
                var source = _a[_i];
                serializedSources.push(source.toJSON());
            }
            Utils.setProperty(result, "sources", serializedSources);
        }
        return result;
    };
    Media.prototype.getJsonTypeName = function () {
        return "Media";
    };
    Media.prototype.getResourceInformation = function () {
        var result = [];
        var posterUrl = this.getPosterUrl();
        if (!Utils.isNullOrEmpty(posterUrl)) {
            result.push({ url: posterUrl, mimeType: "image" });
        }
        for (var _i = 0, _a = this.sources; _i < _a.length; _i++) {
            var mediaSource = _a[_i];
            if (!Utils.isNullOrEmpty(mediaSource.url)) {
                result.push({ url: mediaSource.url, mimeType: mediaSource.mimeType });
            }
        }
        return result;
    };
    Media.prototype.renderSpeech = function () {
        return this.altText;
    };
    Object.defineProperty(Media.prototype, "selectedMediaType", {
        get: function () {
            return this._selectedMediaType;
        },
        enumerable: true,
        configurable: true
    });
    Media.supportedMediaTypes = ["audio", "video"];
    return Media;
}(CardElement));
exports.Media = Media;
var Input = /** @class */ (function (_super) {
    __extends(Input, _super);
    function Input() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Input.prototype.valueChanged = function () {
        if (this.onValueChanged) {
            this.onValueChanged(this);
        }
    };
    Input.prototype.toJSON = function () {
        var result = _super.prototype.toJSON.call(this);
        Utils.setProperty(result, "title", this.title);
        Utils.setProperty(result, "value", this.renderedElement ? this.value : this.defaultValue);
        return result;
    };
    Input.prototype.validate = function () {
        if (!this.id) {
            return [{ error: Enums.ValidationError.PropertyCantBeNull, message: "All inputs must have a unique Id" }];
        }
        else {
            return [];
        }
    };
    Input.prototype.parse = function (json, errors) {
        _super.prototype.parse.call(this, json, errors);
        this.id = json["id"];
        this.defaultValue = json["value"];
    };
    Input.prototype.renderSpeech = function () {
        if (this.speak != null) {
            return this.speak;
        }
        if (this.title) {
            return '<s>' + this.title + '</s>\n';
        }
        return null;
    };
    Input.prototype.getAllInputs = function () {
        return [this];
    };
    Object.defineProperty(Input.prototype, "isInteractive", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    return Input;
}(CardElement));
exports.Input = Input;
var TextInput = /** @class */ (function (_super) {
    __extends(TextInput, _super);
    function TextInput() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.style = Enums.InputTextStyle.Text;
        return _this;
    }
    TextInput.prototype.internalRender = function () {
        var _this = this;
        if (this.isMultiline) {
            this._textareaElement = document.createElement("textarea");
            this._textareaElement.className = this.hostConfig.makeCssClassName("ac-input", "ac-textInput", "ac-multiline");
            this._textareaElement.style.width = "100%";
            this._textareaElement.tabIndex = 0;
            if (!Utils.isNullOrEmpty(this.placeholder)) {
                this._textareaElement.placeholder = this.placeholder;
                this._textareaElement.setAttribute("aria-label", this.placeholder);
            }
            if (!Utils.isNullOrEmpty(this.defaultValue)) {
                this._textareaElement.value = this.defaultValue;
            }
            if (this.maxLength > 0) {
                this._textareaElement.maxLength = this.maxLength;
            }
            this._textareaElement.oninput = function () { _this.valueChanged(); };
            return this._textareaElement;
        }
        else {
            this._inputElement = document.createElement("input");
            this._inputElement.type = Enums.InputTextStyle[this.style].toLowerCase();
            this._inputElement.className = this.hostConfig.makeCssClassName("ac-input", "ac-textInput");
            this._inputElement.style.width = "100%";
            this._inputElement.tabIndex = 0;
            if (!Utils.isNullOrEmpty(this.placeholder)) {
                this._inputElement.placeholder = this.placeholder;
                this._inputElement.setAttribute("aria-label", this.placeholder);
            }
            if (!Utils.isNullOrEmpty(this.defaultValue)) {
                this._inputElement.value = this.defaultValue;
            }
            if (this.maxLength > 0) {
                this._inputElement.maxLength = this.maxLength;
            }
            this._inputElement.oninput = function () { _this.valueChanged(); };
            return this._inputElement;
        }
    };
    TextInput.prototype.getJsonTypeName = function () {
        return "Input.Text";
    };
    TextInput.prototype.toJSON = function () {
        var result = _super.prototype.toJSON.call(this);
        Utils.setProperty(result, "placeholder", this.placeholder);
        Utils.setProperty(result, "maxLength", this.maxLength, 0);
        Utils.setProperty(result, "isMultiline", this.isMultiline, false);
        Utils.setEnumProperty(Enums.InputTextStyle, result, "style", this.style, Enums.InputTextStyle.Text);
        return result;
    };
    TextInput.prototype.parse = function (json, errors) {
        _super.prototype.parse.call(this, json, errors);
        this.maxLength = json["maxLength"];
        this.isMultiline = json["isMultiline"];
        this.placeholder = json["placeholder"];
        this.style = Utils.getEnumValueOrDefault(Enums.InputTextStyle, json["style"], this.style);
    };
    Object.defineProperty(TextInput.prototype, "value", {
        get: function () {
            if (this.isMultiline) {
                return this._textareaElement ? this._textareaElement.value : null;
            }
            else {
                return this._inputElement ? this._inputElement.value : null;
            }
        },
        enumerable: true,
        configurable: true
    });
    return TextInput;
}(Input));
exports.TextInput = TextInput;
var ToggleInput = /** @class */ (function (_super) {
    __extends(ToggleInput, _super);
    function ToggleInput() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.valueOn = "true";
        _this.valueOff = "false";
        return _this;
    }
    ToggleInput.prototype.internalRender = function () {
        var _this = this;
        var element = document.createElement("div");
        element.className = this.hostConfig.makeCssClassName("ac-input");
        element.style.width = "100%";
        element.style.display = "flex";
        element.style.alignItems = "center";
        this._checkboxInputElement = document.createElement("input");
        this._checkboxInputElement.id = generateUniqueId();
        this._checkboxInputElement.type = "checkbox";
        this._checkboxInputElement.style.display = "inline-block";
        this._checkboxInputElement.style.verticalAlign = "middle";
        this._checkboxInputElement.style.margin = "0";
        this._checkboxInputElement.style.flex = "0 0 auto";
        this._checkboxInputElement.setAttribute("aria-label", this.title);
        this._checkboxInputElement.tabIndex = 0;
        if (this.defaultValue == this.valueOn) {
            this._checkboxInputElement.checked = true;
        }
        this._checkboxInputElement.onchange = function () { _this.valueChanged(); };
        Utils.appendChild(element, this._checkboxInputElement);
        if (!Utils.isNullOrEmpty(this.title) || this.isDesignMode()) {
            var label = new Label();
            label.forElementId = this._checkboxInputElement.id;
            label.hostConfig = this.hostConfig;
            label.text = Utils.isNullOrEmpty(this.title) ? this.getJsonTypeName() : this.title;
            label.useMarkdown = AdaptiveCard.useMarkdownInRadioButtonAndCheckbox;
            var labelElement = label.render();
            labelElement.style.display = "inline-block";
            labelElement.style.flex = "1 1 auto";
            labelElement.style.marginLeft = "6px";
            labelElement.style.verticalAlign = "middle";
            Utils.appendChild(element, labelElement);
        }
        return element;
    };
    ToggleInput.prototype.getJsonTypeName = function () {
        return "Input.Toggle";
    };
    ToggleInput.prototype.toJSON = function () {
        var result = _super.prototype.toJSON.call(this);
        Utils.setProperty(result, "valueOn", this.valueOn, "true");
        Utils.setProperty(result, "valueOff", this.valueOff, "false");
        return result;
    };
    ToggleInput.prototype.parse = function (json, errors) {
        _super.prototype.parse.call(this, json, errors);
        this.title = json["title"];
        this.valueOn = Utils.getValueOrDefault(json["valueOn"], this.valueOn);
        this.valueOff = Utils.getValueOrDefault(json["valueOff"], this.valueOff);
    };
    Object.defineProperty(ToggleInput.prototype, "value", {
        get: function () {
            if (this._checkboxInputElement) {
                return this._checkboxInputElement.checked ? this.valueOn : this.valueOff;
            }
            else {
                return null;
            }
        },
        enumerable: true,
        configurable: true
    });
    return ToggleInput;
}(Input));
exports.ToggleInput = ToggleInput;
var Choice = /** @class */ (function () {
    function Choice(title, value) {
        if (title === void 0) { title = undefined; }
        if (value === void 0) { value = undefined; }
        this.title = title;
        this.value = value;
    }
    Choice.prototype.toJSON = function () {
        return { title: this.title, value: this.value };
    };
    return Choice;
}());
exports.Choice = Choice;
var ChoiceSetInput = /** @class */ (function (_super) {
    __extends(ChoiceSetInput, _super);
    function ChoiceSetInput() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.choices = [];
        return _this;
    }
    ChoiceSetInput.getUniqueCategoryName = function () {
        var uniqueCwtegoryName = "__ac-category" + ChoiceSetInput.uniqueCategoryCounter;
        ChoiceSetInput.uniqueCategoryCounter++;
        return uniqueCwtegoryName;
    };
    ChoiceSetInput.prototype.internalRender = function () {
        var _this = this;
        if (!this.isMultiSelect) {
            if (this.isCompact) {
                // Render as a combo box
                this._selectElement = document.createElement("select");
                this._selectElement.className = this.hostConfig.makeCssClassName("ac-input", "ac-multichoiceInput");
                this._selectElement.style.width = "100%";
                var option = document.createElement("option");
                option.selected = true;
                option.disabled = true;
                option.hidden = true;
                option.value = "";
                if (this.placeholder) {
                    option.text = this.placeholder;
                }
                Utils.appendChild(this._selectElement, option);
                for (var i = 0; i < this.choices.length; i++) {
                    var option = document.createElement("option");
                    option.value = this.choices[i].value;
                    option.text = this.choices[i].title;
                    option.setAttribute("aria-label", this.choices[i].title);
                    if (this.choices[i].value == this.defaultValue) {
                        option.selected = true;
                    }
                    Utils.appendChild(this._selectElement, option);
                }
                this._selectElement.onchange = function () { _this.valueChanged(); };
                return this._selectElement;
            }
            else {
                // Render as a series of radio buttons
                var uniqueCategoryName = ChoiceSetInput.getUniqueCategoryName();
                var element = document.createElement("div");
                element.className = this.hostConfig.makeCssClassName("ac-input");
                element.style.width = "100%";
                this._toggleInputs = [];
                for (var i = 0; i < this.choices.length; i++) {
                    var radioInput = document.createElement("input");
                    radioInput.id = generateUniqueId();
                    radioInput.type = "radio";
                    radioInput.style.margin = "0";
                    radioInput.style.display = "inline-block";
                    radioInput.style.verticalAlign = "middle";
                    radioInput.name = Utils.isNullOrEmpty(this.id) ? uniqueCategoryName : this.id;
                    radioInput.value = this.choices[i].value;
                    radioInput.style.flex = "0 0 auto";
                    radioInput.setAttribute("aria-label", this.choices[i].title);
                    if (this.choices[i].value == this.defaultValue) {
                        radioInput.checked = true;
                    }
                    radioInput.onchange = function () { _this.valueChanged(); };
                    this._toggleInputs.push(radioInput);
                    var label = new Label();
                    label.forElementId = radioInput.id;
                    label.hostConfig = this.hostConfig;
                    label.text = Utils.isNullOrEmpty(this.choices[i].title) ? "Choice " + i : this.choices[i].title;
                    label.useMarkdown = AdaptiveCard.useMarkdownInRadioButtonAndCheckbox;
                    var labelElement = label.render();
                    labelElement.style.display = "inline-block";
                    labelElement.style.flex = "1 1 auto";
                    labelElement.style.marginLeft = "6px";
                    labelElement.style.verticalAlign = "middle";
                    var compoundInput = document.createElement("div");
                    compoundInput.style.display = "flex";
                    Utils.appendChild(compoundInput, radioInput);
                    Utils.appendChild(compoundInput, labelElement);
                    Utils.appendChild(element, compoundInput);
                }
                return element;
            }
        }
        else {
            // Render as a list of toggle inputs
            var defaultValues = this.defaultValue ? this.defaultValue.split(this.hostConfig.choiceSetInputValueSeparator) : null;
            var element = document.createElement("div");
            element.className = this.hostConfig.makeCssClassName("ac-input");
            element.style.width = "100%";
            this._toggleInputs = [];
            for (var i = 0; i < this.choices.length; i++) {
                var checkboxInput = document.createElement("input");
                checkboxInput.id = generateUniqueId();
                checkboxInput.type = "checkbox";
                checkboxInput.style.margin = "0";
                checkboxInput.style.display = "inline-block";
                checkboxInput.style.verticalAlign = "middle";
                checkboxInput.value = this.choices[i].value;
                checkboxInput.style.flex = "0 0 auto";
                checkboxInput.setAttribute("aria-label", this.choices[i].title);
                if (defaultValues) {
                    if (defaultValues.indexOf(this.choices[i].value) >= 0) {
                        checkboxInput.checked = true;
                    }
                }
                checkboxInput.onchange = function () { _this.valueChanged(); };
                this._toggleInputs.push(checkboxInput);
                var label = new Label();
                label.forElementId = checkboxInput.id;
                label.hostConfig = this.hostConfig;
                label.text = Utils.isNullOrEmpty(this.choices[i].title) ? "Choice " + i : this.choices[i].title;
                label.useMarkdown = AdaptiveCard.useMarkdownInRadioButtonAndCheckbox;
                var labelElement = label.render();
                labelElement.style.display = "inline-block";
                labelElement.style.flex = "1 1 auto";
                labelElement.style.marginLeft = "6px";
                labelElement.style.verticalAlign = "middle";
                var compoundInput = document.createElement("div");
                compoundInput.style.display = "flex";
                compoundInput.style.alignItems = "center";
                Utils.appendChild(compoundInput, checkboxInput);
                Utils.appendChild(compoundInput, labelElement);
                Utils.appendChild(element, compoundInput);
            }
            return element;
        }
    };
    ChoiceSetInput.prototype.getJsonTypeName = function () {
        return "Input.ChoiceSet";
    };
    ChoiceSetInput.prototype.toJSON = function () {
        var result = _super.prototype.toJSON.call(this);
        Utils.setProperty(result, "placeholder", this.placeholder);
        if (this.choices.length > 0) {
            var choices = [];
            for (var _i = 0, _a = this.choices; _i < _a.length; _i++) {
                var choice = _a[_i];
                choices.push(choice.toJSON());
            }
            Utils.setProperty(result, "choices", choices);
        }
        if (!this.isCompact) {
            Utils.setProperty(result, "style", "expanded", false);
        }
        Utils.setProperty(result, "isMultiSelect", this.isMultiSelect, false);
        return result;
    };
    ChoiceSetInput.prototype.validate = function () {
        var result = [];
        if (this.choices.length == 0) {
            result = [{ error: Enums.ValidationError.CollectionCantBeEmpty, message: "An Input.ChoiceSet must have at least one choice defined." }];
        }
        for (var i = 0; i < this.choices.length; i++) {
            if (!this.choices[i].title || !this.choices[i].value) {
                result = result.concat([{ error: Enums.ValidationError.PropertyCantBeNull, message: "All choices in an Input.ChoiceSet must have their title and value properties set." }]);
                break;
            }
        }
        return result;
    };
    ChoiceSetInput.prototype.parse = function (json, errors) {
        _super.prototype.parse.call(this, json, errors);
        this.isCompact = !(json["style"] === "expanded");
        this.isMultiSelect = json["isMultiSelect"];
        this.placeholder = json["placeholder"];
        this.choices = [];
        if (json["choices"] != undefined) {
            var choiceArray = json["choices"];
            for (var i = 0; i < choiceArray.length; i++) {
                var choice = new Choice();
                choice.title = choiceArray[i]["title"];
                choice.value = choiceArray[i]["value"];
                this.choices.push(choice);
            }
        }
    };
    Object.defineProperty(ChoiceSetInput.prototype, "value", {
        get: function () {
            if (!this.isMultiSelect) {
                if (this.isCompact) {
                    return this._selectElement ? this._selectElement.value : null;
                }
                else {
                    if (!this._toggleInputs || this._toggleInputs.length == 0) {
                        return null;
                    }
                    for (var i = 0; i < this._toggleInputs.length; i++) {
                        if (this._toggleInputs[i].checked) {
                            return this._toggleInputs[i].value;
                        }
                    }
                    return null;
                }
            }
            else {
                if (!this._toggleInputs || this._toggleInputs.length == 0) {
                    return null;
                }
                var result = "";
                for (var i = 0; i < this._toggleInputs.length; i++) {
                    if (this._toggleInputs[i].checked) {
                        if (result != "") {
                            result += this.hostConfig.choiceSetInputValueSeparator;
                        }
                        result += this._toggleInputs[i].value;
                    }
                }
                return result == "" ? null : result;
            }
        },
        enumerable: true,
        configurable: true
    });
    ChoiceSetInput.uniqueCategoryCounter = 0;
    return ChoiceSetInput;
}(Input));
exports.ChoiceSetInput = ChoiceSetInput;
var NumberInput = /** @class */ (function (_super) {
    __extends(NumberInput, _super);
    function NumberInput() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NumberInput.prototype.internalRender = function () {
        var _this = this;
        this._numberInputElement = document.createElement("input");
        this._numberInputElement.setAttribute("type", "number");
        this._numberInputElement.className = this.hostConfig.makeCssClassName("ac-input", "ac-numberInput");
        this._numberInputElement.setAttribute("min", this.min);
        this._numberInputElement.setAttribute("max", this.max);
        this._numberInputElement.style.width = "100%";
        this._numberInputElement.tabIndex = 0;
        if (!Utils.isNullOrEmpty(this.defaultValue)) {
            this._numberInputElement.value = this.defaultValue;
        }
        if (!Utils.isNullOrEmpty(this.placeholder)) {
            this._numberInputElement.placeholder = this.placeholder;
            this._numberInputElement.setAttribute("aria-label", this.placeholder);
        }
        this._numberInputElement.oninput = function () { _this.valueChanged(); };
        return this._numberInputElement;
    };
    NumberInput.prototype.getJsonTypeName = function () {
        return "Input.Number";
    };
    NumberInput.prototype.toJSON = function () {
        var result = _super.prototype.toJSON.call(this);
        Utils.setProperty(result, "placeholder", this.placeholder);
        Utils.setProperty(result, "min", this.min);
        Utils.setProperty(result, "max", this.max);
        return result;
    };
    NumberInput.prototype.parse = function (json, errors) {
        _super.prototype.parse.call(this, json, errors);
        this.placeholder = json["placeholder"];
        this.min = json["min"];
        this.max = json["max"];
    };
    Object.defineProperty(NumberInput.prototype, "value", {
        get: function () {
            return this._numberInputElement ? this._numberInputElement.value : null;
        },
        enumerable: true,
        configurable: true
    });
    return NumberInput;
}(Input));
exports.NumberInput = NumberInput;
var DateInput = /** @class */ (function (_super) {
    __extends(DateInput, _super);
    function DateInput() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DateInput.prototype.internalRender = function () {
        this._dateInputElement = document.createElement("input");
        this._dateInputElement.setAttribute("type", "date");
        this._dateInputElement.className = this.hostConfig.makeCssClassName("ac-input", "ac-dateInput");
        this._dateInputElement.style.width = "100%";
        if (!Utils.isNullOrEmpty(this.defaultValue)) {
            this._dateInputElement.value = this.defaultValue;
        }
        return this._dateInputElement;
    };
    DateInput.prototype.getJsonTypeName = function () {
        return "Input.Date";
    };
    Object.defineProperty(DateInput.prototype, "value", {
        get: function () {
            return this._dateInputElement ? this._dateInputElement.value : null;
        },
        enumerable: true,
        configurable: true
    });
    return DateInput;
}(Input));
exports.DateInput = DateInput;
var TimeInput = /** @class */ (function (_super) {
    __extends(TimeInput, _super);
    function TimeInput() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TimeInput.prototype.internalRender = function () {
        this._timeInputElement = document.createElement("input");
        this._timeInputElement.setAttribute("type", "time");
        this._timeInputElement.className = this.hostConfig.makeCssClassName("ac-input", "ac-timeInput");
        this._timeInputElement.style.width = "100%";
        if (!Utils.isNullOrEmpty(this.defaultValue)) {
            this._timeInputElement.value = this.defaultValue;
        }
        return this._timeInputElement;
    };
    TimeInput.prototype.getJsonTypeName = function () {
        return "Input.Time";
    };
    Object.defineProperty(TimeInput.prototype, "value", {
        get: function () {
            return this._timeInputElement ? this._timeInputElement.value : null;
        },
        enumerable: true,
        configurable: true
    });
    return TimeInput;
}(Input));
exports.TimeInput = TimeInput;
var ActionButtonState;
(function (ActionButtonState) {
    ActionButtonState[ActionButtonState["Normal"] = 0] = "Normal";
    ActionButtonState[ActionButtonState["Expanded"] = 1] = "Expanded";
    ActionButtonState[ActionButtonState["Subdued"] = 2] = "Subdued";
})(ActionButtonState || (ActionButtonState = {}));
var ActionButton = /** @class */ (function () {
    function ActionButton(action, parentContainerStyle) {
        var _this = this;
        this._element = null;
        this._state = ActionButtonState.Normal;
        this.onClick = null;
        this.action = action;
        this._parentContainerStyle = parentContainerStyle;
        this.action.render();
        this.action.renderedElement.onclick = function (e) { _this.click(); };
        this.updateCssStyle();
    }
    ActionButton.prototype.updateCssStyle = function () {
        var hostConfig = this.action.parent.hostConfig;
        this.action.renderedElement.className = hostConfig.makeCssClassName("ac-pushButton");
        this.action.renderedElement.classList.add("style-" + this._parentContainerStyle);
        if (this.action instanceof ShowCardAction) {
            this.action.renderedElement.classList.add(hostConfig.makeCssClassName("expandable"));
        }
        this.action.renderedElement.classList.remove(hostConfig.makeCssClassName("expanded"));
        this.action.renderedElement.classList.remove(hostConfig.makeCssClassName("subdued"));
        switch (this._state) {
            case ActionButtonState.Expanded:
                this.action.renderedElement.classList.add(hostConfig.makeCssClassName("expanded"));
                break;
            case ActionButtonState.Subdued:
                this.action.renderedElement.classList.add(hostConfig.makeCssClassName("subdued"));
                break;
        }
        if (this.action.isPrimary) {
            this.action.renderedElement.classList.add(hostConfig.makeCssClassName("primary"));
        }
    };
    ActionButton.prototype.click = function () {
        if (this.onClick != null) {
            this.onClick(this);
        }
    };
    Object.defineProperty(ActionButton.prototype, "state", {
        get: function () {
            return this._state;
        },
        set: function (value) {
            this._state = value;
            this.updateCssStyle();
        },
        enumerable: true,
        configurable: true
    });
    return ActionButton;
}());
var Action = /** @class */ (function () {
    function Action() {
        this._parent = null;
        this._actionCollection = null; // hold the reference to its action collection
        this._renderedElement = null;
    }
    Action.prototype.setCollection = function (actionCollection) {
        this._actionCollection = actionCollection;
    };
    Action.prototype.addCssClasses = function (element) {
        // Do nothing in base implementation
    };
    Action.prototype.toJSON = function () {
        var result = {};
        Utils.setProperty(result, "type", this.getJsonTypeName());
        Utils.setProperty(result, "id", this.id);
        Utils.setProperty(result, "title", this.title);
        Utils.setProperty(result, "iconUrl", this.iconUrl);
        return result;
    };
    Action.prototype.render = function () {
        // Cache hostConfig for perf
        var hostConfig = this.parent.hostConfig;
        var buttonElement = document.createElement("button");
        buttonElement.className = hostConfig.makeCssClassName("ac-pushButton");
        this.addCssClasses(buttonElement);
        buttonElement.setAttribute("aria-label", this.title);
        buttonElement.type = "button";
        buttonElement.style.display = "flex";
        buttonElement.style.alignItems = "center";
        buttonElement.style.justifyContent = "center";
        var hasTitle = !Utils.isNullOrEmpty(this.title);
        var titleElement = document.createElement("div");
        titleElement.style.overflow = "hidden";
        titleElement.style.textOverflow = "ellipsis";
        if (!(hostConfig.actions.iconPlacement == Enums.ActionIconPlacement.AboveTitle || hostConfig.actions.allowTitleToWrap)) {
            titleElement.style.whiteSpace = "nowrap";
        }
        if (hasTitle) {
            titleElement.innerText = this.title;
        }
        if (Utils.isNullOrEmpty(this.iconUrl)) {
            buttonElement.classList.add("noIcon");
            buttonElement.appendChild(titleElement);
        }
        else {
            var iconElement = document.createElement("img");
            iconElement.src = this.iconUrl;
            iconElement.style.width = hostConfig.actions.iconSize + "px";
            iconElement.style.height = hostConfig.actions.iconSize + "px";
            iconElement.style.flex = "0 0 auto";
            if (hostConfig.actions.iconPlacement == Enums.ActionIconPlacement.AboveTitle) {
                buttonElement.classList.add("iconAbove");
                buttonElement.style.flexDirection = "column";
                if (hasTitle) {
                    iconElement.style.marginBottom = "4px";
                }
            }
            else {
                buttonElement.classList.add("iconLeft");
                if (hasTitle) {
                    iconElement.style.marginRight = "4px";
                }
            }
            buttonElement.appendChild(iconElement);
            buttonElement.appendChild(titleElement);
        }
        this._renderedElement = buttonElement;
    };
    Action.prototype.setParent = function (value) {
        this._parent = value;
    };
    Action.prototype.execute = function () {
        if (this.onExecute) {
            this.onExecute(this);
        }
        raiseExecuteActionEvent(this);
    };
    // Expand the action card pane with a inline status card
    // Null status will clear the status bar
    Action.prototype.setStatus = function (status) {
        if (this._actionCollection == null) {
            return;
        }
        if (status) {
            var statusCard = new InlineAdaptiveCard();
            statusCard.parse(status);
            this._actionCollection.showStatusCard(statusCard);
        }
        else {
            this._actionCollection.hideStatusCard();
        }
    };
    Action.prototype.validate = function () {
        return [];
    };
    Action.prototype.prepare = function (inputs) {
        // Do nothing in base implementation
    };
    ;
    Action.prototype.parse = function (json, errors) {
        raiseParseActionEvent(this, json, errors);
        this.id = json["id"];
        if (!json["title"] && json["title"] !== "") {
            raiseParseError({
                error: Enums.ValidationError.PropertyCantBeNull,
                message: "Actions should always have a title."
            }, errors);
        }
        this.title = json["title"];
        this.iconUrl = json["iconUrl"];
    };
    Action.prototype.remove = function () {
        if (this._actionCollection) {
            return this._actionCollection.removeAction(this);
        }
        return false;
    };
    Action.prototype.getAllInputs = function () {
        return [];
    };
    Action.prototype.getResourceInformation = function () {
        if (!Utils.isNullOrEmpty(this.iconUrl)) {
            return [{ url: this.iconUrl, mimeType: "image" }];
        }
        else {
            return [];
        }
    };
    Action.prototype.getActionById = function (id) {
        if (this.id == id) {
            return this;
        }
    };
    Object.defineProperty(Action.prototype, "parent", {
        get: function () {
            return this._parent;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Action.prototype, "renderedElement", {
        get: function () {
            return this._renderedElement;
        },
        enumerable: true,
        configurable: true
    });
    return Action;
}());
exports.Action = Action;
var SubmitAction = /** @class */ (function (_super) {
    __extends(SubmitAction, _super);
    function SubmitAction() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._isPrepared = false;
        return _this;
    }
    SubmitAction.prototype.getJsonTypeName = function () {
        return "Action.Submit";
    };
    SubmitAction.prototype.toJSON = function () {
        var result = _super.prototype.toJSON.call(this);
        Utils.setProperty(result, "data", this._originalData);
        return result;
    };
    SubmitAction.prototype.prepare = function (inputs) {
        if (this._originalData) {
            this._processedData = JSON.parse(JSON.stringify(this._originalData));
        }
        else {
            this._processedData = {};
        }
        for (var i = 0; i < inputs.length; i++) {
            var inputValue = inputs[i].value;
            if (inputValue != null) {
                this._processedData[inputs[i].id] = inputs[i].value;
            }
        }
        this._isPrepared = true;
    };
    SubmitAction.prototype.parse = function (json, errors) {
        _super.prototype.parse.call(this, json, errors);
        this.data = json["data"];
    };
    Object.defineProperty(SubmitAction.prototype, "data", {
        get: function () {
            return this._isPrepared ? this._processedData : this._originalData;
        },
        set: function (value) {
            this._originalData = value;
            this._isPrepared = false;
        },
        enumerable: true,
        configurable: true
    });
    return SubmitAction;
}(Action));
exports.SubmitAction = SubmitAction;
var OpenUrlAction = /** @class */ (function (_super) {
    __extends(OpenUrlAction, _super);
    function OpenUrlAction() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    OpenUrlAction.prototype.getJsonTypeName = function () {
        return "Action.OpenUrl";
    };
    OpenUrlAction.prototype.toJSON = function () {
        var result = _super.prototype.toJSON.call(this);
        Utils.setProperty(result, "url", this.url);
        return result;
    };
    OpenUrlAction.prototype.validate = function () {
        if (!this.url) {
            return [{ error: Enums.ValidationError.PropertyCantBeNull, message: "An Action.OpenUrl must have its url property set." }];
        }
        else {
            return [];
        }
    };
    OpenUrlAction.prototype.parse = function (json, errors) {
        _super.prototype.parse.call(this, json, errors);
        this.url = json["url"];
    };
    return OpenUrlAction;
}(Action));
exports.OpenUrlAction = OpenUrlAction;
var HttpHeader = /** @class */ (function () {
    function HttpHeader(name, value) {
        if (name === void 0) { name = ""; }
        if (value === void 0) { value = ""; }
        this._value = new Utils.StringWithSubstitutions();
        this.name = name;
        this.value = value;
    }
    HttpHeader.prototype.toJSON = function () {
        return { name: this.name, value: this._value.getOriginal() };
    };
    HttpHeader.prototype.prepare = function (inputs) {
        this._value.substituteInputValues(inputs, Utils.ContentTypes.applicationXWwwFormUrlencoded);
    };
    Object.defineProperty(HttpHeader.prototype, "value", {
        get: function () {
            return this._value.get();
        },
        set: function (newValue) {
            this._value.set(newValue);
        },
        enumerable: true,
        configurable: true
    });
    return HttpHeader;
}());
exports.HttpHeader = HttpHeader;
var HttpAction = /** @class */ (function (_super) {
    __extends(HttpAction, _super);
    function HttpAction() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._url = new Utils.StringWithSubstitutions();
        _this._body = new Utils.StringWithSubstitutions();
        _this._headers = [];
        return _this;
    }
    HttpAction.prototype.getJsonTypeName = function () {
        return "Action.Http";
    };
    HttpAction.prototype.toJSON = function () {
        var result = _super.prototype.toJSON.call(this);
        Utils.setProperty(result, "method", this.method);
        Utils.setProperty(result, "url", this._url.getOriginal());
        Utils.setProperty(result, "body", this._body.getOriginal());
        if (this._headers.length > 0) {
            var headers = [];
            for (var _i = 0, _a = this._headers; _i < _a.length; _i++) {
                var header = _a[_i];
                headers.push(header.toJSON());
            }
            Utils.setProperty(result, "headers", headers);
        }
        return result;
    };
    HttpAction.prototype.validate = function () {
        var result = [];
        if (!this.url) {
            result = [{ error: Enums.ValidationError.PropertyCantBeNull, message: "An Action.Http must have its url property set." }];
        }
        if (this.headers.length > 0) {
            for (var i = 0; i < this.headers.length; i++) {
                if (!this.headers[i].name || !this.headers[i].value) {
                    result = result.concat([{ error: Enums.ValidationError.PropertyCantBeNull, message: "All headers of an Action.Http must have their name and value properties set." }]);
                    break;
                }
            }
        }
        return result;
    };
    HttpAction.prototype.prepare = function (inputs) {
        this._url.substituteInputValues(inputs, Utils.ContentTypes.applicationXWwwFormUrlencoded);
        var contentType = Utils.ContentTypes.applicationJson;
        for (var i = 0; i < this._headers.length; i++) {
            this._headers[i].prepare(inputs);
            if (this._headers[i].name && this._headers[i].name.toLowerCase() == "content-type") {
                contentType = this._headers[i].value;
            }
        }
        this._body.substituteInputValues(inputs, contentType);
    };
    ;
    HttpAction.prototype.parse = function (json, errors) {
        _super.prototype.parse.call(this, json, errors);
        this.url = json["url"];
        this.method = json["method"];
        this.body = json["body"];
        this._headers = [];
        if (json["headers"] != null) {
            var jsonHeaders = json["headers"];
            for (var i = 0; i < jsonHeaders.length; i++) {
                var httpHeader = new HttpHeader();
                httpHeader.name = jsonHeaders[i]["name"];
                httpHeader.value = jsonHeaders[i]["value"];
                this.headers.push(httpHeader);
            }
        }
    };
    Object.defineProperty(HttpAction.prototype, "url", {
        get: function () {
            return this._url.get();
        },
        set: function (value) {
            this._url.set(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HttpAction.prototype, "body", {
        get: function () {
            return this._body.get();
        },
        set: function (value) {
            this._body.set(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HttpAction.prototype, "headers", {
        get: function () {
            return this._headers ? this._headers : [];
        },
        set: function (value) {
            this._headers = value;
        },
        enumerable: true,
        configurable: true
    });
    return HttpAction;
}(Action));
exports.HttpAction = HttpAction;
var ShowCardAction = /** @class */ (function (_super) {
    __extends(ShowCardAction, _super);
    function ShowCardAction() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.card = new InlineAdaptiveCard();
        return _this;
    }
    ShowCardAction.prototype.addCssClasses = function (element) {
        _super.prototype.addCssClasses.call(this, element);
        element.classList.add(this.parent.hostConfig.makeCssClassName("expandable"));
    };
    ShowCardAction.prototype.getJsonTypeName = function () {
        return "Action.ShowCard";
    };
    ShowCardAction.prototype.toJSON = function () {
        var result = _super.prototype.toJSON.call(this);
        if (this.card) {
            Utils.setProperty(result, "card", this.card.toJSON());
        }
        return result;
    };
    ShowCardAction.prototype.validate = function () {
        return this.card.validate();
    };
    ShowCardAction.prototype.parse = function (json, errors) {
        _super.prototype.parse.call(this, json, errors);
        this.card.parse(json["card"], errors);
    };
    ShowCardAction.prototype.setParent = function (value) {
        _super.prototype.setParent.call(this, value);
        this.card.setParent(value);
    };
    ShowCardAction.prototype.getAllInputs = function () {
        return this.card.getAllInputs();
    };
    ShowCardAction.prototype.getResourceInformation = function () {
        return _super.prototype.getResourceInformation.call(this).concat(this.card.getResourceInformation());
    };
    ShowCardAction.prototype.getActionById = function (id) {
        var result = _super.prototype.getActionById.call(this, id);
        if (!result) {
            result = this.card.getActionById(id);
        }
        return result;
    };
    return ShowCardAction;
}(Action));
exports.ShowCardAction = ShowCardAction;
var ActionCollection = /** @class */ (function () {
    function ActionCollection(owner) {
        this._expandedAction = null;
        this._renderedActionCount = 0;
        this._statusCard = null;
        this._actionCard = null;
        this.items = [];
        this.buttons = [];
        this._owner = owner;
    }
    ActionCollection.prototype.isActionCardContainerVisible = function () {
        return this._actionCardContainer.children.length > 0;
    };
    ActionCollection.prototype.refreshContainer = function () {
        this._actionCardContainer.innerHTML = "";
        if (this._actionCard === null && this._statusCard === null) {
            this._actionCardContainer.style.padding = "0px";
            this._actionCardContainer.style.marginTop = "0px";
            return;
        }
        this._actionCardContainer.style.marginTop = this._renderedActionCount > 0 ? this._owner.hostConfig.actions.showCard.inlineTopMargin + "px" : "0px";
        var padding = this._owner.getNonZeroPadding().toSpacingDefinition(this._owner.hostConfig);
        if (this._actionCard !== null) {
            this._actionCard.style.paddingLeft = padding.left + "px";
            this._actionCard.style.paddingRight = padding.right + "px";
            this._actionCard.style.marginLeft = "-" + padding.left + "px";
            this._actionCard.style.marginRight = "-" + padding.right + "px";
            Utils.appendChild(this._actionCardContainer, this._actionCard);
        }
        if (this._statusCard !== null) {
            this._statusCard.style.paddingLeft = padding.left + "px";
            this._statusCard.style.paddingRight = padding.right + "px";
            this._statusCard.style.marginLeft = "-" + padding.left + "px";
            this._statusCard.style.marginRight = "-" + padding.right + "px";
            Utils.appendChild(this._actionCardContainer, this._statusCard);
        }
    };
    ActionCollection.prototype.layoutChanged = function () {
        this._owner.getRootElement().updateLayout();
    };
    ActionCollection.prototype.hideActionCard = function () {
        var previouslyExpandedAction = this._expandedAction;
        this._expandedAction = null;
        this._actionCard = null;
        this.refreshContainer();
        if (previouslyExpandedAction) {
            this.layoutChanged();
            raiseInlineCardExpandedEvent(previouslyExpandedAction, false);
        }
    };
    ActionCollection.prototype.showActionCard = function (action, suppressStyle, raiseEvent) {
        if (suppressStyle === void 0) { suppressStyle = false; }
        if (raiseEvent === void 0) { raiseEvent = true; }
        if (action.card == null) {
            return;
        }
        action.card.suppressStyle = suppressStyle;
        var renderedCard = action.card.render();
        this._actionCard = renderedCard;
        this._expandedAction = action;
        this.refreshContainer();
        if (raiseEvent) {
            this.layoutChanged();
            raiseInlineCardExpandedEvent(action, true);
        }
    };
    ActionCollection.prototype.collapseExpandedAction = function () {
        for (var i = 0; i < this.buttons.length; i++) {
            this.buttons[i].state = ActionButtonState.Normal;
        }
        this.hideActionCard();
    };
    ActionCollection.prototype.expandShowCardAction = function (action, raiseEvent) {
        for (var i = 0; i < this.buttons.length; i++) {
            if (this.buttons[i].action !== action) {
                this.buttons[i].state = ActionButtonState.Subdued;
            }
            else {
                this.buttons[i].state = ActionButtonState.Expanded;
            }
        }
        this.showActionCard(action, !(this._owner.isAtTheVeryLeft() && this._owner.isAtTheVeryRight()), raiseEvent);
    };
    ActionCollection.prototype.actionClicked = function (actionButton) {
        if (!(actionButton.action instanceof ShowCardAction)) {
            for (var i = 0; i < this.buttons.length; i++) {
                this.buttons[i].state = ActionButtonState.Normal;
            }
            this.hideStatusCard();
            this.hideActionCard();
            actionButton.action.execute();
        }
        else {
            this.hideStatusCard();
            if (this._owner.hostConfig.actions.showCard.actionMode === Enums.ShowCardActionMode.Popup) {
                actionButton.action.execute();
            }
            else if (actionButton.action === this._expandedAction) {
                this.collapseExpandedAction();
            }
            else {
                this.expandShowCardAction(actionButton.action, true);
            }
        }
    };
    ActionCollection.prototype.getParentContainer = function () {
        if (this._owner instanceof Container) {
            return this._owner;
        }
        else {
            return this._owner.getParentContainer();
        }
    };
    ActionCollection.prototype.findActionButton = function (action) {
        for (var _i = 0, _a = this.buttons; _i < _a.length; _i++) {
            var actionButton = _a[_i];
            if (actionButton.action == action) {
                return actionButton;
            }
        }
        return null;
    };
    ActionCollection.prototype.toJSON = function () {
        if (this.items.length > 0) {
            var result = [];
            for (var _i = 0, _a = this.items; _i < _a.length; _i++) {
                var action = _a[_i];
                result.push(action.toJSON());
            }
            return result;
        }
        else {
            return null;
        }
    };
    ActionCollection.prototype.showStatusCard = function (status) {
        status.setParent(this._owner);
        this._statusCard = status.render();
        this.refreshContainer();
    };
    ActionCollection.prototype.hideStatusCard = function () {
        this._statusCard = null;
        this.refreshContainer();
    };
    ActionCollection.prototype.getActionById = function (id) {
        var result = null;
        for (var i = 0; i < this.items.length; i++) {
            result = this.items[i].getActionById(id);
            if (result) {
                break;
            }
        }
        return result;
    };
    ActionCollection.prototype.validate = function () {
        var result = [];
        if (this._owner.hostConfig.actions.maxActions && this.items.length > this._owner.hostConfig.actions.maxActions) {
            result.push({
                error: Enums.ValidationError.TooManyActions,
                message: "A maximum of " + this._owner.hostConfig.actions.maxActions + " actions are allowed."
            });
        }
        if (this.items.length > 0 && !this._owner.hostConfig.supportsInteractivity) {
            result.push({
                error: Enums.ValidationError.InteractivityNotAllowed,
                message: "Interactivity is not allowed."
            });
        }
        for (var i = 0; i < this.items.length; i++) {
            if (!isActionAllowed(this.items[i], this._owner.getForbiddenActionTypes())) {
                result.push({
                    error: Enums.ValidationError.ActionTypeNotAllowed,
                    message: "Actions of type " + this.items[i].getJsonTypeName() + " are not allowe."
                });
            }
        }
        for (var i = 0; i < this.items.length; i++) {
            result = result.concat(this.items[i].validate());
        }
        return result;
    };
    ActionCollection.prototype.render = function (orientation, isDesignMode) {
        var _this = this;
        if (!this._owner.hostConfig.supportsInteractivity) {
            return null;
        }
        var element = document.createElement("div");
        var maxActions = this._owner.hostConfig.actions.maxActions ? Math.min(this._owner.hostConfig.actions.maxActions, this.items.length) : this.items.length;
        var forbiddenActionTypes = this._owner.getForbiddenActionTypes();
        this._actionCardContainer = document.createElement("div");
        this._renderedActionCount = 0;
        if (this._owner.hostConfig.actions.preExpandSingleShowCardAction && maxActions == 1 && this.items[0] instanceof ShowCardAction && isActionAllowed(this.items[0], forbiddenActionTypes)) {
            this.showActionCard(this.items[0], true);
            this._renderedActionCount = 1;
        }
        else {
            var buttonStrip = document.createElement("div");
            buttonStrip.className = this._owner.hostConfig.makeCssClassName("ac-actionSet");
            buttonStrip.style.display = "flex";
            if (orientation == Enums.Orientation.Horizontal) {
                buttonStrip.style.flexDirection = "row";
                if (this._owner.horizontalAlignment && this._owner.hostConfig.actions.actionAlignment != Enums.ActionAlignment.Stretch) {
                    switch (this._owner.horizontalAlignment) {
                        case Enums.HorizontalAlignment.Center:
                            buttonStrip.style.justifyContent = "center";
                            break;
                        case Enums.HorizontalAlignment.Right:
                            buttonStrip.style.justifyContent = "flex-end";
                            break;
                        default:
                            buttonStrip.style.justifyContent = "flex-start";
                            break;
                    }
                }
                else {
                    switch (this._owner.hostConfig.actions.actionAlignment) {
                        case Enums.ActionAlignment.Center:
                            buttonStrip.style.justifyContent = "center";
                            break;
                        case Enums.ActionAlignment.Right:
                            buttonStrip.style.justifyContent = "flex-end";
                            break;
                        default:
                            buttonStrip.style.justifyContent = "flex-start";
                            break;
                    }
                }
            }
            else {
                buttonStrip.style.flexDirection = "column";
                if (this._owner.horizontalAlignment && this._owner.hostConfig.actions.actionAlignment != Enums.ActionAlignment.Stretch) {
                    switch (this._owner.horizontalAlignment) {
                        case Enums.HorizontalAlignment.Center:
                            buttonStrip.style.alignItems = "center";
                            break;
                        case Enums.HorizontalAlignment.Right:
                            buttonStrip.style.alignItems = "flex-end";
                            break;
                        default:
                            buttonStrip.style.alignItems = "flex-start";
                            break;
                    }
                }
                else {
                    switch (this._owner.hostConfig.actions.actionAlignment) {
                        case Enums.ActionAlignment.Center:
                            buttonStrip.style.alignItems = "center";
                            break;
                        case Enums.ActionAlignment.Right:
                            buttonStrip.style.alignItems = "flex-end";
                            break;
                        case Enums.ActionAlignment.Stretch:
                            buttonStrip.style.alignItems = "stretch";
                            break;
                        default:
                            buttonStrip.style.alignItems = "flex-start";
                            break;
                    }
                }
            }
            var parentContainerStyle = this.getParentContainer().style;
            for (var i = 0; i < this.items.length; i++) {
                if (isActionAllowed(this.items[i], forbiddenActionTypes)) {
                    var actionButton = this.findActionButton(this.items[i]);
                    if (!actionButton) {
                        actionButton = new ActionButton(this.items[i], parentContainerStyle);
                        actionButton.action.renderedElement.style.overflow = "hidden";
                        actionButton.action.renderedElement.style.overflow = "table-cell";
                        actionButton.action.renderedElement.style.flex = this._owner.hostConfig.actions.actionAlignment === Enums.ActionAlignment.Stretch ? "0 1 100%" : "0 1 auto";
                        actionButton.onClick = function (ab) { _this.actionClicked(ab); };
                        this.buttons.push(actionButton);
                    }
                    buttonStrip.appendChild(actionButton.action.renderedElement);
                    this._renderedActionCount++;
                    if (this._renderedActionCount >= this._owner.hostConfig.actions.maxActions || i == this.items.length - 1) {
                        break;
                    }
                    else if (this._owner.hostConfig.actions.buttonSpacing > 0) {
                        var spacer = document.createElement("div");
                        if (orientation === Enums.Orientation.Horizontal) {
                            spacer.style.flex = "0 0 auto";
                            spacer.style.width = this._owner.hostConfig.actions.buttonSpacing + "px";
                        }
                        else {
                            spacer.style.height = this._owner.hostConfig.actions.buttonSpacing + "px";
                        }
                        Utils.appendChild(buttonStrip, spacer);
                    }
                }
            }
            var buttonStripContainer = document.createElement("div");
            buttonStripContainer.style.overflow = "hidden";
            buttonStripContainer.appendChild(buttonStrip);
            Utils.appendChild(element, buttonStripContainer);
        }
        Utils.appendChild(element, this._actionCardContainer);
        for (var i = 0; i < this.buttons.length; i++) {
            if (this.buttons[i].state == ActionButtonState.Expanded) {
                this.expandShowCardAction(this.buttons[i].action, false);
                break;
            }
        }
        return this._renderedActionCount > 0 ? element : null;
    };
    ActionCollection.prototype.addAction = function (action) {
        if ((!action.parent || action.parent === this._owner) && this.items.indexOf(action) < 0) {
            this.items.push(action);
            if (!action.parent) {
                action.setParent(this._owner);
            }
            invokeSetCollection(action, this);
        }
        else {
            throw new Error("The action already belongs to another element.");
        }
    };
    ActionCollection.prototype.removeAction = function (action) {
        if (this.expandedAction && this._expandedAction == action) {
            this.collapseExpandedAction();
        }
        var actionIndex = this.items.indexOf(action);
        if (actionIndex >= 0) {
            this.items.splice(actionIndex, 1);
            action.setParent(null);
            invokeSetCollection(action, null);
            for (var i = 0; i < this.buttons.length; i++) {
                if (this.buttons[i].action == action) {
                    this.buttons.splice(i, 1);
                    break;
                }
            }
            return true;
        }
        return false;
    };
    ActionCollection.prototype.clear = function () {
        this.items = [];
        this.buttons = [];
        this._expandedAction = null;
        this._renderedActionCount = 0;
    };
    ActionCollection.prototype.getAllInputs = function () {
        var result = [];
        for (var i = 0; i < this.items.length; i++) {
            var action = this.items[i];
            result = result.concat(action.getAllInputs());
        }
        return result;
    };
    ActionCollection.prototype.getResourceInformation = function () {
        var result = [];
        for (var i = 0; i < this.items.length; i++) {
            result = result.concat(this.items[i].getResourceInformation());
        }
        return result;
    };
    Object.defineProperty(ActionCollection.prototype, "renderedActionCount", {
        get: function () {
            return this._renderedActionCount;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActionCollection.prototype, "expandedAction", {
        get: function () {
            return this._expandedAction;
        },
        enumerable: true,
        configurable: true
    });
    return ActionCollection;
}());
var ActionSet = /** @class */ (function (_super) {
    __extends(ActionSet, _super);
    function ActionSet() {
        var _this = _super.call(this) || this;
        _this.orientation = null;
        _this._actionCollection = new ActionCollection(_this);
        return _this;
    }
    ActionSet.prototype.internalRender = function () {
        return this._actionCollection.render(this.orientation ? this.orientation : this.hostConfig.actions.actionsOrientation, this.isDesignMode());
    };
    ActionSet.prototype.toJSON = function () {
        var result = _super.prototype.toJSON.call(this);
        Utils.setEnumProperty(Enums.Orientation, result, "orientation", this.orientation);
        Utils.setProperty(result, "actions", this._actionCollection.toJSON());
        return result;
    };
    ActionSet.prototype.isBleeding = function () {
        return this._actionCollection.expandedAction ? true : false;
    };
    ActionSet.prototype.getJsonTypeName = function () {
        return "ActionSet";
    };
    ActionSet.prototype.getActionCount = function () {
        return this._actionCollection.items.length;
    };
    ActionSet.prototype.getActionAt = function (index) {
        if (index >= 0 && index < this.getActionCount()) {
            return this._actionCollection.items[index];
        }
        else {
            _super.prototype.getActionAt.call(this, index);
        }
    };
    ActionSet.prototype.validate = function () {
        return this._actionCollection.validate();
    };
    ActionSet.prototype.parse = function (json, errors) {
        _super.prototype.parse.call(this, json, errors);
        var jsonOrientation = json["orientation"];
        if (jsonOrientation) {
            this.orientation = Utils.getEnumValueOrDefault(Enums.Orientation, jsonOrientation, Enums.Orientation.Horizontal);
        }
        if (json["actions"] != undefined) {
            var jsonActions = json["actions"];
            for (var i = 0; i < jsonActions.length; i++) {
                var action = createActionInstance(jsonActions[i], errors);
                if (action) {
                    action.setParent(this);
                    action.parse(jsonActions[i]);
                    this.addAction(action);
                }
            }
        }
    };
    ActionSet.prototype.addAction = function (action) {
        if (action != null) {
            this._actionCollection.addAction(action);
        }
    };
    ActionSet.prototype.getAllInputs = function () {
        return this._actionCollection.getAllInputs();
    };
    ActionSet.prototype.getResourceInformation = function () {
        return this._actionCollection.getResourceInformation();
    };
    ActionSet.prototype.renderSpeech = function () {
        // TODO: What's the right thing to do here?
        return "";
    };
    Object.defineProperty(ActionSet.prototype, "isInteractive", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    return ActionSet;
}(CardElement));
exports.ActionSet = ActionSet;
var BackgroundImage = /** @class */ (function () {
    function BackgroundImage() {
        this.mode = Enums.BackgroundImageMode.Stretch;
        this.horizontalAlignment = Enums.HorizontalAlignment.Left;
        this.verticalAlignment = Enums.VerticalAlignment.Top;
    }
    BackgroundImage.prototype.parse = function (json, errors) {
        this.url = json["url"];
        this.mode = Utils.getEnumValueOrDefault(Enums.BackgroundImageMode, json["mode"], this.mode);
        this.horizontalAlignment = Utils.getEnumValueOrDefault(Enums.HorizontalAlignment, json["horizontalAlignment"], this.horizontalAlignment);
        this.verticalAlignment = Utils.getEnumValueOrDefault(Enums.VerticalAlignment, json["verticalAlignment"], this.verticalAlignment);
    };
    BackgroundImage.prototype.apply = function (element) {
        if (this.url) {
            element.style.backgroundImage = "url('" + this.url + "')";
            switch (this.mode) {
                case Enums.BackgroundImageMode.Repeat:
                    element.style.backgroundRepeat = "repeat";
                    break;
                case Enums.BackgroundImageMode.RepeatHorizontally:
                    element.style.backgroundRepeat = "repeat-x";
                    break;
                case Enums.BackgroundImageMode.RepeatVertically:
                    element.style.backgroundRepeat = "repeat-y";
                    break;
                case Enums.BackgroundImageMode.Stretch:
                default:
                    element.style.backgroundRepeat = "no-repeat";
                    element.style.backgroundSize = "cover";
                    break;
            }
            switch (this.horizontalAlignment) {
                case Enums.HorizontalAlignment.Center:
                    element.style.backgroundPositionX = "center";
                    break;
                case Enums.HorizontalAlignment.Right:
                    element.style.backgroundPositionX = "right";
                    break;
            }
            switch (this.verticalAlignment) {
                case Enums.VerticalAlignment.Center:
                    element.style.backgroundPositionY = "center";
                    break;
                case Enums.VerticalAlignment.Bottom:
                    element.style.backgroundPositionY = "bottom";
                    break;
            }
        }
    };
    return BackgroundImage;
}());
exports.BackgroundImage = BackgroundImage;
var Container = /** @class */ (function (_super) {
    __extends(Container, _super);
    function Container() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._items = [];
        _this._renderedItems = [];
        _this._style = null;
        _this.verticalContentAlignment = Enums.VerticalAlignment.Top;
        return _this;
    }
    Container.prototype.isElementAllowed = function (element, forbiddenElementTypes) {
        if (!this.hostConfig.supportsInteractivity && element.isInteractive) {
            return false;
        }
        if (forbiddenElementTypes) {
            for (var i = 0; i < forbiddenElementTypes.length; i++) {
                if (element.getJsonTypeName() === forbiddenElementTypes[i]) {
                    return false;
                }
            }
        }
        return true;
    };
    Container.prototype.insertItemAt = function (item, index) {
        if (!item.parent) {
            if (item.isStandalone) {
                if (index < 0 || index >= this._items.length) {
                    this._items.push(item);
                }
                else {
                    this._items.splice(index, 0, item);
                }
                item.setParent(this);
            }
            else {
                throw new Error("Elements of type " + item.getJsonTypeName() + " cannot be used as standalone elements.");
            }
        }
        else {
            throw new Error("The element already belongs to another container.");
        }
    };
    Object.defineProperty(Container.prototype, "hasExplicitStyle", {
        get: function () {
            return this._style != null;
        },
        enumerable: true,
        configurable: true
    });
    Container.prototype.getItemsCollectionPropertyName = function () {
        return "items";
    };
    Container.prototype.isLastElementBleeding = function () {
        return this._renderedItems.length > 0 ? this._renderedItems[this._renderedItems.length - 1].isBleeding() : false;
    };
    Container.prototype.applyPadding = function () {
        if (!this.renderedElement) {
            return;
        }
        if (this.padding) {
            var physicalPadding = this.padding.toSpacingDefinition(this.hostConfig);
            this.renderedElement.style.paddingTop = physicalPadding.top + "px";
            this.renderedElement.style.paddingRight = physicalPadding.right + "px";
            this.renderedElement.style.paddingBottom = physicalPadding.bottom + "px";
            this.renderedElement.style.paddingLeft = physicalPadding.left + "px";
        }
        else if (this.hasBackground) {
            var physicalMargin = new SpacingDefinition();
            var physicalPadding = new SpacingDefinition();
            var useAutoPadding = (this.parent ? this.parent.canContentBleed() : false) && AdaptiveCard.useAutomaticContainerBleeding;
            if (useAutoPadding) {
                var effectivePadding = this.getNonZeroPadding();
                var effectiveMargin = new PaddingDefinition(effectivePadding.top, effectivePadding.right, effectivePadding.bottom, effectivePadding.left);
                if (!this.isAtTheVeryTop()) {
                    effectivePadding.top = Enums.Spacing.None;
                    effectiveMargin.top = Enums.Spacing.None;
                }
                if (!this.isAtTheVeryBottom()) {
                    effectivePadding.bottom = Enums.Spacing.None;
                    effectiveMargin.bottom = Enums.Spacing.None;
                }
                if (!this.isAtTheVeryLeft()) {
                    effectivePadding.left = Enums.Spacing.None;
                    effectiveMargin.left = Enums.Spacing.None;
                }
                if (!this.isAtTheVeryRight()) {
                    effectivePadding.right = Enums.Spacing.None;
                    effectiveMargin.right = Enums.Spacing.None;
                }
                if (effectivePadding.left != Enums.Spacing.None || effectivePadding.right != Enums.Spacing.None) {
                    if (effectivePadding.left == Enums.Spacing.None) {
                        effectivePadding.left = effectivePadding.right;
                    }
                    if (effectivePadding.right == Enums.Spacing.None) {
                        effectivePadding.right = effectivePadding.left;
                    }
                }
                if (effectivePadding.top != Enums.Spacing.None || effectivePadding.bottom != Enums.Spacing.None) {
                    if (effectivePadding.top == Enums.Spacing.None) {
                        effectivePadding.top = effectivePadding.bottom;
                    }
                    if (effectivePadding.bottom == Enums.Spacing.None) {
                        effectivePadding.bottom = effectivePadding.top;
                    }
                }
                if (effectivePadding.top != Enums.Spacing.None
                    || effectivePadding.right != Enums.Spacing.None
                    || effectivePadding.bottom != Enums.Spacing.None
                    || effectivePadding.left != Enums.Spacing.None) {
                    if (effectivePadding.top == Enums.Spacing.None) {
                        effectivePadding.top = Enums.Spacing.Default;
                    }
                    if (effectivePadding.right == Enums.Spacing.None) {
                        effectivePadding.right = Enums.Spacing.Default;
                    }
                    if (effectivePadding.bottom == Enums.Spacing.None) {
                        effectivePadding = Object.assign({}, effectivePadding, { bottom: Enums.Spacing.Default });
                    }
                    if (effectivePadding.left == Enums.Spacing.None) {
                        effectivePadding = Object.assign({}, effectivePadding, { left: Enums.Spacing.Default });
                    }
                }
                if (effectivePadding.top == Enums.Spacing.None &&
                    effectivePadding.right == Enums.Spacing.None &&
                    effectivePadding.bottom == Enums.Spacing.None &&
                    effectivePadding.left == Enums.Spacing.None) {
                    effectivePadding = new PaddingDefinition(Enums.Spacing.Padding, Enums.Spacing.Padding, Enums.Spacing.Padding, Enums.Spacing.Padding);
                }
                physicalMargin = effectiveMargin.toSpacingDefinition(this.hostConfig);
                physicalPadding = effectivePadding.toSpacingDefinition(this.hostConfig);
            }
            else {
                physicalPadding = new PaddingDefinition(Enums.Spacing.Padding, Enums.Spacing.Padding, Enums.Spacing.Padding, Enums.Spacing.Padding).toSpacingDefinition(this.hostConfig);
            }
            this.renderedElement.style.marginTop = "-" + physicalMargin.top + "px";
            this.renderedElement.style.marginRight = "-" + physicalMargin.right + "px";
            this.renderedElement.style.marginBottom = "-" + physicalMargin.bottom + "px";
            this.renderedElement.style.marginLeft = "-" + physicalMargin.left + "px";
            this.renderedElement.style.paddingTop = physicalPadding.top + "px";
            this.renderedElement.style.paddingRight = physicalPadding.right + "px";
            this.renderedElement.style.paddingBottom = physicalPadding.bottom + "px";
            this.renderedElement.style.paddingLeft = physicalPadding.left + "px";
            if (this.separatorElement) {
                if (this.separatorOrientation == Enums.Orientation.Horizontal) {
                    this.separatorElement.style.marginLeft = "-" + physicalMargin.left + "px";
                    this.separatorElement.style.marginRight = "-" + physicalMargin.right + "px";
                }
                else {
                    this.separatorElement.style.marginTop = "-" + physicalMargin.top + "px";
                    this.separatorElement.style.marginBottom = "-" + physicalMargin.bottom + "px";
                }
            }
        }
        if (this.isLastElementBleeding()) {
            this.renderedElement.style.paddingBottom = "0px";
        }
    };
    Container.prototype.internalRender = function () {
        var _this = this;
        this._renderedItems = [];
        // Cache hostConfig to avoid walking the parent hierarchy several times
        var hostConfig = this.hostConfig;
        var element = document.createElement("div");
        element.classList.add(hostConfig.makeCssClassName("ac-container"));
        element.style.display = "flex";
        element.style.flexDirection = "column";
        if (AdaptiveCard.useAdvancedCardBottomTruncation) {
            // Forces the container to be at least as tall as its content.
            //
            // Fixes a quirk in Chrome where, for nested flex elements, the
            // inner element's height would never exceed the outer element's
            // height. This caused overflow truncation to break -- containers
            // would always be measured as not overflowing, since their heights
            // were constrained by their parents as opposed to truly reflecting
            // the height of their content.
            //
            // See the "Browser Rendering Notes" section of this answer:
            // https://stackoverflow.com/questions/36247140/why-doesnt-flex-item-shrink-past-content-size
            element.style.minHeight = '-webkit-min-content';
        }
        switch (this.verticalContentAlignment) {
            case Enums.VerticalAlignment.Center:
                element.style.justifyContent = "center";
                break;
            case Enums.VerticalAlignment.Bottom:
                element.style.justifyContent = "flex-end";
                break;
            default:
                element.style.justifyContent = "flex-start";
                break;
        }
        if (this.hasBackground) {
            if (this.backgroundImage) {
                this.backgroundImage.apply(element);
            }
            var styleDefinition = this.hostConfig.containerStyles.getStyleByName(this.style, this.hostConfig.containerStyles.default);
            if (!Utils.isNullOrEmpty(styleDefinition.backgroundColor)) {
                element.style.backgroundColor = Utils.stringToCssColor(styleDefinition.backgroundColor);
            }
        }
        if (this.selectAction && hostConfig.supportsInteractivity) {
            element.classList.add(hostConfig.makeCssClassName("ac-selectable"));
            element.tabIndex = 0;
            element.setAttribute("role", "button");
            element.setAttribute("aria-label", this.selectAction.title);
            element.onclick = function (e) {
                if (_this.selectAction != null) {
                    _this.selectAction.execute();
                    e.cancelBubble = true;
                }
            };
            element.onkeypress = function (e) {
                if (_this.selectAction != null) {
                    // Enter or space pressed
                    if (e.keyCode == 13 || e.keyCode == 32) {
                        _this.selectAction.execute();
                    }
                }
            };
        }
        if (this._items.length > 0) {
            for (var i = 0; i < this._items.length; i++) {
                var renderedElement = this.isElementAllowed(this._items[i], this.getForbiddenElementTypes()) ? this._items[i].render() : null;
                if (renderedElement) {
                    if (this._renderedItems.length > 0 && this._items[i].separatorElement) {
                        this._items[i].separatorElement.style.flex = "0 0 auto";
                        Utils.appendChild(element, this._items[i].separatorElement);
                    }
                    Utils.appendChild(element, renderedElement);
                    this._renderedItems.push(this._items[i]);
                }
            }
        }
        else {
            if (this.isDesignMode()) {
                var placeholderElement = this.createPlaceholderElement();
                placeholderElement.style.width = "100%";
                placeholderElement.style.height = "100%";
                element.appendChild(placeholderElement);
            }
        }
        return element;
    };
    Container.prototype.truncateOverflow = function (maxHeight) {
        // Add 1 to account for rounding differences between browsers
        var boundary = this.renderedElement.offsetTop + maxHeight + 1;
        var handleElement = function (cardElement) {
            var elt = cardElement.renderedElement;
            if (elt) {
                switch (Utils.getFitStatus(elt, boundary)) {
                    case Enums.ContainerFitStatus.FullyInContainer:
                        var sizeChanged = cardElement['resetOverflow']();
                        // If the element's size changed after resetting content,
                        // we have to check if it still fits fully in the card
                        if (sizeChanged) {
                            handleElement(cardElement);
                        }
                        break;
                    case Enums.ContainerFitStatus.Overflowing:
                        var maxHeight_1 = boundary - elt.offsetTop;
                        cardElement['handleOverflow'](maxHeight_1);
                        break;
                    case Enums.ContainerFitStatus.FullyOutOfContainer:
                        cardElement['handleOverflow'](0);
                        break;
                }
            }
        };
        for (var _i = 0, _a = this._items; _i < _a.length; _i++) {
            var item = _a[_i];
            handleElement(item);
        }
        return true;
    };
    Container.prototype.undoOverflowTruncation = function () {
        for (var _i = 0, _a = this._items; _i < _a.length; _i++) {
            var item = _a[_i];
            item['resetOverflow']();
        }
    };
    Object.defineProperty(Container.prototype, "hasBackground", {
        get: function () {
            var parentContainer = this.getParentContainer();
            return this.backgroundImage != undefined || (this.hasExplicitStyle && (parentContainer ? parentContainer.style != this.style : false));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Container.prototype, "defaultStyle", {
        get: function () {
            return Enums.ContainerStyle.Default;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Container.prototype, "allowCustomStyle", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    Container.prototype.toJSON = function () {
        var result = _super.prototype.toJSON.call(this);
        if (this._selectAction) {
            Utils.setProperty(result, "selectAction", this._selectAction.toJSON());
        }
        if (this.backgroundImage) {
            Utils.setProperty(result, "backgroundImage", this.backgroundImage.url);
        }
        Utils.setProperty(result, "style", this.style, "default");
        Utils.setEnumProperty(Enums.VerticalAlignment, result, "verticalContentAlignment", this.verticalContentAlignment, Enums.VerticalAlignment.Top);
        if (this._items.length > 0) {
            var elements = [];
            for (var _i = 0, _a = this._items; _i < _a.length; _i++) {
                var element = _a[_i];
                elements.push(element.toJSON());
            }
            Utils.setProperty(result, this.getItemsCollectionPropertyName(), elements);
        }
        return result;
    };
    Container.prototype.isBleeding = function () {
        return this.isLastElementBleeding();
    };
    Container.prototype.getItemCount = function () {
        return this._items.length;
    };
    Container.prototype.getItemAt = function (index) {
        return this._items[index];
    };
    Container.prototype.getJsonTypeName = function () {
        return "Container";
    };
    Container.prototype.isFirstElement = function (element) {
        for (var i = 0; i < this._items.length; i++) {
            if (this._items[i].isVisible) {
                return this._items[i] == element;
            }
        }
        return false;
    };
    Container.prototype.isLastElement = function (element) {
        for (var i = this._items.length - 1; i >= 0; i--) {
            if (this._items[i].isVisible) {
                return this._items[i] == element;
            }
        }
        return false;
    };
    Container.prototype.validate = function () {
        var result = [];
        if (this._style) {
            var styleDefinition = this.hostConfig.containerStyles.getStyleByName(this._style);
            if (!styleDefinition) {
                result.push({
                    error: Enums.ValidationError.InvalidPropertyValue,
                    message: "Unknown container style: " + this._style
                });
            }
        }
        for (var i = 0; i < this._items.length; i++) {
            if (!this.hostConfig.supportsInteractivity && this._items[i].isInteractive) {
                result.push({
                    error: Enums.ValidationError.InteractivityNotAllowed,
                    message: "Interactivity is not allowed."
                });
            }
            if (!this.isElementAllowed(this._items[i], this.getForbiddenElementTypes())) {
                result.push({
                    error: Enums.ValidationError.InteractivityNotAllowed,
                    message: "Elements of type " + this._items[i].getJsonTypeName() + " are not allowed in this container."
                });
            }
            result = result.concat(this._items[i].validate());
        }
        return result;
    };
    Container.prototype.parse = function (json, errors) {
        _super.prototype.parse.call(this, json, errors);
        this._items = [];
        this._renderedItems = [];
        var jsonBackgroundImage = json["backgroundImage"];
        if (jsonBackgroundImage) {
            this.backgroundImage = new BackgroundImage();
            if (typeof jsonBackgroundImage === "string") {
                this.backgroundImage.url = jsonBackgroundImage;
                this.backgroundImage.mode = Enums.BackgroundImageMode.Stretch;
            }
            else if (typeof jsonBackgroundImage === "object") {
                this.backgroundImage = new BackgroundImage();
                this.backgroundImage.parse(json["backgroundImage"], errors);
            }
        }
        this.verticalContentAlignment = Utils.getEnumValueOrDefault(Enums.VerticalAlignment, json["verticalContentAlignment"], this.verticalContentAlignment);
        this._style = json["style"];
        if (json[this.getItemsCollectionPropertyName()] != null) {
            var items = json[this.getItemsCollectionPropertyName()];
            this.clear();
            for (var i = 0; i < items.length; i++) {
                var elementType = items[i]["type"];
                var element = AdaptiveCard.elementTypeRegistry.createInstance(elementType);
                if (!element) {
                    raiseParseError({
                        error: Enums.ValidationError.UnknownElementType,
                        message: "Unknown element type: " + elementType
                    }, errors);
                }
                else {
                    this.addItem(element);
                    element.parse(items[i], errors);
                }
            }
        }
        var selectActionJson = json["selectAction"];
        if (selectActionJson != undefined) {
            this.selectAction = createActionInstance(selectActionJson, errors);
            if (this.selectAction) {
                this.selectAction.setParent(this);
                this.selectAction.parse(selectActionJson);
            }
        }
    };
    Container.prototype.addItem = function (item) {
        this.insertItemAt(item, -1);
    };
    Container.prototype.indexOf = function (cardElement) {
        return this._items.indexOf(cardElement);
    };
    Container.prototype.insertItemBefore = function (item, insertBefore) {
        this.insertItemAt(item, this._items.indexOf(insertBefore));
    };
    Container.prototype.insertItemAfter = function (item, insertAfter) {
        this.insertItemAt(item, this._items.indexOf(insertAfter) + 1);
    };
    Container.prototype.removeItem = function (item) {
        var itemIndex = this._items.indexOf(item);
        if (itemIndex >= 0) {
            this._items.splice(itemIndex, 1);
            item.setParent(null);
            this.updateLayout();
            return true;
        }
        return false;
    };
    Container.prototype.clear = function () {
        this._items = [];
    };
    Container.prototype.canContentBleed = function () {
        return this.hasBackground ? false : _super.prototype.canContentBleed.call(this);
    };
    Container.prototype.getAllInputs = function () {
        var result = [];
        for (var i = 0; i < this._items.length; i++) {
            var item = this._items[i];
            result = result.concat(item.getAllInputs());
        }
        return result;
    };
    Container.prototype.getResourceInformation = function () {
        var result = [];
        if (this.backgroundImage && !Utils.isNullOrEmpty(this.backgroundImage.url)) {
            result.push({ url: this.backgroundImage.url, mimeType: "image" });
        }
        for (var i = 0; i < this.getItemCount(); i++) {
            result = result.concat(this.getItemAt(i).getResourceInformation());
        }
        return result;
    };
    Container.prototype.getElementById = function (id) {
        var result = _super.prototype.getElementById.call(this, id);
        if (!result) {
            for (var i = 0; i < this._items.length; i++) {
                result = this._items[i].getElementById(id);
                if (result) {
                    break;
                }
            }
        }
        return result;
    };
    Container.prototype.getActionById = function (id) {
        var result = _super.prototype.getActionById.call(this, id);
        if (!result) {
            if (this.selectAction) {
                result = this.selectAction.getActionById(id);
            }
            if (!result) {
                for (var i = 0; i < this._items.length; i++) {
                    result = this._items[i].getActionById(id);
                    if (result) {
                        break;
                    }
                }
            }
        }
        return result;
    };
    Container.prototype.renderSpeech = function () {
        if (this.speak != null) {
            return this.speak;
        }
        // render each item
        var speak = null;
        if (this._items.length > 0) {
            speak = '';
            for (var i = 0; i < this._items.length; i++) {
                var result = this._items[i].renderSpeech();
                if (result) {
                    speak += result;
                }
            }
        }
        return speak;
    };
    Container.prototype.updateLayout = function (processChildren) {
        if (processChildren === void 0) { processChildren = true; }
        _super.prototype.updateLayout.call(this, processChildren);
        this.applyPadding();
        if (processChildren) {
            for (var i = 0; i < this._items.length; i++) {
                this._items[i].updateLayout();
            }
        }
    };
    Object.defineProperty(Container.prototype, "style", {
        get: function () {
            if (this.allowCustomStyle) {
                if (this._style && this.hostConfig.containerStyles.getStyleByName(this._style)) {
                    return this._style;
                }
                var parentContainer = this.getParentContainer();
                return parentContainer ? parentContainer.style : this.defaultStyle;
            }
            else {
                return this.defaultStyle;
            }
        },
        set: function (value) {
            this._style = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Container.prototype, "padding", {
        get: function () {
            return this.getPadding();
        },
        set: function (value) {
            this.setPadding(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Container.prototype, "selectAction", {
        get: function () {
            return this._selectAction;
        },
        set: function (value) {
            this._selectAction = value;
            if (this._selectAction) {
                this._selectAction.setParent(this);
            }
        },
        enumerable: true,
        configurable: true
    });
    return Container;
}(CardElementContainer));
exports.Container = Container;
var Column = /** @class */ (function (_super) {
    __extends(Column, _super);
    function Column(width) {
        if (width === void 0) { width = "auto"; }
        var _this = _super.call(this) || this;
        _this._computedWeight = 0;
        _this.width = "auto";
        _this.width = width;
        return _this;
    }
    Column.prototype.adjustRenderedElementSize = function (renderedElement) {
        if (this.isDesignMode()) {
            renderedElement.style.minWidth = "20px";
            renderedElement.style.minHeight = "20px";
        }
        else {
            renderedElement.style.minWidth = "0";
        }
        if (this.width === "auto") {
            renderedElement.style.flex = "0 1 auto";
        }
        else if (this.width === "stretch") {
            renderedElement.style.flex = "1 1 50px";
        }
        else {
            var sizeAndUnit = this.width;
            if (sizeAndUnit.unit == Enums.SizeUnit.Pixel) {
                renderedElement.style.flex = "0 0 " + sizeAndUnit.physicalSize + "px";
            }
            else {
                renderedElement.style.flex = "1 1 " + (this._computedWeight > 0 ? this._computedWeight : sizeAndUnit.physicalSize) + "%";
            }
        }
    };
    Object.defineProperty(Column.prototype, "separatorOrientation", {
        get: function () {
            return Enums.Orientation.Vertical;
        },
        enumerable: true,
        configurable: true
    });
    Column.prototype.getJsonTypeName = function () {
        return "Column";
    };
    Column.prototype.toJSON = function () {
        var result = _super.prototype.toJSON.call(this);
        if (this.width instanceof SizeAndUnit) {
            if (this.width.unit == Enums.SizeUnit.Pixel) {
                Utils.setProperty(result, "width", this.width.physicalSize + "px");
            }
            else {
                Utils.setProperty(result, "width", this.width.physicalSize);
            }
        }
        else {
            Utils.setProperty(result, "width", this.width);
        }
        return result;
    };
    Column.prototype.parse = function (json, errors) {
        _super.prototype.parse.call(this, json, errors);
        var jsonWidth = json["width"];
        if (jsonWidth === undefined) {
            jsonWidth = json["size"];
            if (jsonWidth !== undefined) {
                raiseParseError({
                    error: Enums.ValidationError.Deprecated,
                    message: "The \"Column.size\" property is deprecated and will be removed. Use the \"Column.width\" property instead."
                }, errors);
            }
        }
        var invalidWidth = false;
        if (typeof jsonWidth === "number") {
            if (jsonWidth > 0) {
                this.width = new Utils.SizeAndUnit(jsonWidth, Enums.SizeUnit.Weight);
            }
            else {
                invalidWidth = true;
            }
        }
        else if (typeof jsonWidth === "string") {
            if (jsonWidth != "auto" && jsonWidth != "stretch") {
                try {
                    this.width = Utils.SizeAndUnit.parse(jsonWidth);
                }
                catch (e) {
                    invalidWidth = true;
                }
            }
            else {
                this.width = jsonWidth;
            }
        }
        else if (jsonWidth) {
            invalidWidth = true;
        }
        if (invalidWidth) {
            raiseParseError({
                error: Enums.ValidationError.InvalidPropertyValue,
                message: "Invalid column width: " + jsonWidth
            }, errors);
        }
    };
    Object.defineProperty(Column.prototype, "hasVisibleSeparator", {
        get: function () {
            if (this.parent && this.parent instanceof ColumnSet) {
                return this.separatorElement && !this.parent.isLeftMostElement(this);
            }
            else {
                return false;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Column.prototype, "isStandalone", {
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    return Column;
}(Container));
exports.Column = Column;
var ColumnSet = /** @class */ (function (_super) {
    __extends(ColumnSet, _super);
    function ColumnSet() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._columns = [];
        return _this;
    }
    ColumnSet.prototype.applyPadding = function () {
        if (this.padding) {
            if (this.renderedElement) {
                var physicalPadding = this.padding.toSpacingDefinition(this.hostConfig);
                this.renderedElement.style.paddingTop = physicalPadding.top + "px";
                this.renderedElement.style.paddingRight = physicalPadding.right + "px";
                this.renderedElement.style.paddingBottom = physicalPadding.bottom + "px";
                this.renderedElement.style.paddingLeft = physicalPadding.left + "px";
            }
        }
    };
    ColumnSet.prototype.internalRender = function () {
        var _this = this;
        if (this._columns.length > 0) {
            // Cache hostConfig to avoid walking the parent hierarchy several times
            var hostConfig = this.hostConfig;
            var element = document.createElement("div");
            element.className = hostConfig.makeCssClassName("ac-columnSet");
            element.style.display = "flex";
            if (AdaptiveCard.useAdvancedCardBottomTruncation) {
                // See comment in Container.internalRender()
                element.style.minHeight = '-webkit-min-content';
            }
            if (this.selectAction && hostConfig.supportsInteractivity) {
                element.classList.add(hostConfig.makeCssClassName("ac-selectable"));
                element.onclick = function (e) {
                    _this.selectAction.execute();
                    e.cancelBubble = true;
                };
            }
            switch (this.horizontalAlignment) {
                case Enums.HorizontalAlignment.Center:
                    element.style.justifyContent = "center";
                    break;
                case Enums.HorizontalAlignment.Right:
                    element.style.justifyContent = "flex-end";
                    break;
                default:
                    element.style.justifyContent = "flex-start";
                    break;
            }
            var totalWeight = 0;
            for (var _i = 0, _a = this._columns; _i < _a.length; _i++) {
                var column = _a[_i];
                if (column.width instanceof Utils.SizeAndUnit && (column.width.unit == Enums.SizeUnit.Weight)) {
                    totalWeight += column.width.physicalSize;
                }
            }
            var renderedColumnCount = 0;
            for (var _b = 0, _c = this._columns; _b < _c.length; _b++) {
                var column = _c[_b];
                if (column.width instanceof Utils.SizeAndUnit && column.width.unit == Enums.SizeUnit.Weight && totalWeight > 0) {
                    var computedWeight = 100 / totalWeight * column.width.physicalSize;
                    // Best way to emulate "internal" access I know of
                    column["_computedWeight"] = computedWeight;
                }
                var renderedColumn = column.render();
                if (renderedColumn) {
                    if (renderedColumnCount > 0 && column.separatorElement) {
                        column.separatorElement.style.flex = "0 0 auto";
                        Utils.appendChild(element, column.separatorElement);
                    }
                    Utils.appendChild(element, renderedColumn);
                    renderedColumnCount++;
                }
            }
            return renderedColumnCount > 0 ? element : null;
        }
        else {
            return null;
        }
    };
    ColumnSet.prototype.truncateOverflow = function (maxHeight) {
        for (var _i = 0, _a = this._columns; _i < _a.length; _i++) {
            var column = _a[_i];
            column['handleOverflow'](maxHeight);
        }
        return true;
    };
    ColumnSet.prototype.undoOverflowTruncation = function () {
        for (var _i = 0, _a = this._columns; _i < _a.length; _i++) {
            var column = _a[_i];
            column['resetOverflow']();
        }
    };
    ColumnSet.prototype.toJSON = function () {
        var result = _super.prototype.toJSON.call(this);
        if (this._selectAction) {
            Utils.setProperty(result, "selectAction", this.selectAction.toJSON());
        }
        if (this._columns.length > 0) {
            var columns = [];
            for (var _i = 0, _a = this._columns; _i < _a.length; _i++) {
                var column = _a[_i];
                columns.push(column.toJSON());
            }
            Utils.setProperty(result, "columns", columns);
        }
        return result;
    };
    ColumnSet.prototype.isFirstElement = function (element) {
        for (var i = 0; i < this._columns.length; i++) {
            if (this._columns[i].isVisible) {
                return this._columns[i] == element;
            }
        }
        return false;
    };
    ColumnSet.prototype.getCount = function () {
        return this._columns.length;
    };
    ColumnSet.prototype.getItemCount = function () {
        return this.getCount();
    };
    ColumnSet.prototype.getColumnAt = function (index) {
        return this._columns[index];
    };
    ColumnSet.prototype.getItemAt = function (index) {
        return this.getColumnAt(index);
    };
    ColumnSet.prototype.getJsonTypeName = function () {
        return "ColumnSet";
    };
    ColumnSet.prototype.parse = function (json, errors) {
        _super.prototype.parse.call(this, json, errors);
        var selectActionJson = json["selectAction"];
        if (selectActionJson != undefined) {
            this.selectAction = createActionInstance(selectActionJson, errors);
            if (this.selectAction) {
                this.selectAction.setParent(this);
                this.selectAction.parse(selectActionJson);
            }
        }
        if (json["columns"] != null) {
            var jsonColumns = json["columns"];
            this._columns = [];
            for (var i = 0; i < jsonColumns.length; i++) {
                var column = new Column();
                column.parse(jsonColumns[i], errors);
                this.addColumn(column);
            }
        }
    };
    ColumnSet.prototype.validate = function () {
        var result = [];
        var weightedColumns = 0;
        var stretchedColumns = 0;
        for (var i = 0; i < this._columns.length; i++) {
            if (typeof this._columns[i].width === "number") {
                weightedColumns++;
            }
            else if (this._columns[i].width === "stretch") {
                stretchedColumns++;
            }
            result = result.concat(this._columns[i].validate());
        }
        if (weightedColumns > 0 && stretchedColumns > 0) {
            result.push({
                error: Enums.ValidationError.Hint,
                message: "It is not recommended to use weighted and stretched columns in the same ColumnSet, because in such a situation stretched columns will always get the minimum amount of space."
            });
        }
        return result;
    };
    ColumnSet.prototype.updateLayout = function (processChildren) {
        if (processChildren === void 0) { processChildren = true; }
        _super.prototype.updateLayout.call(this, processChildren);
        this.applyPadding();
        if (processChildren) {
            for (var i = 0; i < this._columns.length; i++) {
                this._columns[i].updateLayout();
            }
        }
    };
    ColumnSet.prototype.addColumn = function (column) {
        if (!column.parent) {
            this._columns.push(column);
            column.setParent(this);
        }
        else {
            throw new Error("This column already belongs to another ColumnSet.");
        }
    };
    ColumnSet.prototype.removeItem = function (item) {
        if (item instanceof Column) {
            var itemIndex = this._columns.indexOf(item);
            if (itemIndex >= 0) {
                this._columns.splice(itemIndex, 1);
                item.setParent(null);
                this.updateLayout();
                return true;
            }
        }
        return false;
    };
    ColumnSet.prototype.indexOf = function (cardElement) {
        return cardElement instanceof Column ? this._columns.indexOf(cardElement) : -1;
    };
    ColumnSet.prototype.isLeftMostElement = function (element) {
        return this._columns.indexOf(element) == 0;
    };
    ColumnSet.prototype.isRightMostElement = function (element) {
        return this._columns.indexOf(element) == this._columns.length - 1;
    };
    ColumnSet.prototype.getAllInputs = function () {
        var result = [];
        for (var i = 0; i < this._columns.length; i++) {
            result = result.concat(this._columns[i].getAllInputs());
        }
        return result;
    };
    ColumnSet.prototype.getResourceInformation = function () {
        var result = [];
        for (var i = 0; i < this._columns.length; i++) {
            result = result.concat(this._columns[i].getResourceInformation());
        }
        return result;
    };
    ColumnSet.prototype.getElementById = function (id) {
        var result = _super.prototype.getElementById.call(this, id);
        if (!result) {
            for (var i = 0; i < this._columns.length; i++) {
                result = this._columns[i].getElementById(id);
                if (result) {
                    break;
                }
            }
        }
        return result;
    };
    ColumnSet.prototype.getActionById = function (id) {
        var result = null;
        for (var i = 0; i < this._columns.length; i++) {
            result = this._columns[i].getActionById(id);
            if (result) {
                break;
            }
        }
        return result;
    };
    ColumnSet.prototype.renderSpeech = function () {
        if (this.speak != null) {
            return this.speak;
        }
        // render each item
        var speak = '';
        if (this._columns.length > 0) {
            for (var i = 0; i < this._columns.length; i++) {
                speak += this._columns[i].renderSpeech();
            }
        }
        return speak;
    };
    Object.defineProperty(ColumnSet.prototype, "padding", {
        get: function () {
            return this.getPadding();
        },
        set: function (value) {
            this.setPadding(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ColumnSet.prototype, "selectAction", {
        get: function () {
            return this._selectAction;
        },
        set: function (value) {
            this._selectAction = value;
            if (this._selectAction) {
                this._selectAction.setParent(this);
            }
        },
        enumerable: true,
        configurable: true
    });
    return ColumnSet;
}(CardElementContainer));
exports.ColumnSet = ColumnSet;
var Version = /** @class */ (function () {
    function Version(major, minor) {
        if (major === void 0) { major = 1; }
        if (minor === void 0) { minor = 1; }
        this._isValid = true;
        this._major = major;
        this._minor = minor;
    }
    Version.parse = function (versionString) {
        if (!versionString) {
            return null;
        }
        var result = new Version();
        result._versionString = versionString;
        var regEx = /(\d+).(\d+)/gi;
        var matches = regEx.exec(versionString);
        if (matches != null && matches.length == 3) {
            result._major = parseInt(matches[1]);
            result._minor = parseInt(matches[2]);
        }
        else {
            result._isValid = false;
        }
        return result;
    };
    Version.prototype.toString = function () {
        return !this._isValid ? this._versionString : this._major + "." + this._minor;
    };
    Object.defineProperty(Version.prototype, "major", {
        get: function () {
            return this._major;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Version.prototype, "minor", {
        get: function () {
            return this._minor;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Version.prototype, "isValid", {
        get: function () {
            return this._isValid;
        },
        enumerable: true,
        configurable: true
    });
    return Version;
}());
exports.Version = Version;
function raiseImageLoadedEvent(image) {
    var card = image.getRootElement();
    var onImageLoadedHandler = (card && card.onImageLoaded) ? card.onImageLoaded : AdaptiveCard.onImageLoaded;
    if (onImageLoadedHandler) {
        onImageLoadedHandler(image);
    }
}
function raiseAnchorClickedEvent(element, anchor) {
    var card = element.getRootElement();
    var onAnchorClickedHandler = (card && card.onAnchorClicked) ? card.onAnchorClicked : AdaptiveCard.onAnchorClicked;
    return onAnchorClickedHandler != null ? onAnchorClickedHandler(element, anchor) : false;
}
function raiseExecuteActionEvent(action) {
    var card = action.parent.getRootElement();
    var onExecuteActionHandler = (card && card.onExecuteAction) ? card.onExecuteAction : AdaptiveCard.onExecuteAction;
    if (onExecuteActionHandler) {
        action.prepare(action.parent.getRootElement().getAllInputs());
        onExecuteActionHandler(action);
    }
}
function raiseInlineCardExpandedEvent(action, isExpanded) {
    var card = action.parent.getRootElement();
    var onInlineCardExpandedHandler = (card && card.onInlineCardExpanded) ? card.onInlineCardExpanded : AdaptiveCard.onInlineCardExpanded;
    if (onInlineCardExpandedHandler) {
        onInlineCardExpandedHandler(action, isExpanded);
    }
}
function raiseElementVisibilityChangedEvent(element, shouldUpdateLayout) {
    if (shouldUpdateLayout === void 0) { shouldUpdateLayout = true; }
    var rootElement = element.getRootElement();
    if (shouldUpdateLayout) {
        rootElement.updateLayout();
    }
    var card = rootElement;
    var onElementVisibilityChangedHandler = (card && card.onElementVisibilityChanged) ? card.onElementVisibilityChanged : AdaptiveCard.onElementVisibilityChanged;
    if (onElementVisibilityChangedHandler != null) {
        onElementVisibilityChangedHandler(element);
    }
}
function raiseParseElementEvent(element, json, errors) {
    var card = element.getRootElement();
    var onParseElementHandler = (card && card.onParseElement) ? card.onParseElement : AdaptiveCard.onParseElement;
    if (onParseElementHandler != null) {
        onParseElementHandler(element, json, errors);
    }
}
function raiseParseActionEvent(action, json, errors) {
    var card = action.parent ? action.parent.getRootElement() : null;
    var onParseActionHandler = (card && card.onParseAction) ? card.onParseAction : AdaptiveCard.onParseAction;
    if (onParseActionHandler != null) {
        onParseActionHandler(action, json, errors);
    }
}
function raiseParseError(error, errors) {
    if (errors) {
        errors.push(error);
    }
    if (AdaptiveCard.onParseError != null) {
        AdaptiveCard.onParseError(error);
    }
}
var ContainerWithActions = /** @class */ (function (_super) {
    __extends(ContainerWithActions, _super);
    function ContainerWithActions() {
        var _this = _super.call(this) || this;
        _this._actionCollection = new ActionCollection(_this);
        return _this;
    }
    ContainerWithActions.prototype.internalRender = function () {
        var element = _super.prototype.internalRender.call(this);
        var renderedActions = this._actionCollection.render(this.hostConfig.actions.actionsOrientation, false);
        if (renderedActions) {
            Utils.appendChild(element, Utils.renderSeparation({
                spacing: this.hostConfig.getEffectiveSpacing(this.hostConfig.actions.spacing),
                lineThickness: null,
                lineColor: null
            }, Enums.Orientation.Horizontal));
            Utils.appendChild(element, renderedActions);
        }
        return element.children.length > 0 ? element : null;
    };
    ContainerWithActions.prototype.isLastElementBleeding = function () {
        if (this._actionCollection.renderedActionCount == 0) {
            return _super.prototype.isLastElementBleeding.call(this) ? !this.isDesignMode() : false;
        }
        else {
            if (this._actionCollection.items.length == 1) {
                return this._actionCollection.expandedAction != null && !this.hostConfig.actions.preExpandSingleShowCardAction;
            }
            else {
                return this._actionCollection.expandedAction != null;
            }
        }
    };
    ContainerWithActions.prototype.toJSON = function () {
        var result = _super.prototype.toJSON.call(this);
        Utils.setProperty(result, "actions", this._actionCollection.toJSON());
        return result;
    };
    ContainerWithActions.prototype.getActionCount = function () {
        return this._actionCollection.items.length;
    };
    ContainerWithActions.prototype.getActionAt = function (index) {
        if (index >= 0 && index < this.getActionCount()) {
            return this._actionCollection.items[index];
        }
        else {
            _super.prototype.getActionAt.call(this, index);
        }
    };
    ContainerWithActions.prototype.getActionById = function (id) {
        var result = this._actionCollection.getActionById(id);
        return result ? result : _super.prototype.getActionById.call(this, id);
    };
    ContainerWithActions.prototype.parse = function (json, errors) {
        _super.prototype.parse.call(this, json, errors);
        this._actionCollection.clear();
        if (json["actions"] != undefined) {
            var jsonActions = json["actions"];
            for (var i = 0; i < jsonActions.length; i++) {
                var action = createActionInstance(jsonActions[i], errors);
                if (action != null) {
                    action.setParent(this);
                    action.parse(jsonActions[i]);
                    this.addAction(action);
                }
            }
        }
    };
    ContainerWithActions.prototype.validate = function () {
        var result = _super.prototype.validate.call(this);
        if (this._actionCollection) {
            result = result.concat(this._actionCollection.validate());
        }
        return result;
    };
    ContainerWithActions.prototype.isLastElement = function (element) {
        return _super.prototype.isLastElement.call(this, element) && this._actionCollection.items.length == 0;
    };
    ContainerWithActions.prototype.addAction = function (action) {
        if (action) {
            this._actionCollection.addAction(action);
        }
    };
    ContainerWithActions.prototype.clear = function () {
        _super.prototype.clear.call(this);
        this._actionCollection.clear();
    };
    ContainerWithActions.prototype.getAllInputs = function () {
        return _super.prototype.getAllInputs.call(this).concat(this._actionCollection.getAllInputs());
    };
    ContainerWithActions.prototype.getResourceInformation = function () {
        return _super.prototype.getResourceInformation.call(this).concat(this._actionCollection.getResourceInformation());
    };
    Object.defineProperty(ContainerWithActions.prototype, "isStandalone", {
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    return ContainerWithActions;
}(Container));
exports.ContainerWithActions = ContainerWithActions;
var TypeRegistry = /** @class */ (function () {
    function TypeRegistry() {
        this._items = [];
        this.reset();
    }
    TypeRegistry.prototype.findTypeRegistration = function (typeName) {
        for (var i = 0; i < this._items.length; i++) {
            if (this._items[i].typeName === typeName) {
                return this._items[i];
            }
        }
        return null;
    };
    TypeRegistry.prototype.clear = function () {
        this._items = [];
    };
    TypeRegistry.prototype.registerType = function (typeName, createInstance) {
        var registrationInfo = this.findTypeRegistration(typeName);
        if (registrationInfo != null) {
            registrationInfo.createInstance = createInstance;
        }
        else {
            registrationInfo = {
                typeName: typeName,
                createInstance: createInstance
            };
            this._items.push(registrationInfo);
        }
    };
    TypeRegistry.prototype.unregisterType = function (typeName) {
        for (var i = 0; i < this._items.length; i++) {
            if (this._items[i].typeName === typeName) {
                this._items.splice(i, 1);
                return;
            }
        }
    };
    TypeRegistry.prototype.createInstance = function (typeName) {
        var registrationInfo = this.findTypeRegistration(typeName);
        return registrationInfo ? registrationInfo.createInstance() : null;
    };
    TypeRegistry.prototype.getItemCount = function () {
        return this._items.length;
    };
    TypeRegistry.prototype.getItemAt = function (index) {
        return this._items[index];
    };
    return TypeRegistry;
}());
exports.TypeRegistry = TypeRegistry;
var ElementTypeRegistry = /** @class */ (function (_super) {
    __extends(ElementTypeRegistry, _super);
    function ElementTypeRegistry() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ElementTypeRegistry.prototype.reset = function () {
        this.clear();
        this.registerType("Container", function () { return new Container(); });
        this.registerType("TextBlock", function () { return new TextBlock(); });
        this.registerType("Image", function () { return new Image(); });
        this.registerType("ImageSet", function () { return new ImageSet(); });
        this.registerType("Media", function () { return new Media(); });
        this.registerType("FactSet", function () { return new FactSet(); });
        this.registerType("ColumnSet", function () { return new ColumnSet(); });
        this.registerType("Input.Text", function () { return new TextInput(); });
        this.registerType("Input.Date", function () { return new DateInput(); });
        this.registerType("Input.Time", function () { return new TimeInput(); });
        this.registerType("Input.Number", function () { return new NumberInput(); });
        this.registerType("Input.ChoiceSet", function () { return new ChoiceSetInput(); });
        this.registerType("Input.Toggle", function () { return new ToggleInput(); });
    };
    return ElementTypeRegistry;
}(TypeRegistry));
exports.ElementTypeRegistry = ElementTypeRegistry;
var ActionTypeRegistry = /** @class */ (function (_super) {
    __extends(ActionTypeRegistry, _super);
    function ActionTypeRegistry() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ActionTypeRegistry.prototype.reset = function () {
        this.clear();
        this.registerType("Action.OpenUrl", function () { return new OpenUrlAction(); });
        this.registerType("Action.Submit", function () { return new SubmitAction(); });
        this.registerType("Action.ShowCard", function () { return new ShowCardAction(); });
    };
    return ActionTypeRegistry;
}(TypeRegistry));
exports.ActionTypeRegistry = ActionTypeRegistry;
var AdaptiveCard = /** @class */ (function (_super) {
    __extends(AdaptiveCard, _super);
    function AdaptiveCard() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._cardTypeName = "AdaptiveCard";
        _this.onAnchorClicked = null;
        _this.onExecuteAction = null;
        _this.onElementVisibilityChanged = null;
        _this.onImageLoaded = null;
        _this.onInlineCardExpanded = null;
        _this.onParseElement = null;
        _this.onParseAction = null;
        _this.version = new Version(1, 0);
        _this.designMode = false;
        return _this;
    }
    AdaptiveCard.prototype.isVersionSupported = function () {
        if (this.bypassVersionCheck) {
            return true;
        }
        else {
            var unsupportedVersion = !this.version ||
                (AdaptiveCard.currentVersion.major < this.version.major) ||
                (AdaptiveCard.currentVersion.major == this.version.major && AdaptiveCard.currentVersion.minor < this.version.minor);
            return !unsupportedVersion;
        }
    };
    AdaptiveCard.prototype.getItemsCollectionPropertyName = function () {
        return "body";
    };
    AdaptiveCard.prototype.applyPadding = function () {
        if (!this.renderedElement) {
            return;
        }
        var effectivePadding = this.padding ? this.padding.toSpacingDefinition(this.hostConfig) : this.internalPadding.toSpacingDefinition(this.hostConfig);
        this.renderedElement.style.paddingTop = effectivePadding.top + "px";
        this.renderedElement.style.paddingRight = effectivePadding.right + "px";
        this.renderedElement.style.paddingBottom = effectivePadding.bottom + "px";
        this.renderedElement.style.paddingLeft = effectivePadding.left + "px";
        if (this.isLastElementBleeding()) {
            this.renderedElement.style.paddingBottom = "0px";
        }
    };
    AdaptiveCard.prototype.internalRender = function () {
        var renderedElement = _super.prototype.internalRender.call(this);
        if (AdaptiveCard.useAdvancedCardBottomTruncation) {
            // Unlike containers, the root card element should be allowed to
            // be shorter than its content (otherwise the overflow truncation
            // logic would never get triggered)
            renderedElement.style.minHeight = null;
        }
        return renderedElement;
    };
    Object.defineProperty(AdaptiveCard.prototype, "bypassVersionCheck", {
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdaptiveCard.prototype, "defaultPadding", {
        get: function () {
            return new PaddingDefinition(Enums.Spacing.Padding, Enums.Spacing.Padding, Enums.Spacing.Padding, Enums.Spacing.Padding);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdaptiveCard.prototype, "allowCustomPadding", {
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdaptiveCard.prototype, "allowCustomStyle", {
        get: function () {
            return this.hostConfig.adaptiveCard && this.hostConfig.adaptiveCard.allowCustomStyle;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdaptiveCard.prototype, "hasBackground", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    AdaptiveCard.prototype.getJsonTypeName = function () {
        return "AdaptiveCard";
    };
    AdaptiveCard.prototype.toJSON = function () {
        var result = _super.prototype.toJSON.call(this);
        Utils.setProperty(result, "$schema", "http://adaptivecards.io/schemas/adaptive-card.json");
        if (!this.bypassVersionCheck && this.version) {
            Utils.setProperty(result, "version", this.version.toString());
        }
        Utils.setProperty(result, "fallbackText", this.fallbackText);
        Utils.setProperty(result, "lang", this.lang);
        Utils.setProperty(result, "speak", this.speak);
        return result;
    };
    AdaptiveCard.prototype.validate = function () {
        var result = [];
        if (this._cardTypeName != "AdaptiveCard") {
            result.push({
                error: Enums.ValidationError.MissingCardType,
                message: "Invalid or missing card type. Make sure the card's type property is set to \"AdaptiveCard\"."
            });
        }
        if (!this.bypassVersionCheck && (!this.version || !this.version.isValid)) {
            result.push({
                error: Enums.ValidationError.PropertyCantBeNull,
                message: !this.version ? "The version property must be specified." : "Invalid version: " + this.version
            });
        }
        else if (!this.isVersionSupported()) {
            result.push({
                error: Enums.ValidationError.UnsupportedCardVersion,
                message: "The specified card version (" + this.version + ") is not supported. The maximum supported card version is " + AdaptiveCard.currentVersion
            });
        }
        return result.concat(_super.prototype.validate.call(this));
    };
    AdaptiveCard.prototype.parse = function (json, errors) {
        this._cardTypeName = json["type"];
        var langId = json["lang"];
        if (langId && typeof langId === "string") {
            try {
                this.lang = langId;
            }
            catch (e) {
                raiseParseError({
                    error: Enums.ValidationError.InvalidPropertyValue,
                    message: e.message
                }, errors);
            }
        }
        this.version = Version.parse(json["version"]);
        this.fallbackText = json["fallbackText"];
        _super.prototype.parse.call(this, json, errors);
    };
    AdaptiveCard.prototype.render = function (target) {
        var renderedCard;
        if (!this.isVersionSupported()) {
            renderedCard = document.createElement("div");
            renderedCard.innerHTML = this.fallbackText ? this.fallbackText : "The specified card version is not supported.";
        }
        else {
            renderedCard = _super.prototype.render.call(this);
            if (renderedCard) {
                renderedCard.tabIndex = 0;
                if (!Utils.isNullOrEmpty(this.speak)) {
                    renderedCard.setAttribute("aria-label", this.speak);
                }
            }
        }
        if (target) {
            target.appendChild(renderedCard);
            this.updateLayout();
        }
        return renderedCard;
    };
    AdaptiveCard.prototype.updateLayout = function (processChildren) {
        if (processChildren === void 0) { processChildren = true; }
        _super.prototype.updateLayout.call(this, processChildren);
        if (AdaptiveCard.useAdvancedCardBottomTruncation && this.isRendered()) {
            var card = this.renderedElement;
            var padding = this.hostConfig.getEffectiveSpacing(Enums.Spacing.Default);
            this['handleOverflow'](card.offsetHeight - padding);
        }
    };
    AdaptiveCard.prototype.canContentBleed = function () {
        return true;
    };
    Object.defineProperty(AdaptiveCard.prototype, "hasVisibleSeparator", {
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    AdaptiveCard.currentVersion = new Version(1, 1);
    AdaptiveCard.useAutomaticContainerBleeding = false;
    AdaptiveCard.useAdvancedTextBlockTruncation = true;
    AdaptiveCard.useAdvancedCardBottomTruncation = false;
    AdaptiveCard.useMarkdownInRadioButtonAndCheckbox = true;
    AdaptiveCard.elementTypeRegistry = new ElementTypeRegistry();
    AdaptiveCard.actionTypeRegistry = new ActionTypeRegistry();
    AdaptiveCard.onAnchorClicked = null;
    AdaptiveCard.onExecuteAction = null;
    AdaptiveCard.onElementVisibilityChanged = null;
    AdaptiveCard.onImageLoaded = null;
    AdaptiveCard.onInlineCardExpanded = null;
    AdaptiveCard.onParseElement = null;
    AdaptiveCard.onParseAction = null;
    AdaptiveCard.onParseError = null;
    AdaptiveCard.processMarkdown = function (text) {
        // Check for markdownit
        if (window["markdownit"]) {
            return window["markdownit"]().render(text);
        }
        return text;
    };
    return AdaptiveCard;
}(ContainerWithActions));
exports.AdaptiveCard = AdaptiveCard;
var InlineAdaptiveCard = /** @class */ (function (_super) {
    __extends(InlineAdaptiveCard, _super);
    function InlineAdaptiveCard() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.suppressStyle = false;
        return _this;
    }
    Object.defineProperty(InlineAdaptiveCard.prototype, "bypassVersionCheck", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InlineAdaptiveCard.prototype, "defaultPadding", {
        get: function () {
            return new PaddingDefinition(this.suppressStyle ? Enums.Spacing.None : Enums.Spacing.Padding, Enums.Spacing.Padding, this.suppressStyle ? Enums.Spacing.None : Enums.Spacing.Padding, Enums.Spacing.Padding);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InlineAdaptiveCard.prototype, "defaultStyle", {
        get: function () {
            if (this.suppressStyle) {
                return Enums.ContainerStyle.Default;
            }
            else {
                return this.hostConfig.actions.showCard.style ? this.hostConfig.actions.showCard.style : Enums.ContainerStyle.Emphasis;
            }
        },
        enumerable: true,
        configurable: true
    });
    InlineAdaptiveCard.prototype.render = function (target) {
        var renderedCard = _super.prototype.render.call(this, target);
        renderedCard.setAttribute("aria-live", "polite");
        renderedCard.removeAttribute("tabindex");
        return renderedCard;
    };
    InlineAdaptiveCard.prototype.getForbiddenActionTypes = function () {
        return [ShowCardAction];
    };
    return InlineAdaptiveCard;
}(AdaptiveCard));
var defaultHostConfig = new HostConfig.HostConfig({
    supportsInteractivity: true,
    fontFamily: "Segoe UI",
    spacing: {
        small: 10,
        default: 20,
        medium: 30,
        large: 40,
        extraLarge: 50,
        padding: 20
    },
    separator: {
        lineThickness: 1,
        lineColor: "#EEEEEE"
    },
    fontSizes: {
        small: 12,
        default: 14,
        medium: 17,
        large: 21,
        extraLarge: 26
    },
    fontWeights: {
        lighter: 200,
        default: 400,
        bolder: 600
    },
    imageSizes: {
        small: 40,
        medium: 80,
        large: 160
    },
    containerStyles: {
        default: {
            backgroundColor: "#FFFFFF",
            foregroundColors: {
                default: {
                    default: "#333333",
                    subtle: "#EE333333"
                },
                dark: {
                    default: "#000000",
                    subtle: "#66000000"
                },
                light: {
                    default: "#FFFFFF",
                    subtle: "#33000000"
                },
                accent: {
                    default: "#2E89FC",
                    subtle: "#882E89FC"
                },
                attention: {
                    default: "#cc3300",
                    subtle: "#DDcc3300"
                },
                good: {
                    default: "#54a254",
                    subtle: "#DD54a254"
                },
                warning: {
                    default: "#e69500",
                    subtle: "#DDe69500"
                }
            }
        },
        emphasis: {
            backgroundColor: "#08000000",
            foregroundColors: {
                default: {
                    default: "#333333",
                    subtle: "#EE333333"
                },
                dark: {
                    default: "#000000",
                    subtle: "#66000000"
                },
                light: {
                    default: "#FFFFFF",
                    subtle: "#33000000"
                },
                accent: {
                    default: "#2E89FC",
                    subtle: "#882E89FC"
                },
                attention: {
                    default: "#cc3300",
                    subtle: "#DDcc3300"
                },
                good: {
                    default: "#54a254",
                    subtle: "#DD54a254"
                },
                warning: {
                    default: "#e69500",
                    subtle: "#DDe69500"
                }
            }
        }
    },
    actions: {
        maxActions: 5,
        spacing: Enums.Spacing.Default,
        buttonSpacing: 10,
        showCard: {
            actionMode: Enums.ShowCardActionMode.Inline,
            inlineTopMargin: 16
        },
        actionsOrientation: Enums.Orientation.Horizontal,
        actionAlignment: Enums.ActionAlignment.Left
    },
    adaptiveCard: {
        allowCustomStyle: false
    },
    imageSet: {
        imageSize: Enums.Size.Medium,
        maxImageHeight: 100
    },
    factSet: {
        title: {
            color: Enums.TextColor.Default,
            size: Enums.TextSize.Default,
            isSubtle: false,
            weight: Enums.TextWeight.Bolder,
            wrap: true,
            maxWidth: 150,
        },
        value: {
            color: Enums.TextColor.Default,
            size: Enums.TextSize.Default,
            isSubtle: false,
            weight: Enums.TextWeight.Default,
            wrap: true,
        },
        spacing: 10
    }
});


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var AbstractTextFormatter = /** @class */ (function () {
    function AbstractTextFormatter(regularExpression) {
        this._regularExpression = regularExpression;
    }
    AbstractTextFormatter.prototype.format = function (lang, input) {
        var matches;
        var result = input;
        while ((matches = this._regularExpression.exec(input)) != null) {
            result = result.replace(matches[0], this.internalFormat(lang, matches));
        }
        ;
        return result;
    };
    return AbstractTextFormatter;
}());
var DateFormatter = /** @class */ (function (_super) {
    __extends(DateFormatter, _super);
    function DateFormatter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DateFormatter.prototype.internalFormat = function (lang, matches) {
        var date = new Date(Date.parse(matches[1]));
        var format = matches[2] != undefined ? matches[2].toLowerCase() : "compact";
        if (format != "compact") {
            return date.toLocaleDateString(lang, { day: "numeric", weekday: format, month: format, year: "numeric" });
        }
        else {
            return date.toLocaleDateString();
        }
    };
    return DateFormatter;
}(AbstractTextFormatter));
var TimeFormatter = /** @class */ (function (_super) {
    __extends(TimeFormatter, _super);
    function TimeFormatter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TimeFormatter.prototype.internalFormat = function (lang, matches) {
        var date = new Date(Date.parse(matches[1]));
        return date.toLocaleTimeString(lang, { hour: 'numeric', minute: '2-digit' });
    };
    return TimeFormatter;
}(AbstractTextFormatter));
function formatText(lang, text) {
    var formatters = [
        new DateFormatter(/\{{2}DATE\((\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:Z|(?:(?:-|\+)\d{2}:\d{2})))(?:, ?(COMPACT|LONG|SHORT))?\)\}{2}/g),
        new TimeFormatter(/\{{2}TIME\((\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:Z|(?:(?:-|\+)\d{2}:\d{2})))\)\}{2}/g)
    ];
    var result = text;
    for (var i = 0; i < formatters.length; i++) {
        result = formatters[i].format(lang, result);
    }
    return result;
}
exports.formatText = formatText;


/***/ })
/******/ ]);
//# sourceMappingURL=adaptivecards.js.map
!function(t,n){"object"==typeof exports&&"undefined"!=typeof module?module.exports=n():"function"==typeof define&&define.amd?define(n):t.Macy=n()}(this,function(){"use strict";function t(t,n){var e=void 0;return function(){e&&clearTimeout(e),e=setTimeout(t,n)}}function n(t,n){for(var e=t.length,o=e,r=[];e--;)r.push(n(t[o-e-1]));return r}function e(t,n){A(t,n,arguments.length>2&&void 0!==arguments[2]&&arguments[2])}function o(t){for(var n=t.options,e=t.responsiveOptions,o=t.keys,r=t.docWidth,i=void 0,s=0;s<o.length;s++){var a=parseInt(o[s],10);r>=a&&(i=n.breakAt[a],O(i,e))}return e}function r(t){for(var n=t.options,e=t.responsiveOptions,o=t.keys,r=t.docWidth,i=void 0,s=o.length-1;s>=0;s--){var a=parseInt(o[s],10);r<=a&&(i=n.breakAt[a],O(i,e))}return e}function i(t){var n=document.body.clientWidth,e={columns:t.columns};L(t.margin)?e.margin={x:t.margin.x,y:t.margin.y}:e.margin={x:t.margin,y:t.margin};var i=Object.keys(t.breakAt);return t.mobileFirst?o({options:t,responsiveOptions:e,keys:i,docWidth:n}):r({options:t,responsiveOptions:e,keys:i,docWidth:n})}function s(t){return i(t).columns}function a(t){return i(t).margin}function c(t){var n=!(arguments.length>1&&void 0!==arguments[1])||arguments[1],e=s(t),o=a(t).x,r=100/e;return n?1===e?"100%":(o=(e-1)*o/e,"calc("+r+"% - "+o+"px)"):r}function u(t,n){var e=s(t.options),o=0,r=void 0,i=void 0;return 1===++n?0:(i=a(t.options).x,r=(i-(e-1)*i/e)*(n-1),o+=c(t.options,!1)*(n-1),"calc("+o+"% + "+r+"px)")}function l(t){var n=0,e=t.container;m(t.rows,function(t){n=t>n?t:n}),e.style.height=n+"px"}function p(t,n){var e=arguments.length>2&&void 0!==arguments[2]&&arguments[2],o=!(arguments.length>3&&void 0!==arguments[3])||arguments[3],r=s(t.options),i=a(t.options).y;C(t,r,e),m(n,function(n){var e=0,r=parseInt(n.offsetHeight,10);isNaN(r)||(t.rows.forEach(function(n,o){n<t.rows[e]&&(e=o)}),n.style.position="absolute",n.style.top=t.rows[e]+"px",n.style.left=""+t.cols[e],t.rows[e]+=isNaN(r)?0:r+i,o&&(n.dataset.macyComplete=1))}),o&&(t.tmpRows=null),l(t)}function h(t,n){var e=arguments.length>2&&void 0!==arguments[2]&&arguments[2],o=!(arguments.length>3&&void 0!==arguments[3])||arguments[3],r=s(t.options),i=a(t.options).y;C(t,r,e),m(n,function(n){t.lastcol===r&&(t.lastcol=0);var e=M(n,"height");e=parseInt(n.offsetHeight,10),isNaN(e)||(n.style.position="absolute",n.style.top=t.rows[t.lastcol]+"px",n.style.left=""+t.cols[t.lastcol],t.rows[t.lastcol]+=isNaN(e)?0:e+i,t.lastcol+=1,o&&(n.dataset.macyComplete=1))}),o&&(t.tmpRows=null),l(t)}var f=function t(n,e){if(!(this instanceof t))return new t(n,e);if(n=n.replace(/^\s*/,"").replace(/\s*$/,""),e)return this.byCss(n,e);for(var o in this.selectors)if(e=o.split("/"),new RegExp(e[1],e[2]).test(n))return this.selectors[o](n);return this.byCss(n)};f.prototype.byCss=function(t,n){return(n||document).querySelectorAll(t)},f.prototype.selectors={},f.prototype.selectors[/^\.[\w\-]+$/]=function(t){return document.getElementsByClassName(t.substring(1))},f.prototype.selectors[/^\w+$/]=function(t){return document.getElementsByTagName(t)},f.prototype.selectors[/^\#[\w\-]+$/]=function(t){return document.getElementById(t.substring(1))};var m=function(t,n){for(var e=t.length,o=e;e--;)n(t[o-e-1])},v=function(){var t=arguments.length>0&&void 0!==arguments[0]&&arguments[0];this.running=!1,this.events=[],this.add(t)};v.prototype.run=function(){if(!this.running&&this.events.length>0){var t=this.events.shift();this.running=!0,t(),this.running=!1,this.run()}},v.prototype.add=function(){var t=this,n=arguments.length>0&&void 0!==arguments[0]&&arguments[0];return!!n&&(Array.isArray(n)?m(n,function(n){return t.add(n)}):(this.events.push(n),void this.run()))},v.prototype.clear=function(){this.events=[]};var d=function(t){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return this.instance=t,this.data=n,this},g=function(){var t=arguments.length>0&&void 0!==arguments[0]&&arguments[0];this.events={},this.instance=t};g.prototype.on=function(){var t=arguments.length>0&&void 0!==arguments[0]&&arguments[0],n=arguments.length>1&&void 0!==arguments[1]&&arguments[1];return!(!t||!n)&&(Array.isArray(this.events[t])||(this.events[t]=[]),this.events[t].push(n))},g.prototype.emit=function(){var t=arguments.length>0&&void 0!==arguments[0]&&arguments[0],n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};if(!t||!Array.isArray(this.events[t]))return!1;var e=new d(this.instance,n);m(this.events[t],function(t){return t(e)})};var y=function(t){return!("naturalHeight"in t&&t.naturalHeight+t.naturalWidth===0)||t.width+t.height!==0},E=function(t,n){var e=arguments.length>2&&void 0!==arguments[2]&&arguments[2];return new Promise(function(t,e){if(n.complete)return y(n)?t(n):e(n);n.addEventListener("load",function(){return y(n)?t(n):e(n)}),n.addEventListener("error",function(){return e(n)})}).then(function(n){e&&t.emit(t.constants.EVENT_IMAGE_LOAD,{img:n})}).catch(function(n){return t.emit(t.constants.EVENT_IMAGE_ERROR,{img:n})})},w=function(t,e){var o=arguments.length>2&&void 0!==arguments[2]&&arguments[2];return n(e,function(n){return E(t,n,o)})},A=function(t,n){var e=arguments.length>2&&void 0!==arguments[2]&&arguments[2];return Promise.all(w(t,n,e)).then(function(){t.emit(t.constants.EVENT_IMAGE_COMPLETE)})},I=function(n){return t(function(){n.emit(n.constants.EVENT_RESIZE),n.queue.add(function(){return n.recalculate(!0,!0)})},100)},N=function(t){if(t.container=f(t.options.container),t.container instanceof f||!t.container)return!!t.options.debug&&console.error("Error: Container not found");delete t.options.container,t.container.length&&(t.container=t.container[0]),t.container.style.position="relative"},T=function(t){t.queue=new v,t.events=new g(t),t.rows=[],t.resizer=I(t)},b=function(t){var n=f("img",t.container);window.addEventListener("resize",t.resizer),t.on(t.constants.EVENT_IMAGE_LOAD,function(){return t.recalculate(!1,!1)}),t.on(t.constants.EVENT_IMAGE_COMPLETE,function(){return t.recalculate(!0,!0)}),t.options.useOwnImageLoader||e(t,n,!t.options.waitForImages),t.emit(t.constants.EVENT_INITIALIZED)},_=function(t){N(t),T(t),b(t)},L=function(t){return t===Object(t)&&"[object Array]"!==Object.prototype.toString.call(t)},O=function(t,n){L(t)||(n.columns=t),L(t)&&t.columns&&(n.columns=t.columns),L(t)&&t.margin&&!L(t.margin)&&(n.margin={x:t.margin,y:t.margin}),L(t)&&t.margin&&L(t.margin)&&t.margin.x&&(n.margin.x=t.margin.x),L(t)&&t.margin&&L(t.margin)&&t.margin.y&&(n.margin.y=t.margin.y)},M=function(t,n){return window.getComputedStyle(t,null).getPropertyValue(n)},C=function(t,n){var e=arguments.length>2&&void 0!==arguments[2]&&arguments[2];if(t.lastcol||(t.lastcol=0),t.rows.length<1&&(e=!0),e){t.rows=[],t.cols=[],t.lastcol=0;for(var o=n-1;o>=0;o--)t.rows[o]=0,t.cols[o]=u(t,o)}else if(t.tmpRows){t.rows=[];for(var o=n-1;o>=0;o--)t.rows[o]=t.tmpRows[o]}else{t.tmpRows=[];for(var o=n-1;o>=0;o--)t.tmpRows[o]=t.rows[o]}},V=function(t){var n=arguments.length>1&&void 0!==arguments[1]&&arguments[1],e=!(arguments.length>2&&void 0!==arguments[2])||arguments[2],o=n?t.container.children:f(':scope > *:not([data-macy-complete="1"])',t.container),r=c(t.options);return m(o,function(t){n&&(t.dataset.macyComplete=0),t.style.width=r}),t.options.trueOrder?(h(t,o,n,e),t.emit(t.constants.EVENT_RECALCULATED)):(p(t,o,n,e),t.emit(t.constants.EVENT_RECALCULATED))},R=Object.assign||function(t){for(var n=1;n<arguments.length;n++){var e=arguments[n];for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&(t[o]=e[o])}return t},x={columns:4,margin:2,trueOrder:!1,waitForImages:!1,useImageLoader:!0,breakAt:{},useOwnImageLoader:!1,onInit:!1};!function(){try{document.createElement("a").querySelector(":scope *")}catch(t){!function(){function t(t){return function(e){if(e&&n.test(e)){var o=this.getAttribute("id");o||(this.id="q"+Math.floor(9e6*Math.random())+1e6),arguments[0]=e.replace(n,"#"+this.id);var r=t.apply(this,arguments);return null===o?this.removeAttribute("id"):o||(this.id=o),r}return t.apply(this,arguments)}}var n=/:scope\b/gi,e=t(Element.prototype.querySelector);Element.prototype.querySelector=function(t){return e.apply(this,arguments)};var o=t(Element.prototype.querySelectorAll);Element.prototype.querySelectorAll=function(t){return o.apply(this,arguments)}}()}}();var q=function t(){var n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:x;if(!(this instanceof t))return new t(n);this.options={},R(this.options,x,n),_(this)};return q.init=function(t){return console.warn("Depreciated: Macy.init will be removed in v3.0.0 opt to use Macy directly like so Macy({ /*options here*/ }) "),new q(t)},q.prototype.recalculateOnImageLoad=function(){var t=arguments.length>0&&void 0!==arguments[0]&&arguments[0];return e(this,f("img",this.container),!t)},q.prototype.runOnImageLoad=function(t){var n=arguments.length>1&&void 0!==arguments[1]&&arguments[1],o=f("img",this.container);return this.on(this.constants.EVENT_IMAGE_COMPLETE,t),n&&this.on(this.constants.EVENT_IMAGE_LOAD,t),e(this,o,n)},q.prototype.recalculate=function(){var t=this,n=arguments.length>0&&void 0!==arguments[0]&&arguments[0],e=!(arguments.length>1&&void 0!==arguments[1])||arguments[1];return e&&this.queue.clear(),this.queue.add(function(){return V(t,n,e)})},q.prototype.remove=function(){window.removeEventListener("resize",this.resizer),m(this.container.children,function(t){t.removeAttribute("data-macy-complete"),t.removeAttribute("style")}),this.container.removeAttribute("style")},q.prototype.reInit=function(){this.recalculate(!0,!0),this.emit(this.constants.EVENT_INITIALIZED),window.addEventListener("resize",this.resizer),this.container.style.position="relative"},q.prototype.on=function(t,n){this.events.on(t,n)},q.prototype.emit=function(t,n){this.events.emit(t,n)},q.constants={EVENT_INITIALIZED:"macy.initialized",EVENT_RECALCULATED:"macy.recalculated",EVENT_IMAGE_LOAD:"macy.image.load",EVENT_IMAGE_ERROR:"macy.image.error",EVENT_IMAGE_COMPLETE:"macy.images.complete",EVENT_RESIZE:"macy.resize"},q.prototype.constants=q.constants,q});
