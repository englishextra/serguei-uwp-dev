/*global console, GLightbox, imagesLoaded, manageExternalLinkAll, manageMacy, updateMacyThrottled*/
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

		var glightboxClass = "glightbox";

		var manageGlightbox = function (glightboxClass) {
			if (root.GLightbox) {
				var glightbox;
				glightbox = GLightbox({
						selector: glightboxClass
					});
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
			manageGlightbox(glightboxClass);
		};

		var macyItems = [{
				"src": "./libs/serguei-uwp/img/serguei-pictures/@1x/26036740714_dd47df27c0_z.jpg",
				"href": "./libs/serguei-uwp/img/serguei-pictures/@2x/26036740714_dd47df27c0_z.jpg"
			}, {
				"src": "./libs/serguei-uwp/img/serguei-pictures/@1x/26039009973_ed4b59a832_z.jpg",
				"href": "./libs/serguei-uwp/img/serguei-pictures/@2x/26039009973_ed4b59a832_z.jpg"
			}, {
				"src": "./libs/serguei-uwp/img/serguei-pictures/@1x/26039010063_971c7482c2_z.jpg",
				"href": "./libs/serguei-uwp/img/serguei-pictures/@2x/26039010063_971c7482c2_z.jpg"
			}, {
				"src": "./libs/serguei-uwp/img/serguei-pictures/@1x/26072583523_34e81c64eb_z.jpg",
				"href": "./libs/serguei-uwp/img/serguei-pictures/@2x/26072583523_34e81c64eb_z.jpg"
			}, {
				"src": "./libs/serguei-uwp/img/serguei-pictures/@1x/26074591023_4cdb8c2578_z.jpg",
				"href": "./libs/serguei-uwp/img/serguei-pictures/@2x/26074591023_4cdb8c2578_z.jpg"
			}, {
				"src": "./libs/serguei-uwp/img/serguei-pictures/@1x/26075482973_22a9cb2315_z.jpg",
				"href": "./libs/serguei-uwp/img/serguei-pictures/@2x/26075482973_22a9cb2315_z.jpg"
			}, {
				"src": "./libs/serguei-uwp/img/serguei-pictures/@1x/26126310843_988c4cd54f_z.jpg",
				"href": "./libs/serguei-uwp/img/serguei-pictures/@2x/26126310843_988c4cd54f_z.jpg"
			}, {
				"src": "./libs/serguei-uwp/img/serguei-pictures/@1x/26325951433_b1b2d0f6c9_z.jpg",
				"href": "./libs/serguei-uwp/img/serguei-pictures/@2x/26325951433_b1b2d0f6c9_z.jpg"
			}, {
				"src": "./libs/serguei-uwp/img/serguei-pictures/@1x/26351278130_1f5b4f685d_z.jpg",
				"href": "./libs/serguei-uwp/img/serguei-pictures/@2x/26351278130_1f5b4f685d_z.jpg"
			}, {
				"src": "./libs/serguei-uwp/img/serguei-pictures/@1x/26576984361_4c33589522_z.jpg",
				"href": "./libs/serguei-uwp/img/serguei-pictures/@2x/26576984361_4c33589522_z.jpg"
			}, {
				"src": "./libs/serguei-uwp/img/serguei-pictures/@1x/26584072022_41e887d01a_z.jpg",
				"href": "./libs/serguei-uwp/img/serguei-pictures/@2x/26584072022_41e887d01a_z.jpg"
			}, {
				"src": "./libs/serguei-uwp/img/serguei-pictures/@1x/26584858872_01827e6380_z.jpg",
				"href": "./libs/serguei-uwp/img/serguei-pictures/@2x/26584858872_01827e6380_z.jpg"
			}, {
				"src": "./libs/serguei-uwp/img/serguei-pictures/@1x/26587130302_94a53b425c_z.jpg",
				"href": "./libs/serguei-uwp/img/serguei-pictures/@2x/26587130302_94a53b425c_z.jpg"
			}, {
				"src": "./libs/serguei-uwp/img/serguei-pictures/@1x/26590374066_cfdfd24841_z.jpg",
				"href": "./libs/serguei-uwp/img/serguei-pictures/@2x/26590374066_cfdfd24841_z.jpg"
			}, {
				"src": "./libs/serguei-uwp/img/serguei-pictures/@1x/26610286881_f54a485475_z.jpg",
				"href": "./libs/serguei-uwp/img/serguei-pictures/@2x/26610286881_f54a485475_z.jpg"
			}, {
				"src": "./libs/serguei-uwp/img/serguei-pictures/@1x/26613969441_9cd6544a40_z.jpg",
				"href": "./libs/serguei-uwp/img/serguei-pictures/@2x/26613969441_9cd6544a40_z.jpg"
			}, {
				"src": "./libs/serguei-uwp/img/serguei-pictures/@1x/26633440426_1b8f93b0c4_z.jpg",
				"href": "./libs/serguei-uwp/img/serguei-pictures/@2x/26633440426_1b8f93b0c4_z.jpg"
			}, {
				"src": "./libs/serguei-uwp/img/serguei-pictures/@1x/26649748466_1312984841_z.jpg",
				"href": "./libs/serguei-uwp/img/serguei-pictures/@2x/26649748466_1312984841_z.jpg"
			}, {
				"src": "./libs/serguei-uwp/img/serguei-pictures/@1x/26657054850_d8e67c6abd_z.jpg",
				"href": "./libs/serguei-uwp/img/serguei-pictures/@2x/26657054850_d8e67c6abd_z.jpg"
			}, {
				"src": "./libs/serguei-uwp/img/serguei-pictures/@1x/26704086846_f0c831d974_z.jpg",
				"href": "./libs/serguei-uwp/img/serguei-pictures/@2x/26704086846_f0c831d974_z.jpg"
			}, {
				"src": "./libs/serguei-uwp/img/serguei-pictures/@1x/28333662912_b9b1d88c36_z.jpg",
				"href": "./libs/serguei-uwp/img/serguei-pictures/@2x/28333662912_b9b1d88c36_z.jpg"
			}, {
				"src": "./libs/serguei-uwp/img/serguei-pictures/@1x/32677466200_7b6db6f15d_z.jpg",
				"href": "./libs/serguei-uwp/img/serguei-pictures/@2x/32677466200_7b6db6f15d_z.jpg"
			}, {
				"src": "./libs/serguei-uwp/img/serguei-pictures/@1x/36136972621_02ff19e368_z.jpg",
				"href": "./libs/serguei-uwp/img/serguei-pictures/@2x/36136972621_02ff19e368_z.jpg"
			}, {
				"src": "./libs/serguei-uwp/img/serguei-pictures/@1x/36229259776_09b4755088_z.jpg",
				"href": "./libs/serguei-uwp/img/serguei-pictures/@2x/36229259776_09b4755088_z.jpg"
			}
		];

		var addMacyItems = function (macyGrid, callback) {
			var html = "";
			var i,
			l;
			for (i = 0, l = macyItems.length; i < l; i += 1) {
				html += '<a href="' + macyItems[i].href + '" class="' + glightboxClass + '" aria-label="Ссылка"><img src="' + macyItems[i].src + '" alt="" /></a>\n';
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
