/*global console, imgLightbox, imagesLoaded, LazyLoad, LoadingSpinner,
loadJsCss, manageExternalLinkAll, manageMacy, manageReadMore, renderAC,
updateMacyThrottled*/
/*!
 * page logic
 */
(function (root, document) {
	"use strict";

	var getElementsByClassName = "getElementsByClassName";

	root.runHome = function () {

		var classList = "classList";
		var location = "location";
		var querySelectorAll = "querySelectorAll";
		var _addEventListener = "addEventListener";
		var _length = "length";

		/*!
		 * @see {@link https://docs.microsoft.com/en-us/adaptive-cards/sdk/rendering-cards/javascript/render-a-card}
		 * @see {@link https://adaptivecards.io/samples/}
		 * @see {@link https://github.com/Microsoft/AdaptiveCards/issues/1984}
		 */
		var renderACVCard = {
			"$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
			"type": "AdaptiveCard",
			"version": "1.0",
			"body": [{
					"type": "ColumnSet",
					"columns": [{
							"type": "Column",
							"width": 2,
							"items": [{
									"type": "Image",
									"altText": "",
									"url": "./libs/serguei-uwp/img/shimanskybiz-instagram/@0.25x/c599a30aa1744c200a159bc418635d46.jpg",
									"size": "stretch",
									"style": "person"
								}
							]
						}, {
							"type": "Column",
							"width": 6,
							"items": [{
									"type": "TextBlock",
									"text": "Serguei Shimansky",
									"size": "medium",
									"color": "accent",
									"weight": "default",
									"wrap": true,
									"spacing": "none"
								}, {
									"type": "TextBlock",
									"text": "Репетитор английского",
									"size": "small",
									"isSubtle": true,
									"wrap": true,
									"spacing": "none"
								}, {
									"type": "TextBlock",
									"text": "Москва, Южное Тушино",
									"size": "small",
									"isSubtle": true,
									"wrap": true,
									"spacing": "none"
								}, {
									"type": "TextBlock",
									"text": "19 лет стажа",
									"size": "small",
									"isSubtle": true,
									"wrap": true,
									"spacing": "none"
								}
							]
						}
					]
				}, {
					"type": "TextBlock",
					"text": "«С нуля», подтянуть, улучшить, подготовка к ЕГЭ. В Тушино.",
					"size": "default",
					"wrap": true
				}, {
					"type": "FactSet",
					"facts": [{
							"title": "Стаж:",
							"value": "19 лет"
						}, {
							"title": "Образование:",
							"value": "МЭГУ, менеджмент в культуре, 1994"
						}, {
							"title": "График:",
							"value": "с 10:00 до 20:00"
						}, {
							"title": "Адрес:",
							"value": "Москва, Южное Тушино"
						}
					]
				}
			]
		};

		var renderACIntro = {
			"$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
			"type": "AdaptiveCard",
			"version": "1.0",
			"body": [{
					"type": "TextBlock",
					"text": "Специализация",
					"size": "medium",
					"weight": "default",
					"wrap": true,
					"spacing": "none"
				}, {
					"type": "TextBlock",
					"text": "Общий, разговорный, британский американский английский. Подготовка к олимпиаде по английскому языку, международный экзамен IELTS, деловой английский, ОГЭ по английскому языку, ЕГЭ по английскому языку. Также, увлекаюсь веб-разработкой, делаю сайты-визитки.",
					"size": "default",
					"wrap": true
				}

			]
		};

		var renderACBackground = {
			"$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
			"type": "AdaptiveCard",
			"version": "1.0",
			"body": [{
					"type": "TextBlock",
					"text": "Опыт работы",
					"size": "medium",
					"weight": "default",
					"wrap": true,
					"spacing": "none"
				}, {
					"type": "TextBlock",
					"text": "Работал переводчиком в различных некоммерческих организациях (Врачи без границ, United Way, ВКБ ООН и др.), преподавателем английского в частной школе. В настоящий момент преподаю английский школьникам, студентам и взрослым в частном порядке в Тушино.",
					"size": "default",
					"wrap": true
				}, {
					"type": "ColumnSet",
					"columns": [{
							"type": "Column",
							"width": 1,
							"items": [{
									"type": "Image",
									"altText": "",
									"url": "./libs/serguei-uwp/img/shimanskybiz-instagram/@1x/6a6e4f6198cc19aaf08995bfbf390908.jpg",
									"size": "stretch"
								}
							]
						}
					]
				}
			]
		};

		var renderACInPerson = {
			"$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
			"type": "AdaptiveCard",
			"version": "1.0",
			"body": [{
					"type": "TextBlock",
					"text": "Идивидуально",
					"size": "medium",
					"weight": "default",
					"wrap": true,
					"spacing": "none"
				}, {
					"type": "TextBlock",
					"text": "Английский индивидуально - наиболее эффективный метод образования: вы говорите больше, чем на занятиях в группах. Язык — средство общения, и мерилом служат ваши навыки аудирования, говорения и чтения, но не объем записанных новых слов вкупе с неспособностью общаться на иностранном языке в реальных ситуациях.",
					"size": "default",
					"wrap": true
				}
			]
		};

		var renderACDiploma1 = {
			"$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
			"type": "AdaptiveCard",
			"version": "1.0",
			"body": [{
					"type": "TextBlock",
					"text": "Дипломы",
					"size": "medium",
					"weight": "default",
					"wrap": true,
					"spacing": "none"
				}, {
					"type": "TextBlock",
					"text": "1 место в районной олимпиаде по немецкому языку среди 8-x классов.",
					"size": "default",
					"wrap": true
				}, {
					"type": "ColumnSet",
					"columns": [{
							"type": "Column",
							"width": 1,
							"items": [{
									"type": "Image",
									"altText": "",
									"url": "./libs/serguei-uwp/img/shimanskybiz-instagram/@1x/e58495540679687089b9f86c4b94b5dc.jpg",
									"size": "stretch",
									"selectAction": {
										"type": "Action.OpenUrl",
										"title": "Показать картинку",
										"url": "./libs/serguei-uwp/img/shimanskybiz-instagram/@2x/e58495540679687089b9f86c4b94b5dc.jpg"
									}
								}
							]
						}
					]
				}
			]
		};

		var renderACDiploma2 = {
			"$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
			"type": "AdaptiveCard",
			"version": "1.0",
			"body": [{
					"type": "TextBlock",
					"text": "Дипломы",
					"size": "medium",
					"weight": "default",
					"wrap": true,
					"spacing": "none"
				}, {
					"type": "TextBlock",
					"text": "1 место в районной олимпиаде по английскому языку среди 8-x классов.",
					"size": "default",
					"wrap": true
				}, {
					"type": "ColumnSet",
					"columns": [{
							"type": "Column",
							"width": 1,
							"items": [{
									"type": "Image",
									"altText": "",
									"url": "./libs/serguei-uwp/img/shimanskybiz-instagram/@1x/29c50626a6dac85aaa355bacfca2929d.jpg",
									"size": "stretch",
									"selectAction": {
										"type": "Action.OpenUrl",
										"title": "Показать картинку",
										"url": "./libs/serguei-uwp/img/shimanskybiz-instagram/@2x/29c50626a6dac85aaa355bacfca2929d.jpg"
									}
								}
							]
						}
					]
				}
			]
		};

		var renderACDiploma3 = {
			"$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
			"type": "AdaptiveCard",
			"version": "1.0",
			"body": [{
					"type": "TextBlock",
					"text": "Дипломы",
					"size": "medium",
					"weight": "default",
					"wrap": true,
					"spacing": "none"
				}, {
					"type": "TextBlock",
					"text": "1 место в районной олимпиаде по английскому языку среди 9-x классов.",
					"size": "default",
					"wrap": true
				}, {
					"type": "ColumnSet",
					"columns": [{
							"type": "Column",
							"width": 1,
							"items": [{
									"type": "Image",
									"altText": "",
									"url": "./libs/serguei-uwp/img/shimanskybiz-instagram/@1x/9d063d1fec85960f81275a0ed1f1529b.jpg",
									"size": "stretch",
									"selectAction": {
										"type": "Action.OpenUrl",
										"title": "Показать картинку",
										"url": "./libs/serguei-uwp/img/shimanskybiz-instagram/@2x/9d063d1fec85960f81275a0ed1f1529b.jpg"
									}
								}
							]
						}
					]
				}
			]
		};

		var renderACDiploma4 = {
			"$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
			"type": "AdaptiveCard",
			"version": "1.0",
			"body": [{
					"type": "TextBlock",
					"text": "Дипломы",
					"size": "medium",
					"weight": "default",
					"wrap": true,
					"spacing": "none"
				}, {
					"type": "TextBlock",
					"text": "1 место в районной олимпиаде по английскому языку среди 10-x классов.",
					"size": "default",
					"wrap": true
				}, {
					"type": "ColumnSet",
					"columns": [{
							"type": "Column",
							"width": 1,
							"items": [{
									"type": "Image",
									"altText": "",
									"url": "./libs/serguei-uwp/img/shimanskybiz-instagram/@1x/799463f7476954257d5b45671dc76e0b.jpg",
									"size": "stretch",
									"selectAction": {
										"type": "Action.OpenUrl",
										"title": "Показать картинку",
										"url": "./libs/serguei-uwp/img/shimanskybiz-instagram/@2x/799463f7476954257d5b45671dc76e0b.jpg"
									}
								}
							]
						}
					]
				}
			]
		};

		var renderACContacts = {
			"$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
			"type": "AdaptiveCard",
			"version": "1.0",
			"body": [{
					"type": "TextBlock",
					"text": "Контакты",
					"size": "medium",
					"weight": "default",
					"wrap": true,
					"spacing": "none"
				}, {
					"type": "ColumnSet",
					"columns": [{
							"type": "Column",
							"width": 1,
							"items": [{
									"type": "Image",
									"altText": "",
									"url": "./libs/serguei-uwp/img/sprite-contacts/@1x/sprite-contacts-banner-email-640x640.png",
									"size": "stretch",
									"style": "person",
									"selectAction": {
										"type": "Action.OpenUrl",
										"title": "Мейл",
										"url": "mailto:englishextra2%40yahoo.com"
									}
								}
							]
						}, {
							"type": "Column",
							"width": 1,
							"items": [{
									"type": "Image",
									"altText": "",
									"url": "./libs/serguei-uwp/img/sprite-contacts/@1x/sprite-contacts-banner-phone-640x640.png",
									"size": "stretch",
									"style": "person",
									"selectAction": {
										"type": "Action.OpenUrl",
										"title": "Телефон",
										"url": "tel:%2B79854416702"
									}
								}
							]
						}, {
							"type": "Column",
							"width": 1,
							"items": [{
									"type": "Image",
									"altText": "",
									"url": "./libs/serguei-uwp/img/sprite-contacts/@1x/sprite-contacts-banner-telegram-640x640.png",
									"size": "stretch",
									"style": "person",
									"selectAction": {
										"type": "Action.OpenUrl",
										"title": "Телеграм",
										"url": "tg://resolve?domain=english_tushino"
									}
								}
							]
						}, {
							"type": "Column",
							"width": 1,
							"items": [{
									"type": "Image",
									"altText": "",
									"url": "./libs/serguei-uwp/img/sprite-contacts/@1x/sprite-contacts-banner-viber-640x640.png",
									"size": "stretch",
									"style": "person",
									"selectAction": {
										"type": "Action.OpenUrl",
										"title": "Вайбер",
										"url": "viber://chat?number=%2B79854416702"
									}
								}
							]
						}, {
							"type": "Column",
							"width": 1,
							"items": [{
									"type": "Image",
									"altText": "",
									"url": "./libs/serguei-uwp/img/sprite-contacts/@1x/sprite-contacts-banner-whatsapp-640x640.png",
									"size": "stretch",
									"style": "person",
									"selectAction": {
										"type": "Action.OpenUrl",
										"title": "Вотсап",
										"url": "whatsapp://send?phone=79854416702"
									}
								}
							]
						}, {
							"type": "Column",
							"width": 1,
							"items": [{
									"type": "Image",
									"altText": "",
									"url": "./libs/serguei-uwp/img/sprite-contacts/@1x/sprite-contacts-banner-skype-640x640.png",
									"size": "stretch",
									"style": "person",
									"selectAction": {
										"type": "Action.OpenUrl",
										"title": "Скайп",
										"url": "skype:serguei.shimansky?chat"
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
		 * @see {@link https://docs.microsoft.com/en-us/adaptive-cards/rendering-cards/host-config}
		 * @see {@link https://docs.microsoft.com/en-us/adaptive-cards/rendering-cards/host-config#adaptivecardconfig}
		 * @see {@link https://github.com/Microsoft/AdaptiveCards/pull/905}
		 * @see {@link https://github.com/Microsoft/AdaptiveCards/issues/1929}
		 * @see {@link https://material.io/tools/color/#!/?view.left=0&view.right=0&secondary.color=BDBDBD&primary.color=F06292}
		 */
		var renderACOptions = {
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
							"default": "#0288d1",
							"subtle": "#29B6F6"
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

		var macyItems = [
			renderACVCard,
			renderACIntro,
			renderACBackground,
			renderACInPerson,
			renderACDiploma1,
			renderACDiploma2,
			renderACDiploma3,
			renderACDiploma4,
			renderACContacts
		];

		var onExecuteAC = function (action) {
			if (action.url) {
				root[location].href = action.url;
			}
		};

		var manageAC = function (macy, callback) {
			if (root.renderAC) {
				var count = 0;
				var i,
				l;
				for (i = 0, l = macyItems[_length]; i < l; i += 1) {
					renderAC(macy, macyItems[i], renderACOptions, onExecuteAC, null);
					count++;
					if (count === macyItems[_length]) {
						if (callback && "function" === typeof callback) {
							callback();
						}
					}
				}
				i = l = null;
			}
		};

		var imgLightboxLinkClass = "img-lightbox-link";

		/*!
		 * @see {@link https://github.com/englishextra/img-lightbox}
		 */
		var manageImgLightbox = function (imgLightboxLinkClass) {
			var initScript = function () {
				var link = document[getElementsByClassName](imgLightboxLinkClass) || "";
				if (link) {
					imgLightbox(imgLightboxLinkClass, {
						onLoaded: function () {
							LoadingSpinner.hide();
						},
						onClosed: function () {
							LoadingSpinner.hide();
						},
						onCreated: function () {
							LoadingSpinner.show();
						},
						touch: false
					});
				}
			};
			if (!root.imgLightbox) {
				var load;
				load = new loadJsCss(["./cdn/img-lightbox/0.2.3/css/img-lightbox.fixed.min.css",
							"./cdn/img-lightbox/0.2.3/js/img-lightbox.fixed.min.js"], initScript);
			} else {
				initScript();
			}
		};

		var dataSrcLazyClass = "data-src-lazy";

		/*!
		 * @see {@link https://github.com/verlok/lazyload}
		 */
		var manageLazyLoad = function (dataSrcLazyClass) {
			if (root.LazyLoad) {
				var lzld;
				lzld = new LazyLoad({
						elements_selector: "." + dataSrcLazyClass
					});
			}
		};

		/*!
		 * @see {@link https://imagesloaded.desandro.com/}
		 * Triggered after all images have been either loaded or confirmed broken.
		 */
		var onImagesLoaded = function (macy) {
			if (root.imagesLoaded) {
				var imgLoad;
				imgLoad = new imagesLoaded(macy);
				var onAlways = function (instance) {
					if (root.updateMacyThrottled) {
						updateMacyThrottled();
					}
					console.log("imagesLoaded: found " + instance.images[_length] + " images");
				};
				imgLoad.on("always", onAlways);
			}
		};

		var anyResizeEventIsBindedClass = "any-resize-event--is-binded";

		var macyClass = "macy";

		var macy = document[getElementsByClassName](macyClass)[0] || "";

		var macyIsActiveClass = "is-active";

		var onMacyRender = function () {
			macy[classList].add(macyIsActiveClass);
			onImagesLoaded(macy);
			manageLazyLoad(dataSrcLazyClass);
			manageExternalLinkAll();
			manageImgLightbox(imgLightboxLinkClass);
			manageReadMore(null, {
				target: ".dummy",
				numOfWords: 10,
				toggle: true,
				moreLink: "БОЛЬШЕ",
				lessLink: "МЕНЬШЕ",
				inline: true,
				customBlockElement: "p"
			});
		};

		var onMacyResize = function () {
			try {
				var container = macy ? (macy.children || macy[querySelectorAll]("." + macyClass + " > *") || "") : "";
				if (container) {
					var i,
					l;
					for (i = 0, l = container[_length]; i < l; i += 1) {
						if (!container[i][classList].contains(anyResizeEventIsBindedClass)) {
							container[i][classList].add(anyResizeEventIsBindedClass);
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
			manageMacy(macyClass, {
				trueOrder: false,
				waitForImages: false,
				margin: 20,
				columns: 3,
				breakAt: {
					1280: 3,
					1024: 3,
					960: 2,
					640: 2,
					480: 1,
					360: 1
				}
			});
			onMacyRender();
			onMacyResize();
		};

		/* var macyItems = [
		]; */

		var macyItemIsRenderedClass = "macy__item--is-rendered";

		var addMacyItems = function (macy, callback) {
			if (root.AdaptiveCards) {
				macy.innerHTML = "";
				manageAC(macy, callback);
			} else {
				/*!
				 * @see {@link https://stackoverflow.com/questions/18393981/append-vs-html-vs-innerhtml-performance}
				 */
				/* var html = [];
				var count = 0;
				var i,
				l;
				for (i = 0, l = macyItems[_length]; i < l; i += 1) {
					html.push(macyItems[i]);
					count++;
					if (count === macyItems[_length]) {
						macy.innerHTML = html.join("");
						if (callback && "function" === typeof callback) {
							callback();
						}
					}
				}
				i = l = null; */
				macyItems = document[getElementsByClassName]("col") || "";
				var count = 0;
				var i,
				l;
				for (i = 0, l = macyItems[_length]; i < l; i += 1) {
					macyItems[i][classList].add(macyItemIsRenderedClass);
					count++;
					if (count === macyItems[_length]) {
						if (callback && "function" === typeof callback) {
							callback();
						}
					}
				}
				i = l = null;
			}
		};

		if (macy) {

			addMacyItems(macy, onMacyManage);
		}

		if (root.manageExternalLinkAll) {
			manageExternalLinkAll();
		}
	};
})("undefined" !== typeof window ? window : this, document);
