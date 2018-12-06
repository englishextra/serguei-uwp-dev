/*global require */
/*!
 * @see {@link https://github.com/mildrenben/surface/blob/master/gulpfile.js}
 * @see {@link https://www.webstoemp.com/blog/gulp-setup/}
 * @see {@link https://gulpjs.com/plugins/blackList.json}
 * @see {@link https://hackernoon.com/how-to-automate-all-the-things-with-gulp-b21a3fc96885}
 */
var gulp = require("gulp"),
sass = require("gulp-sass"),
autoprefixer = require("gulp-autoprefixer"),
autoprefixerOptions = {
	browsers: ["last 2 versions"]
},
minifyCss = require("gulp-minify-css"),
uglify = require("gulp-uglify"),
sourcemaps = require('gulp-sourcemaps'),
rename = require("gulp-rename"),
bundle = require("gulp-bundle-assets"),
browserSync = require("browser-sync").create(),
reload = browserSync.reload,
/* path = require("path"), */
/*!
 * @see {@link https://github.com/babel/babel/issues/7910}
 */
babel = require("gulp-babel"),
babelOptions = {
	"sourceType": "script",
	"presets": ["@babel/env"],
	"plugins": ["@babel/plugin-transform-object-assign",
		"@babel/plugin-transform-arrow-functions",
		"@babel/plugin-transform-async-to-generator"]
},
/*!
 * @see {@link https://github.com/beautify-web/js-beautify}
 * a JSON-formatted file indicated by the --config parameter
 * a .jsbeautifyrc file containing JSON data at any level of the filesystem above $PWD
 * using external config may cause
 * failure to find it
 * if the input/output files reside higher
 * than the config file itself
 */
/* beautifyOptions = {
"config": ".jsbeautifyrc"
}, */
beautify = require("gulp-jsbeautifier"),
beautifyOptions = {
	"editorconfig": false,
	"indent_size": 4,
	"indent_char": "\t",
	"indent_with_tabs": true,
	"eol": "\n",
	"end_with_newline": true,
	"indent_level": 0,
	"preserve_newlines": true,
	"max_preserve_newlines": 10,
	"html": {
		"indent_inner_html": true,
		"indent_scripts": false,
		"js": {},
		"css": {}
	},
	"css": {
		"newline_between_rules": true
	},
	"js": {
		"space_in_paren": false,
		"space_in_empty_paren": false,
		"jslint_happy": false,
		"space_after_anon_function": true,
		"space_after_named_function": false,
		"brace_style": "collapse",
		"unindent_chained_methods": false,
		"break_chained_methods": true,
		"keep_array_indentation": true,
		"unescape_strings": false,
		"wrap_line_length": 0,
		"e4x": false,
		"comma_first": false,
		"operator_position": "before-newline"
	}
},
/*!
 * @see {@link https://prettier.io/docs/en/options.html}
 * using external config may cause
 * failure to find it
 * if the input/output files reside higher
 * than the config file itself
 */
/* prettierOptions = {
"config": ".prettierrc"
} */
/* prettier = require("gulp-prettier"),
prettierOptions = {
"tabWidth": 4,
"useTabs": true,
"endOfLine": "lf",
"printWidth:": 0
}, */

concat = require("gulp-concat"),

uwp = {
	src: "../../cdn/uwp-web-framework/2.0/src/uwp.core.fixed.js",
	js: "../../cdn/uwp-web-framework/2.0/js",
	scss: "../../cdn/uwp-web-framework/2.0/scss/uwp.style.fixed.scss",
	css: "../../cdn/uwp-web-framework/2.0/css"
},

/* material = {
scss: "../../fonts/material-design-icons/3.0.1/scss/material-icons.scss",
css: "../../fonts/material-design-icons/3.0.1/css"
}, */

material = {
	scss: "../../fonts/MaterialDesign-Webfont/2.2.43/scss/materialdesignicons.scss",
	css: "../../fonts/MaterialDesign-Webfont/2.2.43/css"
},

roboto = {
	scss: "../../fonts/roboto-fontfacekit/2.137/scss/roboto.scss",
	css: "../../fonts/roboto-fontfacekit/2.137/css"
},

