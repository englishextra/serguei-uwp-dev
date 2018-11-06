/*global AdaptiveCards, manageMacy, updateMacyThrottled */
(function (root, document) {
	"use strict";

	var docBody = document.body || "";

	var classList = "classList";

	docBody[classList].add("hide-sidedrawer");

	var run = function () {

		var appendChild = "appendChild";
		var getElementsByClassName = "getElementsByClassName";
		var location = "location";
		var _length = "length";

		manageMacy("ac-grid", {
			trueOrder: false,
			waitForImages: false,
			margin: 20,
			columns: 3,
			breakAt: {
				1280: 3,
				1024: 2,
				960: 2,
				640: 1,
				480: 1,
				360: 1
			}
		});

		/*!
		 * @see {@link https://docs.microsoft.com/en-us/adaptive-cards/sdk/rendering-cards/javascript/render-a-card}
		 * @see {@link https://adaptivecards.io/samples/}
		 */
		var acRenderGalleryJson = {
			"$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
			"type": "AdaptiveCard",
			"version": "1.0",
			//"backgroundImage": "http://messagecardplayground.azurewebsites.net/assets/Mostly%20Cloudy-Background-Dark.jpg",
			"body": [{
					"type": "TextBlock",
					"text": "Here are some cool photos",
					"fontFamily": "Roboto Mono",
					"color": "accent",
					"size": "large"
				}, {
					"type": "TextBlock",
					"text": "Sorry some of them are repeats",
					"isSubtle": true,
					"size": "medium",
					"weight": "lighter"
				}, {
					"type": "ImageSet",
					"imageSize": "medium",
					"images": [{
							"type": "Image",
							"url": "https://picsum.photos/200/200?image=100"
						}, {
							"type": "Image",
							"url": "https://picsum.photos/300/200?image=200"
						}, {
							"type": "Image",
							"url": "https://picsum.photos/300/200?image=301"
						}, {
							"type": "Image",
							"url": "https://picsum.photos/200/200?image=400"
						}, {
							"type": "Image",
							"url": "https://picsum.photos/300/200?image=500"
						}, {
							"type": "Image",
							"url": "https://picsum.photos/200/200?image=600"
						}, {
							"type": "Image",
							"url": "https://picsum.photos/300/200?image=700"
						}, {
							"type": "Image",
							"url": "https://picsum.photos/300/200?image=800"
						}, {
							"type": "Image",
							"url": "https://picsum.photos/300/200?image=900"
						}
					]
				}
			]
		};

		var acRenderActivityJson = {
			"$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
			"type": "AdaptiveCard",
			"version": "1.0",
			"body": [{
					"type": "TextBlock",
					"text": "Publish Adaptive Card schema",
					"weight": "bolder",
					"size": "medium"
				}, {
					"type": "ColumnSet",
					"columns": [{
							"type": "Column",
							"width": "auto",
							"items": [{
									"type": "Image",
									"url": "https://pbs.twimg.com/profile_images/3647943215/d7f12830b3c17a5a9e4afcc370e3a37e_400x400.jpeg",
									"size": "small",
									"style": "person"
								}
							]
						}, {
							"type": "Column",
							"width": "stretch",
							"items": [{
									"type": "TextBlock",
									"text": "Matt Hidinger",
									"color": "accent",
									"weight": "bolder",
									"wrap": true
								}, {
									"type": "TextBlock",
									"spacing": "none",
									"text": "Created {{DATE(2017-02-14T06:08:39Z, SHORT)}}",
									"isSubtle": true,
									"wrap": true
								}
							]
						}
					]
				}, {
					"type": "TextBlock",
					"text": "Now that we have defined the main rules and features of the format, we need to produce a schema and publish it to GitHub. The schema will be the starting point of our reference documentation.",
					"wrap": true
				}, {
					"type": "FactSet",
					"facts": [{
							"title": "Board:",
							"value": "Adaptive Card"
						}, {
							"title": "List:",
							"value": "Backlog"
						}, {
							"title": "Assigned to:",
							"value": "Matt Hidinger"
						}, {
							"title": "Due date:",
							"value": "Not set"
						}
					]
				}
			],
			"actions": [{
					"type": "Action.ShowCard",
					"title": "Set due date",
					"card": {
						"type": "AdaptiveCard",
						"body": [{
								"type": "Input.Date",
								"id": "dueDate"
							}
						],
						"actions": [{
								"type": "Action.Submit",
								"title": "OK"
							}
						]
					}
				}, {
					"type": "Action.ShowCard",
					"title": "Comment",
					"card": {
						"type": "AdaptiveCard",
						"body": [{
								"type": "Input.Text",
								"id": "comment",
								"isMultiline": true,
								"placeholder": "Enter your comment"
							}
						],
						"actions": [{
								"type": "Action.Submit",
								"title": "OK"
							}
						]
					}
				}
			]
		};

		var acRenderRestaurantJson = {
			"$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
			"type": "AdaptiveCard",
			"version": "1.0",
			"body": [{
					"speak": "Tom's Pie is a Pizza restaurant which is rated 9.3 by customers.",
					"type": "ColumnSet",
					"columns": [{
							"type": "Column",
							"width": 2,
							"items": [{
									"type": "TextBlock",
									"text": "PIZZA",
									"color": "accent"
								}, {
									"type": "TextBlock",
									"text": "Tom's Pie",
									"weight": "bolder",
									"size": "extraLarge",
									"spacing": "none"
								}, {
									"type": "TextBlock",
									"text": "4.2 ★★★☆ (93) · $$",
									"isSubtle": true,
									"spacing": "none"
								}, {
									"type": "TextBlock",
									"text": "**Matt H. said** \"I'm compelled to give this place 5 stars due to the number of times I've chosen to eat here this past year!\"",
									"size": "small",
									"wrap": true
								}
							]
						}, {
							"type": "Column",
							"width": 1,
							"items": [{
									"type": "Image",
									"url": "https://picsum.photos/300?image=882",
									"size": "auto"
								}
							]
						}
					]
				}
			],
			"actions": [{
					"type": "Action.OpenUrl",
					"title": "More Info",
					"url": "#page=sample_form"
				}, {
					"type": "Action.OpenUrl",
					"title": "More Info",
					"url": "#page=sample_text"
				}
			]
		};

		var acRenderMediaJson = {
			"$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
			"type": "AdaptiveCard",
			"version": "1.0",
			"speak": "The Seattle Seahawks beat the Carolina Panthers 40-7",
			"body": [{
					"type": "Container",
					"items": [{
							"type": "ColumnSet",
							"columns": [{
									"type": "Column",
									"width": "auto",
									"items": [{
											"type": "Image",
											"url": "http://adaptivecards.io/content/cats/3.png",
											"size": "medium"
										}, {
											"type": "TextBlock",
											"text": "SHADES",
											"horizontalAlignment": "center",
											"weight": "bolder"
										}
									]
								}, {
									"type": "Column",
									"width": "stretch",
									"separator": true,
									"spacing": "medium",
									"items": [{
											"type": "TextBlock",
											"text": "Dec 4",
											"horizontalAlignment": "center"
										}, {
											"type": "TextBlock",
											"text": "Final",
											"spacing": "none",
											"horizontalAlignment": "center"
										}, {
											"type": "TextBlock",
											"text": "7 - 40",
											"size": "extraLarge",
											"horizontalAlignment": "center"
										}
									]
								}, {
									"type": "Column",
									"width": "auto",
									"separator": true,
									"spacing": "medium",
									"items": [{
											"type": "Image",
											"url": "http://adaptivecards.io/content/cats/2.png",
											"size": "medium",
											"horizontalAlignment": "center"
										}, {
											"type": "TextBlock",
											"text": "SKINS",
											"horizontalAlignment": "center",
											"weight": "bolder"
										}
									]
								}
							]
						}
					]
				}
			]
		};

		var renderAdaptiveCard = function (conatainerClass, cardObj, renderOptions, onExecute, callback) {
			var container = document[getElementsByClassName](conatainerClass)[0] || "";
			if (root.AdaptiveCards && container) {
				var adaptiveCard = new AdaptiveCards.AdaptiveCard();
				adaptiveCard.hostConfig = new AdaptiveCards.HostConfig(renderOptions);
				adaptiveCard.onExecuteAction = onExecute;
				adaptiveCard.parse(cardObj);
				var renderedCard = adaptiveCard.render();
				container[appendChild](renderedCard);
				if ("function" === typeof callback) {
					callback();
				}
				adaptiveCard = renderedCard = null;
			}
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
							"subtle": "#616161"
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

		var acOnExecuteCallback = function (action) {
			if (action.url) {
				root[location].href = action.url;
			}
		};

		var acRenderArray = [
			acRenderGalleryJson,
			acRenderActivityJson,
			acRenderRestaurantJson,
			acRenderGalleryJson,
			acRenderActivityJson,
			acRenderMediaJson
		];

		var i,
		l;
		for (i = 0, l = acRenderArray[_length]; i < l; i += 1) {
			renderAdaptiveCard("ac-grid", acRenderArray[i], acRenderOptions, acOnExecuteCallback, updateMacyThrottled);
		}
		i = l = null;
	};
	run();

})("undefined" !== typeof window ? window : this, document);
