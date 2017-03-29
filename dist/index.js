'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var chToPath = require('./ch-to-path');
var random = require('./random');
var optionMngr = require('./option-manager');

var opts = optionMngr.options;

var getLineNoise = function getLineNoise(width, height, options) {
	var hasColor = options.color;
	var noiseLines = [];
	var min = options.inverse ? 7 : 1;
	var max = options.inverse ? 15 : 9;
	var i = -1;

	while (++i < options.noise) {
		var start = random.int(1, 21) + ' ' + random.int(1, height - 1);
		var end = random.int(width - 21, width - 1) + ' ' + random.int(1, height - 1);
		var mid1 = random.int(width / 2 - 21, width / 2 + 21) + ' ' + random.int(1, height - 1);
		var mid2 = random.int(width / 2 - 21, width / 2 + 21) + ' ' + random.int(1, height - 1);
		var color = hasColor ? random.color() : random.greyColor(min, max);
		noiseLines.push('<path d="M' + start + ' C' + mid1 + ',' + mid2 + ',' + end + '" stroke="' + color + '" fill="none"/>');
	}

	return noiseLines;
};

var getText = function getText(text, width, height, options) {
	var len = text.length;
	var spacing = (width - 2) / (len + 1);
	var min = options.inverse ? 10 : 0;
	var max = options.inverse ? 14 : 4;
	var i = -1;
	var out = [];

	while (++i < len) {
		var x = spacing * (i + 1);
		var y = height / 2;
		var charPath = chToPath(text[i], _extends({ x: x, y: y }, options));

		var color = options.color ? random.color(options.background) : random.greyColor(min, max);
		out.push('<path fill="' + color + '" d="' + charPath + '"/>');
	}

	return out;
};

var createCaptcha = function createCaptcha(text, options) {
	text = text || random.captchaText();
	options = _extends({}, opts, options);
	var width = options.width;
	var height = options.height;
	var bg = options.background;
	if (bg) {
		options.color = true;
	}

	var bgRect = bg ? '<rect width="100%" height="100%" fill="' + bg + '"/>' : '';
	var paths = [].concat(getLineNoise(width, height, options)).concat(getText(text, width, height, options)).sort(function () {
		return Math.random() - 0.5;
	}).join('');
	var start = '<svg xmlns="http://www.w3.org/2000/svg" width="' + width + '" height="' + height + '">';
	var xml = '' + start + bgRect + paths + '</svg>';

	return xml;
};

var create = function create(options) {
	var text = random.captchaText(options);
	var data = createCaptcha(text, options);

	return { text: text, data: data };
};

var createMathExpr = function createMathExpr(options) {
	var expr = random.mathExpr();
	var text = expr.text;
	var data = createCaptcha(expr.equation, options);

	return { text: text, data: data };
};

module.exports = createCaptcha;
module.exports.randomText = random.captchaText;
module.exports.create = create;
module.exports.createMathExpr = createMathExpr;
module.exports.options = opts;
module.exports.loadFont = optionMngr.loadFont;