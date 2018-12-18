/*!
 * imgLightbox
 * requires this very img-lightbox.js, and animate.css, img-lightbox.css
 * passes jshint
 */
(function (root, document) {
	"use strict";
	var docBody = document.body || "";

	var animatedClass = "animated";
	var appendChild = "appendChild";
	var classList = "classList";
	var createElement = "createElement";
	var getAttribute = "getAttribute";
	var getElementsByClassName = "getElementsByClassName";
	var getElementsByTagName = "getElementsByTagName";
	var style = "style";
	var _addEventListener = "addEventListener";
	var _length = "length";
	var _removeEventListener = "removeEventListener";

	var btnCloseClass = "btn-close";
	var containerClass = "img-lightbox";

	var fadeInClass = "fadeIn";
	var fadeInUpClass = "fadeInUp";
	var fadeOutClass = "fadeOut";
	var fadeOutDownClass = "fadeOutDown";

	var imgLightboxOpenClass = "img-lightbox--open";
	var imgLightboxLinkIsBindedClass = "img-lightbox-link--is-binded";

	var isLoadedClass = "is-loaded";

	var dummySrc = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
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
	/* var imagePromise = function (s) {
		if (root.Promise) {
			return new Promise(function (y, n) {
				var f = function (e, p) {
					e.onload = function () {
						y(p);
					};
					e.onerror = function () {
						n(p);
					};
					e.src = p;
				};
				if ("string" === typeof s) {
					var a = new Image();
					f(a, s);
				} else {
					if ("img" !== s.tagName) {
						return Promise.reject();
					} else {
						if (s.src) {
							f(s, s.src);
						}
					}
				}
			});
		} else {
			throw new Error("Promise is not in global object");
		}
	}; */
	var handleImgLightboxContainer;
	var handleImgLightboxWindow;
	var handleImgLightboxContainerWithBind;
	var handleImgLightboxWindowWithBind;
	var hideImgLightbox = function () {
		var container = document[getElementsByClassName](containerClass)[0] || "";
		var img = container ? container[getElementsByTagName]("img")[0] || "" : "";
		var btnClose = container ? container[getElementsByClassName](btnCloseClass)[0] || "" : "";
		var hideContainer = function () {
			container[classList].remove(fadeInClass);
			container[classList].add(fadeOutClass);
			var hideImg = function () {
				container[classList].remove(animatedClass);
				container[classList].remove(fadeOutClass);
				img[classList].remove(animatedClass);
				img[classList].remove(fadeOutDownClass);
				img.src = dummySrc;
				container[style].display = "none";
			};
			var timer = setTimeout(function () {
					clearTimeout(timer);
					timer = null;
					hideImg();
				}, 400);
		};
		if (container && img) {
			container[_removeEventListener]("click", handleImgLightboxContainer);
			container[_removeEventListener]("click", handleImgLightboxContainerWithBind);
			btnClose[_removeEventListener]("click", handleImgLightboxContainer);
			btnClose[_removeEventListener]("click", handleImgLightboxContainerWithBind);
			root[_removeEventListener]("keyup", handleImgLightboxWindow);
			root[_removeEventListener]("keyup", handleImgLightboxWindowWithBind);
			img[classList].remove(fadeInUpClass);
			img[classList].add(fadeOutDownClass);
			var timer = setTimeout(function () {
					clearTimeout(timer);
					timer = null;
					hideContainer();
				}, 400);
		}
		docBody[classList].remove(imgLightboxOpenClass);
	};
	var callCallback = function (func, data) {
		if (typeof func !== "function") {
			return;
		}
		var caller = func.bind(this);
		caller(data);
	};
	handleImgLightboxContainer = function (callback) {
		hideImgLightbox();
		callCallback(callback, root);
	};
	handleImgLightboxWindow = function (callback, ev) {
		if (27 === (ev.which || ev.keyCode)) {
			hideImgLightbox();
			callCallback(callback, root);
		}
	};
	var imgLightbox = function (linkClass, settings) {
		var _linkClass = linkClass || "";
		var options = settings || {};
		var rate = options.rate || 500;
		var link = document[getElementsByClassName](_linkClass) || "";
		var container = document[getElementsByClassName](containerClass)[0] || "";
		if (!container) {
			container = document[createElement]("div");
			container[classList].add(containerClass);
			var containerHTML = [];
			containerHTML.push('<img src="' + dummySrc + '" alt="">');
			/*!
			 * @see {@link https://epic-spinners.epicmax.co/}
			 */
			containerHTML.push('<div class="half-circle-spinner"><div class="circle circle-1"></div><div class="circle circle-2"></div></div>');
			containerHTML.push('<a href="javascript:void(0);" class="btn-close"></a>');
			container.innerHTML = containerHTML.join("");
			docBody[appendChild](container);
		}
		var img = container ? container[getElementsByTagName]("img")[0] || "" : "";
		var btnClose = container ? container[getElementsByClassName](btnCloseClass)[0] || "" : "";
		var arrange = function (e) {
			var hrefString = e[getAttribute]("href") || e[getAttribute]("data-src") || "";
			if (!hrefString) {
				return;
			}
			var logic = function (ev) {
				ev.stopPropagation();
				ev.preventDefault();
				docBody[classList].add(imgLightboxOpenClass);
				container[classList].remove(isLoadedClass);
				var logic = function () {
					if (options.onCreated) {
						callCallback(options.onCreated, root);
					}
					container[classList].add(animatedClass);
					container[classList].add(fadeInClass);
					img[classList].add(animatedClass);
					img[classList].add(fadeInUpClass);
					/* imagePromise(hrefString).then(function () {
						console.log("loaded with imagePromise:", hrefString);
						container[classList].add(isLoadedClass);
						img.src = hrefString;
						if (options.onLoaded) {
							callCallback(options.onLoaded, root);
						}
					}).catch (function () {
						console.log("cannot load image with imagePromise:", hrefString);
						if (options.onError) {
							callCallback(options.onError, root);
						}
					}); */
					img.onload = function () {
						/* console.log("loaded image:", hrefString); */
						container[classList].add(isLoadedClass);
						if (options.onLoaded) {
							callCallback(options.onLoaded, root);
						}
					};
					img.onerror = function () {
						/* console.log("cannot load image:", hrefString); */
						if (options.onError) {
							callCallback(options.onError, root);
						}
					};
					img.src = hrefString;
					if (options.onClosed) {
						handleImgLightboxContainerWithBind = handleImgLightboxContainer.bind(null, options.onClosed);
						handleImgLightboxWindowWithBind = handleImgLightboxWindow.bind(null, options.onClosed);
						container[_addEventListener]("click", handleImgLightboxContainerWithBind);
						btnClose[_addEventListener]("click", handleImgLightboxContainerWithBind);
						root[_addEventListener]("keyup", handleImgLightboxWindowWithBind);
					} else {
						container[_addEventListener]("click", handleImgLightboxContainer);
						btnClose[_addEventListener]("click", handleImgLightboxContainer);
						root[_addEventListener]("keyup", handleImgLightboxWindow);
					}
					container[style].display = "block";
				};
				debounce(logic, rate).call();
			};
			if (!e[classList].contains(imgLightboxLinkIsBindedClass)) {
				e[classList].add(imgLightboxLinkIsBindedClass);
				e[_addEventListener]("click", logic);
			}
		};
		if (container && img && link) {
			var i,
			l;
			for (i = 0, l = link[_length]; i < l; i += 1) {
				arrange(link[i]);
			}
			i = l = null;
		}
	};
	root.imgLightbox = imgLightbox;
})("undefined" !== typeof window ? window : this, document);