/*!
 * @see {@link https://github.com/mildrenben/surface/blob/master/gulpfile.js}
 */
// gulpfile.js
var gulp = require("gulp"),
bundle = require("gulp-bundle-assets"),
sass = require("gulp-sass"),
autoprefixer = require("gulp-autoprefixer"),
minifyCss = require("gulp-minify-css"),
browserSync = require("browser-sync").create(),
reload = browserSync.reload,
babel = require("gulp-babel"),

uwp = {
	scss: "../../cdn/uwp-web-framework/2.0/scss/uwp.style.fixed.scss",
	css: "../../cdn/uwp-web-framework/2.0/css/uwp.style.fixed.css"
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
	scss: "../../cdn/highlight.js/9.12.0/scss/hljs.scss",
	css: "../../cdn/highlight.js/9.12.0/css"
};

gulp.task("browser-sync", ["bundle-assets"], function () {
	browserSync.init({
		server: "../../"
	});

	//gulp.watch("./bower_components/mui/src/sass/**/*.scss", ["compile-uwp-scss"]);
	//gulp.watch("../../fonts/material-design-icons/3.0.1/scss/**/*.scss", ["compile-material-scss"]);
	//gulp.watch("../../fonts/MaterialDesign-Webfont/2.2.43/scss/**/*.scss", ["compile-material-scss"]);
	//gulp.watch("../../fonts/roboto-fontfacekit/2.137/scss/**/*.scss", ["compile-roboto-scss"]);
	//gulp.watch("../../fonts/roboto-mono-fontfacekit/2.0.986/scss/**/*.scss", ["compile-roboto-mono-scss"]);
	//gulp.watch("../../cdn/highlight.js/9.12.0/scss/**/*.scss", ["compile-highlightjs-scss"]);
	gulp.watch("../../**/*.html").on("change", reload);
	gulp.watch("../../libs/serguei-uwp/js/*.js").on("change", reload);
	gulp.watch("../../libs/serguei-uwp/js/include-script/*.js").on("change", reload);
	gulp.watch("../../libs/serguei-uwp/json/*.json").on("change", reload);
	gulp.watch("../../libs/serguei-uwp/css/*.css").on("change", reload);
});

gulp.task("compile-uwp-web-framework-scss", function () {
	gulp.src(uwp.scss)
	.pipe(sass({
			errLogToConsole: true
		}))
	.pipe(autoprefixer({
			browsers: ["last 2 versions"]
		}))
	.pipe(minifyCss())
	.pipe(gulp.dest(uwp.css))
	.pipe(reload({
			stream: true
		}));
});

gulp.task("compile-material-scss", function () {
	gulp.src(material.scss)
	.pipe(sass({
			errLogToConsole: true
		}))
	.pipe(autoprefixer({
			browsers: ["last 2 versions"]
		}))
	.pipe(minifyCss())
	.pipe(gulp.dest(material.css))
	.pipe(reload({
			stream: true
		}));
});

gulp.task("compile-roboto-scss", function () {
	gulp.src(roboto.scss)
	.pipe(sass({
			errLogToConsole: true
		}))
	.pipe(autoprefixer({
			browsers: ["last 2 versions"]
		}))
	.pipe(minifyCss())
	.pipe(gulp.dest(roboto.css))
	.pipe(reload({
			stream: true
		}));
});

gulp.task("compile-roboto-mono-scss", function () {
	gulp.src(robotomono.scss)
	.pipe(sass({
			errLogToConsole: true
		}))
	.pipe(autoprefixer({
			browsers: ["last 2 versions"]
		}))
	.pipe(minifyCss())
	.pipe(gulp.dest(robotomono.css))
	.pipe(reload({
			stream: true
		}));
});

gulp.task("compile-highlightjs-scss", function () {
	gulp.src(highlightjs.scss)
	.pipe(sass({
			errLogToConsole: true
		}))
	.pipe(autoprefixer({
			browsers: ["last 2 versions"]
		}))
	.pipe(minifyCss())
	.pipe(gulp.dest(highlightjs.css))
	.pipe(reload({
			stream: true
		}));
});

gulp.task("babel-uwp-web-framework-js", function () {
	gulp.src("../../cdn/uwp-web-framework/2.0/src/uwp.core.fixed.js")
	.pipe(babel({
			presets: ["@babel/env"],
			plugins: ["@babel/plugin-transform-object-assign"]
		}))
	.pipe(gulp.dest("../../cdn/uwp-web-framework/2.0/js/"));
});

gulp.task("bundle-assets", function () {
	return gulp.src("./gulp-bundle-assets.config.js")
	.pipe(bundle())
	.pipe(bundle.results("./")) // arg is destination of bundle.result.json
	.pipe(gulp.dest("./"));
});

gulp.task("default", ["browser-sync"]);
