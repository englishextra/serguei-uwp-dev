/*global console, imagesLoaded, manageExternalLinkAll, manageMacy, updateMacyThrottled*/
(function (root, document) {
	"use strict";

	var run = function () {

		var classList = "classList";
		var getElementsByClassName = "getElementsByClassName";
		var querySelectorAll = "querySelectorAll";
		var _addEventListener = "addEventListener";
		var _length = "length";

		var onMacyRender = function () {
			if (root.updateMacyThrottled) {
				updateMacyThrottled();
			}
			if (root.manageExternalLinkAll) {
				manageExternalLinkAll();
			}
		};

		var isBindedMacyItemClass = "is-binded-macy-item";

		var macyGridClass = "macy-grid";

		var macyGrid = document[getElementsByClassName](macyGridClass)[0] || "";

		var onMacyResize = function () {
			try {
				var container = macyGrid ? (macyGrid.children || macyGrid[querySelectorAll]("." + macyGridClass + " > *") || "") : "";
				if (container) {
					var i,
					l;
					for (i = 0, l = container[_length]; i < l; i += 1) {
						if (!container[i][classList].contains(isBindedMacyItemClass)) {
							container[i][classList].add(isBindedMacyItemClass);
							container[i][_addEventListener]("onresize", updateMacyThrottled, {
								passive: true
							});
						}
					}
					i = l = null;
				}
			} catch (err) {
				throw new Error("cannot onMacyResize " + err);
			}
		};

		var onMacyManage = function () {
			if (root.imagesLoaded) {
				/*!
				 * @see {@link https://imagesloaded.desandro.com/}
				 * Triggered after all images have been either loaded or confirmed broken.
				 */
				var imgLoad;
				imgLoad = new imagesLoaded(macyGrid);
				var onAlways = function (instance) {
					if (root.updateMacyThrottled) {
						updateMacyThrottled();
					}
					console.log("imagesLoaded: found " + instance.images[_length] + " images");
				};
				imgLoad.on("always", onAlways);
			}
			onMacyResize();
		};

		var macyItems = [{
				"url": "https://build.phonegap.com/apps/1824701/share",
				"src": "./libs/serguei-uwp/img/works-screenshots/@1x/build.phonegap.com-apps-1824701-share.jpg"
			}, {
				"url": "https://englishextra.github.io/403.html",
				"src": "./libs/serguei-uwp/img/works-screenshots/@1x/englishextra.github.io-403-html.jpg"
			}, {
				"url": "https://englishextra.github.io/404.html",
				"src": "./libs/serguei-uwp/img/works-screenshots/@1x/englishextra.github.io-404-html.jpg"
			}, {
				"url": "https://englishextra.github.io/pages/more/more_irregular_verbs.html",
				"src": "./libs/serguei-uwp/img/works-screenshots/@1x/englishextra.github.io-pages-more-more_irregular_verbs-html.jpg"
			}, {
				"url": "https://englishextra.github.io/pages/more/more_newsletter_can_get_english_for_free.html",
				"src": "./libs/serguei-uwp/img/works-screenshots/@1x/englishextra.github.io-pages-more-more_newsletter_can_get_english_for_free-html.jpg"
			}, {
				"url": "https://englishextra.github.io/serguei/about.html",
				"src": "./libs/serguei-uwp/img/works-screenshots/@1x/englishextra.github.io-serguei-about-html.jpg"
			}, {
				"url": "https://englishextra.github.io/serguei/slides.html",
				"src": "./libs/serguei-uwp/img/works-screenshots/@1x/englishextra.github.io-serguei-slides-html.jpg"
			}, {
				"url": "https://englishextra.github.io/",
				"src": "./libs/serguei-uwp/img/works-screenshots/@1x/englishextra.github.io.jpg"
			}, {
				"url": "https://englishextra.gitlab.io/",
				"src": "./libs/serguei-uwp/img/works-screenshots/@1x/englishextra.gitlab.io.jpg"
			}, {
				"url": "https://github.com/englishextra",
				"src": "./libs/serguei-uwp/img/works-screenshots/@1x/github.com-englishextra.jpg"
			}, {
				"url": "https://mytushino.github.io/",
				"src": "./libs/serguei-uwp/img/works-screenshots/@1x/mytushino.github.io.jpg"
			}, {
				"url": "https://noushevr.github.io/",
				"src": "./libs/serguei-uwp/img/works-screenshots/@1x/noushevr.github.io.jpg"
			}, {
				"url": "https://www.behance.net/englishextra",
				"src": "./libs/serguei-uwp/img/works-screenshots/@1x/www.behance.net-englishextra.jpg"
			}, {
				"url": "https://www.domestika.org/en/englishextra",
				"src": "./libs/serguei-uwp/img/works-screenshots/@1x/www.domestika.org-en-englishextra.jpg"
			}, {
				"url": "https://www.npmjs.com/~englishextra",
				"src": "./libs/serguei-uwp/img/works-screenshots/@1x/www.npmjs.com-englishextra.jpg"
			}
		];

		var addMacyItems = function (macyGrid, callback) {
			var html = "";
			var i,
			l;
			for (i = 0, l = macyItems.length; i < l; i += 1) {
				html += '<a href="' + macyItems[i].url + '" aria-label="Ссылка"><img src="' + macyItems[i].src + '" alt="" /></a>\n';
			}
			i = l = null;
			macyGrid.innerHTML = html;
			onMacyRender();
			if ("function" === typeof callback) {
				callback();
			}
		};

		if (macyGrid) {
			manageMacy(macyGridClass, {
				trueOrder: false,
				waitForImages: false,
				margin: 0,
				columns: 4,
				breakAt: {
					1280: 4,
					1024: 3,
					960: 2,
					640: 2,
					480: 1,
					360: 1
				}
			});

			addMacyItems(macyGrid, onMacyManage);
		}

		if (root.manageExternalLinkAll) {
			manageExternalLinkAll();
		}
	};
	run();

})("undefined" !== typeof window ? window : this, document);
