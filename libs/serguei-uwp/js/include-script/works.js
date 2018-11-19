/*global console, imagesLoaded, manageExternalLinkAll, manageMacy,
renderAdaptiveCard,
updateMacyThrottled*/
(function (root, document) {
	"use strict";

	var run = function () {

		var classList = "classList";
		var getElementsByClassName = "getElementsByClassName";
		var location = "location";
		var querySelectorAll = "querySelectorAll";
		var _addEventListener = "addEventListener";
		var _length = "length";

		/*!
		 * @see {@link https://docs.microsoft.com/en-us/adaptive-cards/sdk/rendering-cards/javascript/render-a-card}
		 * @see {@link https://adaptivecards.io/samples/}
		 * @see {@link https://github.com/Microsoft/AdaptiveCards/issues/1984}
		 */
		var acRender1 = {
			"$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
			"type": "AdaptiveCard",
			"version": "1.0",
			"body": [{
					"type": "ColumnSet",
					"columns": [{
							"type": "Column",
							"width": 1,
							"items": [{
									"type": "Image",
									"altText": "",
									"url": "./libs/serguei-uwp/img/works-screenshots/@1x/englishextra.github.io.jpg",
									"size": "stretch",
									"selectAction": {
										"type": "Action.OpenUrl",
										"title": "Скайп",
										"url": "https://englishextra.github.io/"
									}
								}
							]
						}
					]
				}
			]
		};

		var acRender2 = {
			"$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
			"type": "AdaptiveCard",
			"version": "1.0",
			"body": [{
					"type": "ColumnSet",
					"columns": [{
							"type": "Column",
							"width": 1,
							"items": [{
									"type": "Image",
									"altText": "",
									"url": "./libs/serguei-uwp/img/works-screenshots/@1x/englishextra.github.io-serguei-about-html.jpg",
									"size": "stretch",
									"selectAction": {
										"type": "Action.OpenUrl",
										"title": "Скайп",
										"url": "https://englishextra.github.io/serguei/about.html"
									}
								}
							]
						}
					]
				}
			]
		};

		var acRender3 = {
			"$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
			"type": "AdaptiveCard",
			"version": "1.0",
			"body": [{
					"type": "ColumnSet",
					"columns": [{
							"type": "Column",
							"width": 1,
							"items": [{
									"type": "Image",
									"altText": "",
									"url": "./libs/serguei-uwp/img/works-screenshots/@1x/englishextra.gitlab.io.jpg",
									"size": "stretch",
									"selectAction": {
										"type": "Action.OpenUrl",
										"title": "Скайп",
										"url": "https://englishextra.gitlab.io/"
									}
								}
							]
						}
					]
				}
			]
		};

		var acRender4 = {
			"$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
			"type": "AdaptiveCard",
			"version": "1.0",
			"body": [{
					"type": "ColumnSet",
					"columns": [{
							"type": "Column",
							"width": 1,
							"items": [{
									"type": "Image",
									"altText": "",
									"url": "./libs/serguei-uwp/img/works-screenshots/@1x/mytushino.github.io.jpg",
									"size": "stretch",
									"selectAction": {
										"type": "Action.OpenUrl",
										"title": "Скайп",
										"url": "https://mytushino.github.io/"
									}
								}
							]
						}
					]
				}
			]
		};

		var acRender5 = {
			"$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
			"type": "AdaptiveCard",
			"version": "1.0",
			"body": [{
					"type": "ColumnSet",
					"columns": [{
							"type": "Column",
							"width": 1,
							"items": [{
									"type": "Image",
									"altText": "",
									"url": "./libs/serguei-uwp/img/works-screenshots/@1x/noushevr.github.io.jpg",
									"size": "stretch",
									"selectAction": {
										"type": "Action.OpenUrl",
										"title": "Скайп",
										"url": "https://noushevr.github.io/"
									}
								}
							]
						}
					]
				}
			]
		};

		var acRender6 = {
			"$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
			"type": "AdaptiveCard",
			"version": "1.0",
			"body": [{
					"type": "ColumnSet",
					"columns": [{
							"type": "Column",
							"width": 1,
							"items": [{
									"type": "Image",
									"altText": "",
									"url": "./libs/serguei-uwp/img/works-screenshots/@1x/englishextra.github.io-serguei-slides-html.jpg",
									"size": "stretch",
									"selectAction": {
										"type": "Action.OpenUrl",
										"title": "Скайп",
										"url": "https://englishextra.github.io/serguei/slides.html"
									}
								}
							]
						}
					]
				}
			]
		};

		var acRender7 = {
			"$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
			"type": "AdaptiveCard",
			"version": "1.0",
			"body": [{
					"type": "ColumnSet",
					"columns": [{
							"type": "Column",
							"width": 1,
							"items": [{
									"type": "Image",
									"altText": "",
									"url": "./libs/serguei-uwp/img/works-screenshots/@1x/englishextra.github.io-pages-more-more_irregular_verbs-html.jpg",
									"size": "stretch",
									"selectAction": {
										"type": "Action.OpenUrl",
										"title": "Скайп",
										"url": "https://englishextra.github.io/pages/more/more_irregular_verbs.html"
									}
								}
							]
						}
					]
				}
			]
		};

		var acRender8 = {
			"$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
			"type": "AdaptiveCard",
			"version": "1.0",
			"body": [{
					"type": "ColumnSet",
					"columns": [{
							"type": "Column",
							"width": 1,
							"items": [{
									"type": "Image",
									"altText": "",
									"url": "./libs/serguei-uwp/img/works-screenshots/@1x/englishextra.github.io-pages-more-more_newsletter_can_get_english_for_free-html.jpg",
									"size": "stretch",
									"selectAction": {
										"type": "Action.OpenUrl",
										"title": "Скайп",
										"url": "https://englishextra.github.io/pages/more/more_newsletter_can_get_english_for_free.html"
									}
								}
							]
						}
					]
				}
			]
		};

		var acRender9 = {
			"$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
			"type": "AdaptiveCard",
			"version": "1.0",
			"body": [{
					"type": "ColumnSet",
					"columns": [{
							"type": "Column",
							"width": 1,
							"items": [{
									"type": "Image",
									"altText": "",
									"url": "./libs/serguei-uwp/img/works-screenshots/@1x/englishextra.github.io-403-html.jpg",
									"size": "stretch",
									"selectAction": {
										"type": "Action.OpenUrl",
										"title": "Скайп",
										"url": "https://englishextra.github.io/403.html"
									}
								}
							]
						}
					]
				}
			]
		};

		var acRender10 = {
			"$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
			"type": "AdaptiveCard",
			"version": "1.0",
			"body": [{
					"type": "ColumnSet",
					"columns": [{
							"type": "Column",
							"width": 1,
							"items": [{
									"type": "Image",
									"altText": "",
									"url": "./libs/serguei-uwp/img/works-screenshots/@1x/englishextra.github.io-404-html.jpg",
									"size": "stretch",
									"selectAction": {
										"type": "Action.OpenUrl",
										"title": "Скайп",
										"url": "https://englishextra.github.io/404.html"
									}
								}
							]
						}
					]
				}
			]
		};

		var acRender11 = {
			"$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
			"type": "AdaptiveCard",
			"version": "1.0",
			"body": [{
					"type": "ColumnSet",
					"columns": [{
							"type": "Column",
							"width": 1,
							"items": [{
									"type": "Image",
									"altText": "",
									"url": "./libs/serguei-uwp/img/works-screenshots/@1x/www.npmjs.com-englishextra.jpg",
									"size": "stretch",
									"selectAction": {
										"type": "Action.OpenUrl",
										"title": "Скайп",
										"url": "https://www.npmjs.com/~englishextra"
									}
								}
							]
						}
					]
				}
			]
		};

		var acRender12 = {
			"$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
			"type": "AdaptiveCard",
			"version": "1.0",
			"body": [{
					"type": "ColumnSet",
					"columns": [{
							"type": "Column",
							"width": 1,
							"items": [{
									"type": "Image",
									"altText": "",
									"url": "./libs/serguei-uwp/img/works-screenshots/@1x/www.behance.net-englishextra.jpg",
									"size": "stretch",
									"selectAction": {
										"type": "Action.OpenUrl",
										"title": "Скайп",
										"url": "https://www.behance.net/englishextra"
									}
								}
							]
						}
					]
				}
			]
		};

		var acRender13 = {
			"$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
			"type": "AdaptiveCard",
			"version": "1.0",
			"body": [{
					"type": "ColumnSet",
					"columns": [{
							"type": "Column",
							"width": 1,
							"items": [{
									"type": "Image",
									"altText": "",
									"url": "./libs/serguei-uwp/img/works-screenshots/@1x/www.domestika.org-en-englishextra.jpg",
									"size": "stretch",
									"selectAction": {
										"type": "Action.OpenUrl",
										"title": "Скайп",
										"url": "https://www.domestika.org/en/englishextra"
									}
								}
							]
						}
					]
				}
			]
		};

		var acRender14 = {
			"$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
			"type": "AdaptiveCard",
			"version": "1.0",
			"body": [{
					"type": "ColumnSet",
					"columns": [{
							"type": "Column",
							"width": 1,
							"items": [{
									"type": "Image",
									"altText": "",
									"url": "./libs/serguei-uwp/img/works-screenshots/@1x/github.com-englishextra.jpg",
									"size": "stretch",
									"selectAction": {
										"type": "Action.OpenUrl",
										"title": "Скайп",
										"url": "https://github.com/englishextra"
									}
								}
							]
						}
					]
				}
			]
		};

		var acRender15 = {
			"$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
			"type": "AdaptiveCard",
			"version": "1.0",
			"body": [{
					"type": "ColumnSet",
					"columns": [{
							"type": "Column",
							"width": 1,
							"items": [{
									"type": "Image",
									"altText": "",
									"url": "./libs/serguei-uwp/img/works-screenshots/@1x/build.phonegap.com-apps-1824701-share.jpg",
									"size": "stretch",
									"selectAction": {
										"type": "Action.OpenUrl",
										"title": "Скайп",
										"url": "https://build.phonegap.com/apps/1824701/share"
									}
								}
							]
						}
					]
				}
			]
		};

		/*!
		 * to change default style
		 * @see {@link https://github.com/Microsoft/AdaptiveCards/pull/905}
		 * @see {@link https://github.com/Microsoft/AdaptiveCards/issues/1929}
		 * @see {@link https://docs.microsoft.com/en-us/adaptive-cards/rendering-cards/host-config#adaptivecardconfig}
		 * @see {@link https://material.io/tools/color/#!/?view.left=0&view.right=0&secondary.color=BDBDBD&primary.color=F06292}
		 */
		var acRenderOptions = {
			"fontFamily": "Roboto, Segoe UI, Segoe MDL2 Assets, Helvetica Neue, sans-serif",
			"containerStyles": {
				"default": {
					"foregroundColors": {
						"default": {
							"default": "#212121",
							"subtle": "#757575"
						},
						"dark": {
							"default": "#000000",
							"subtle": "#424242"
						},
						"light": {
							"default": "#757575",
							"subtle": "#bdbdbd"
						},
						"accent": {
							"default": "#0097a7",
							"subtle": "#26c6da"
						},
						"good": {
							"default": "#388e3c",
							"subtle": "#66bb6a"
						},
						"warning": {
							"default": "#e64a19",
							"subtle": "#ff7043"
						},
						"attention": {
							"default": "#d81b60",
							"subtle": "#f06292"
						}
					},
					"backgroundColor": "#ffffff"
				}
			}
		};

		var acRenderArray = [
			acRender1,
			acRender2,
			acRender3,
			acRender4,
			acRender5,
			acRender6,
			acRender7,
			acRender8,
			acRender9,
			acRender10,
			acRender11,
			acRender12,
			acRender13,
			acRender14,
			acRender15
		];

		var acOnExecute = function (action) {
			if (action.url) {
				root[location].href = action.url;
			}
		};

		var acOnRender = function () {
			if (root.updateMacyThrottled) {
				updateMacyThrottled();
			}
			if (root.manageExternalLinkAll) {
				manageExternalLinkAll();
			}
		};

		var isBindedAdaptiveCardClass = "is-binded-adaptive-card";

		var acGridClass = "ac-grid";

		var acGrid = document[getElementsByClassName](acGridClass)[0] || "";

		var acOnResize = function () {
			try {
				var acContainer = acGrid ? (acGrid.children || acGrid[querySelectorAll]("." + acGridClass + " > div") || "") : "";
				if (acContainer) {
					var i,
					l;
					for (i = 0, l = acContainer[_length]; i < l; i += 1) {
						if (!acContainer[i][classList].contains(isBindedAdaptiveCardClass)) {
							acContainer[i][classList].add(isBindedAdaptiveCardClass);
							acContainer[i][_addEventListener]("onresize", updateMacyThrottled, {
								passive: true
							});
						}
					}
					i = l = null;
				}
			} catch (err) {
				throw new Error("cannot acOnResize " + err);
			}
		};

		var acOnManage = function () {
			if (root.imagesLoaded) {
				/*!
				 * @see {@link https://imagesloaded.desandro.com/}
				 * Triggered after all images have been either loaded or confirmed broken.
				 */
				var imgLoad;
				imgLoad = new imagesLoaded(acGrid);
				var onAlways = function (instance) {
					if (root.updateMacyThrottled) {
						updateMacyThrottled();
					}
					console.log("imagesLoaded: found " + instance.images[_length] + " images");
				};
				imgLoad.on("always", onAlways);
			}
			acOnResize();
		};

		var manageAdaptiveCards = function (acGrid, callback) {
			if (root.renderAdaptiveCard) {
				var i,
				l;
				for (i = 0, l = acRenderArray[_length]; i < l; i += 1) {
					renderAdaptiveCard(acGrid, acRenderArray[i], acRenderOptions, acOnExecute, acOnRender);
				}
				i = l = null;
				if ("function" === typeof callback) {
					callback();
				}
			}
		};

		if (acGrid) {
			manageMacy(acGridClass, {
				trueOrder: false,
				waitForImages: false,
				margin: 0,
				columns: 4,
				breakAt: {
					1280: 4,
					1024: 3,
					960: 2,
					640: 1,
					480: 1,
					360: 1
				}
			});

			manageAdaptiveCards(acGrid, acOnManage);
		}

		if (root.manageExternalLinkAll) {
			manageExternalLinkAll();
		}
	};
	run();

})("undefined" !== typeof window ? window : this, document);