robotomono = {
	scss: "../../fonts/roboto-mono-fontfacekit/2.0.986/scss/roboto-mono.scss",
	css: "../../fonts/roboto-mono-fontfacekit/2.0.986/css"
},

highlightjs = {
	src: "../../cdn/highlight.js/9.12.0/src/*.js",
	js: "../../cdn/highlight.js/9.12.0/js",
	scss: "../../cdn/highlight.js/9.12.0/scss/*.scss",
	css: "../../cdn/highlight.js/9.12.0/css"
},

typeboost = {
	scss: "../../cdn/typeboost-uwp.css/0.1.8/scss/typeboost-uwp.scss",
	css: "../../cdn/typeboost-uwp.css/0.1.8/css"
},

glightbox = {
	src: "../../cdn/glightbox/1.0.8/src/*.js",
	js: "../../cdn/glightbox/1.0.8/js",
	scss: "../../cdn/glightbox/1.0.8/scss/*.scss",
	css: "../../cdn/glightbox/1.0.8/css"
},

lightgalleryjs = {
	src: "../../cdn/lightgallery.js/1.1.1/src/*.js",
	js: "../../cdn/lightgallery.js/1.1.1/js",
	scss: "../../cdn/lightgallery.js/1.1.1/scss/*.scss",
	css: "../../cdn/lightgallery.js/1.1.1/css"
},

includeStyle = {
	scss: "./css/include-style/scss/*.scss",
	css: "./css/include-style"
},

includeScript = {
	src: "./js/include-script/src/*.js",
	js: "./js/include-script"
},

libbundle = {
	src: "./src/bundle.js",
	js: "./js",
	scss: "./scss/bundle.scss",
	css: "./css"
},

vendors = {
	src: [
		"../../cdn/imagesloaded/4.1.4/js/imagesloaded.pkgd.fixed.js",
		"../../cdn/lazyload/10.19.0/js/lazyload.iife.fixed.js",
		"../../cdn/ReadMore.js/1.0.0/js/readMoreJS.fixed.js",
		"../../cdn/uwp-web-framework/2.0/js/uwp.core.fixed.js",
		"../../cdn/resize/1.0.0/js/any-resize-event.fixed.js",
		"../../cdn/macy.js/2.3.1/js/macy.fixed.js"
	],
	js: "./js",
	scss: [
		"../../fonts/roboto-fontfacekit/2.137/css/roboto.css",
		"../../fonts/roboto-mono-fontfacekit/2.0.986/css/roboto-mono.css",
		"../../cdn/typeboost-uwp.css/0.1.8/css/typeboost-uwp.css",
		"../../cdn/uwp-web-framework/2.0/css/uwp.style.fixed.css"
	],
	css: "./css"
},
vendorsCssOptions = {
	path: "vendors.css",
	newLine: "\n"
},
vendorsJsOptions = {
	path: "vendors.js",
	newLine: "\n"
};

gulp.task("browser-sync", [
		//"bundle-assets"
	], function () {
	browserSync.init({
		server: "../../"
	});

	//gulp.watch("./bower_components/mui/src/sass/**/*.scss", ["compile-uwp-scss"]);
	//gulp.watch("../../fonts/material-design-icons/3.0.1/scss/**/*.scss", ["compile-material-scss"]);
	//gulp.watch("../../fonts/MaterialDesign-Webfont/2.2.43/scss/**/*.scss", ["compile-material-scss"]);
	//gulp.watch("../../fonts/roboto-fontfacekit/2.137/scss/**/*.scss", ["compile-roboto-scss"]);
	//gulp.watch("../../fonts/roboto-mono-fontfacekit/2.0.986/scss/**/*.scss", ["compile-roboto-mono-scss"]);
	//gulp.watch("../../cdn/highlight.js/9.12.0/scss/**/*.scss", ["compile-highlightjs-css"]);
	gulp.watch("../../**/*.html").on("change", reload);
	gulp.watch("../../libs/serguei-uwp/css/*.css").on("change", reload);
	gulp.watch("../../libs/serguei-uwp/css/include-style/*.css").on("change", reload);
	gulp.watch("../../libs/serguei-uwp/css/include-style/scss/*.scss", ["compile-include-style-css"]);
	gulp.watch("../../libs/serguei-uwp/scss/*.scss", ["compile-libbundle-css"]);
	gulp.watch("../../libs/serguei-uwp/js/*.js").on("change", reload);
	gulp.watch("../../libs/serguei-uwp/js/include-script/*.js").on("change", reload);
	gulp.watch("../../libs/serguei-uwp/js/include-script/src/*.js", ["compile-include-script-js"]);
	gulp.watch("../../libs/serguei-uwp/src/*.js", ["compile-libbundle-js"]);
	gulp.watch("../../libs/serguei-uwp/json/*.json").on("change", reload);
});

gulp.task("compile-material-css", function () {
	gulp.src(material.scss)
	.pipe(sourcemaps.init())
	.pipe(sass({
			errLogToConsole: true
		}))
	.pipe(autoprefixer(autoprefixerOptions))
	/* .pipe(prettier(prettierOptions)) */
	.pipe(beautify(beautifyOptions))
	.pipe(gulp.dest(material.css))
	.pipe(rename(function (path) {
			path.basename += ".min";
		}))
	.pipe(minifyCss())
	.pipe(sourcemaps.write("."))
	.pipe(gulp.dest(material.css))
	.pipe(reload({
			stream: true
		}));
});

gulp.task("compile-roboto-css", function () {
	gulp.src(roboto.scss)
	.pipe(sourcemaps.init())
	.pipe(sass({
			errLogToConsole: true
		}))
	.pipe(autoprefixer(autoprefixerOptions))
	/* .pipe(prettier(prettierOptions)) */
	.pipe(beautify(beautifyOptions))
	.pipe(gulp.dest(roboto.css))
	.pipe(rename(function (path) {
			path.basename += ".min";
		}))
	.pipe(minifyCss())
	.pipe(sourcemaps.write("."))
	.pipe(gulp.dest(roboto.css))
	.pipe(reload({
			stream: true
		}));
});

gulp.task("compile-roboto-mono-css", function () {
	gulp.src(robotomono.scss)
	.pipe(sourcemaps.init())
	.pipe(sass({
			errLogToConsole: true
		}))
	.pipe(autoprefixer(autoprefixerOptions))
	/* .pipe(prettier(prettierOptions)) */
	.pipe(beautify(beautifyOptions))
	.pipe(gulp.dest(robotomono.css))
	.pipe(rename(function (path) {
			path.basename += ".min";
		}))
	.pipe(minifyCss())
	.pipe(sourcemaps.write("."))
	.pipe(gulp.dest(robotomono.css))
	.pipe(reload({
			stream: true
		}));
});

gulp.task("compile-libbundle-css", function () {
	gulp.src(libbundle.scss)
	.pipe(sourcemaps.init())
	.pipe(sass({
			errLogToConsole: true
		}))
	.pipe(autoprefixer(autoprefixerOptions))
	/* .pipe(prettier(prettierOptions)) */
	.pipe(beautify(beautifyOptions))
	.pipe(gulp.dest(libbundle.css))
	.pipe(rename(function (path) {
			path.basename += ".min";
		}))
	.pipe(minifyCss())
	.pipe(sourcemaps.write("."))
	.pipe(gulp.dest(libbundle.css))
	.pipe(reload({
			stream: true
		}));
});

gulp.task("compile-libbundle-js", function () {
	gulp.src(libbundle.src)
	.pipe(sourcemaps.init())
	.pipe(babel(babelOptions))
	/* .pipe(prettier(prettierOptions)) */
	.pipe(beautify(beautifyOptions))
	.pipe(gulp.dest(libbundle.js))
	.pipe(rename(function (path) {
			path.basename += ".min";
		}))
	.pipe(uglify())
	.pipe(sourcemaps.write("."))
	.pipe(gulp.dest(libbundle.js))
	.pipe(reload({
			stream: true
		}));
});

gulp.task("compile-include-style-css", function () {
	gulp.src(includeStyle.scss)
	.pipe(sourcemaps.init())
	.pipe(sass({
			errLogToConsole: true
		}))
	.pipe(autoprefixer(autoprefixerOptions))
	/* .pipe(prettier(prettierOptions)) */
	.pipe(beautify(beautifyOptions))
	.pipe(gulp.dest(includeStyle.css))
	.pipe(rename(function (path) {
			path.basename += ".min";
		}))
	.pipe(minifyCss())
	.pipe(sourcemaps.write("."))
	.pipe(gulp.dest(includeStyle.css))
	.pipe(reload({
			stream: true
		}));
});

gulp.task("compile-include-script-js", function () {
	gulp.src(includeScript.src)
	.pipe(sourcemaps.init())
	.pipe(babel(babelOptions))
	/* .pipe(prettier(prettierOptions)) */
	.pipe(beautify(beautifyOptions))
	.pipe(gulp.dest(includeScript.js))
	.pipe(rename(function (path) {
			path.basename += ".min";
		}))
	.pipe(uglify())
	.pipe(sourcemaps.write("."))
	.pipe(gulp.dest(includeScript.js))
	.pipe(reload({
			stream: true
		}));
});

gulp.task("compile-vendors-css", function () {
	gulp.src(vendors.scss)
	.pipe(sourcemaps.init())
	.pipe(sass({
			errLogToConsole: true
		}))
	.pipe(autoprefixer(autoprefixerOptions))
	/* .pipe(prettier(prettierOptions)) */
	.pipe(beautify(beautifyOptions))
	.pipe(concat(vendorsCssOptions))
	.pipe(gulp.dest(vendors.css))
	.pipe(rename(function (path) {
			path.basename += ".min";
		}))
	.pipe(minifyCss())
	.pipe(sourcemaps.write("."))
	.pipe(gulp.dest(vendors.css))
	.pipe(reload({
			stream: true
		}));
});

gulp.task("compile-vendors-js", function () {
	gulp.src(vendors.src)
	.pipe(sourcemaps.init())
	.pipe(babel(babelOptions))
	/* .pipe(prettier(prettierOptions)) */
	.pipe(beautify(beautifyOptions))
	.pipe(concat(vendorsJsOptions))
	.pipe(gulp.dest(vendors.js))
	.pipe(rename(function (path) {
			path.basename += ".min";
		}))
	.pipe(uglify())
	.pipe(sourcemaps.write("."))
	.pipe(gulp.dest(vendors.js))
	.pipe(reload({
			stream: true
		}));
});

gulp.task("compile-typeboost-uwp-css", function () {
	gulp.src(typeboost.scss)
	.pipe(sourcemaps.init())
	.pipe(sass({
			errLogToConsole: true
		}))
	.pipe(autoprefixer(autoprefixerOptions))
	/* .pipe(prettier(prettierOptions)) */
	.pipe(beautify(beautifyOptions))
	.pipe(gulp.dest(typeboost.css))
	.pipe(rename(function (path) {
			path.basename += ".min";
		}))
	.pipe(minifyCss())
	.pipe(sourcemaps.write("."))
	.pipe(gulp.dest(typeboost.css))
	.pipe(reload({
			stream: true
		}));
});

gulp.task("compile-uwp-web-framework-css", function () {
	gulp.src(uwp.scss)
	.pipe(sourcemaps.init())
	.pipe(sass({
			errLogToConsole: true
		}))
	.pipe(autoprefixer(autoprefixerOptions))
	/* .pipe(prettier(prettierOptions)) */
	.pipe(beautify(beautifyOptions))
	.pipe(gulp.dest(uwp.css))
	.pipe(rename(function (path) {
			path.basename += ".min";
		}))
	.pipe(minifyCss())
	.pipe(sourcemaps.write("."))
	.pipe(gulp.dest(uwp.css))
	.pipe(reload({
			stream: true
		}));
});

gulp.task("compile-uwp-web-framework-js", function () {
	gulp.src(uwp.src)
	.pipe(sourcemaps.init())
	.pipe(babel(babelOptions))
	/* .pipe(prettier(prettierOptions)) */
	.pipe(beautify(beautifyOptions))
	.pipe(gulp.dest(uwp.js))
	.pipe(rename(function (path) {
			path.basename += ".min";
		}))
	.pipe(uglify())
	.pipe(sourcemaps.write("."))
	.pipe(gulp.dest(uwp.js))
	.pipe(reload({
			stream: true
		}));
});

gulp.task("compile-highlightjs-css", function () {
	gulp.src(highlightjs.scss)
	.pipe(sourcemaps.init())
	.pipe(sass({
			errLogToConsole: true
		}))
	.pipe(autoprefixer(autoprefixerOptions))
	/* .pipe(prettier(prettierOptions)) */
	.pipe(beautify(beautifyOptions))
	.pipe(gulp.dest(highlightjs.css))
	.pipe(rename(function (path) {
			path.basename += ".min";
		}))
	.pipe(minifyCss())
	.pipe(sourcemaps.write("."))
	.pipe(gulp.dest(highlightjs.css))
	.pipe(reload({
			stream: true
		}));
});

gulp.task("compile-highlightjs-js", function () {
	gulp.src(highlightjs.src)
	.pipe(sourcemaps.init())
	.pipe(babel(babelOptions))
	/* .pipe(prettier(prettierOptions)) */
	.pipe(beautify(beautifyOptions))
	.pipe(gulp.dest(highlightjs.js))
	.pipe(rename(function (path) {
			path.basename += ".min";
		}))
	.pipe(uglify())
	.pipe(sourcemaps.write("."))
	.pipe(gulp.dest(highlightjs.js))
	.pipe(reload({
			stream: true
		}));
});

gulp.task("compile-lightgalleryjs-css", function () {
	gulp.src(lightgalleryjs.scss)
	.pipe(sourcemaps.init())
	.pipe(sass({
			errLogToConsole: true
		}))
	.pipe(autoprefixer(autoprefixerOptions))
	/* .pipe(prettier(prettierOptions)) */
	.pipe(beautify(beautifyOptions))
	.pipe(gulp.dest(lightgalleryjs.css))
	.pipe(rename(function (path) {
			path.basename += ".min";
		}))
	.pipe(minifyCss())
	.pipe(sourcemaps.write("."))
	.pipe(gulp.dest(lightgalleryjs.css))
	.pipe(reload({
			stream: true
		}));
});

gulp.task("compile-lightgalleryjs-js", function () {
	gulp.src(lightgalleryjs.src)
	.pipe(sourcemaps.init())
	.pipe(babel(babelOptions))
	/* .pipe(prettier(prettierOptions)) */
	.pipe(beautify(beautifyOptions))
	.pipe(gulp.dest(lightgalleryjs.js))
	.pipe(rename(function (path) {
			path.basename += ".min";
		}))
	.pipe(uglify())
	.pipe(sourcemaps.write("."))
	.pipe(gulp.dest(lightgalleryjs.js))
	.pipe(reload({
			stream: true
		}));
});

gulp.task("compile-glightbox-css", function () {
	gulp.src(glightbox.scss)
	.pipe(sourcemaps.init())
	.pipe(sass({
			errLogToConsole: true
		}))
	.pipe(autoprefixer(autoprefixerOptions))
	/* .pipe(prettier(prettierOptions)) */
	.pipe(beautify(beautifyOptions))
	.pipe(gulp.dest(glightbox.css))
	.pipe(rename(function (path) {
			path.basename += ".min";
		}))
	.pipe(minifyCss())
	.pipe(sourcemaps.write("."))
	.pipe(gulp.dest(glightbox.css))
	.pipe(reload({
			stream: true
		}));
});

gulp.task("compile-glightbox-js", function () {
	gulp.src(glightbox.src)
	.pipe(sourcemaps.init())
	.pipe(babel(babelOptions))
	/* .pipe(prettier(prettierOptions)) */
	.pipe(beautify(beautifyOptions))
	.pipe(gulp.dest(glightbox.js))
	.pipe(rename(function (path) {
			path.basename += ".min";
		}))
	.pipe(uglify())
	.pipe(sourcemaps.write("."))
	.pipe(gulp.dest(glightbox.js))
	.pipe(reload({
			stream: true
		}));
});

gulp.task("bundle-assets", function () {
	return gulp.src("./gulp-bundle-assets.config.js")
	.pipe(bundle())
	.pipe(bundle.results("./")) // arg is destination of bundle.result.json
	.pipe(gulp.dest("./"));
});

gulp.task("default", ["browser-sync"]);
