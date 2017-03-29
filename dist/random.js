'use strict';

var opts = require('./option-manager').options;

var randomInt = function randomInt(min, max) {
	return Math.round(min + Math.random() * (max - min));
};

var stripCharsFromString = function stripCharsFromString(string, chars) {
	return string.split('').filter(function (char) {
		return chars.indexOf(char) === -1;
	});
};

exports.int = randomInt;

exports.greyColor = function (min, max) {
	min = min || 1;
	max = max || 9;
	var int = randomInt(min, max).toString(16);

	return '#' + int + int + int;
};

exports.captchaText = function (options) {
	if (typeof options === 'number') {
		options = { size: options };
	}
	options = options || {};

	var size = options.size || 4;
	var ignoreChars = options.ignoreChars || '';
	var i = -1;
	var out = '';
	var chars = opts.charPreset;

	if (ignoreChars) {
		chars = stripCharsFromString(chars, ignoreChars);
	}

	var len = chars.length - 1;

	while (++i < size) {
		out += chars[randomInt(0, len)];
	}

	return out;
};

/**
 * Returns an object that has the following props:
 * text, equation
 */
exports.mathExpr = function () {
	var left = randomInt(1, 9);
	var right = randomInt(1, 9);
	var text = (left + right).toString();
	var equation = left + '+' + right;

	return { text: text, equation: equation };
};

// https://github.com/jquery/jquery-color/blob/master/jquery.color.js#L432
// The idea here is generate color in hsl first and convert that to rgb color
exports.color = function (bgColor) {
	// Random 24 colors
	// or based on step
	var hue = randomInt(0, 24) / 24;

	var saturation = randomInt(60, 80) / 100;
	var bgLightness = bgColor ? getLightness(bgColor) : 1.0;
	var minLightness = void 0;
	var maxLightness = void 0;
	if (bgLightness >= 0.5) {
		minLightness = Math.round(bgLightness * 100) - 45;
		maxLightness = Math.round(bgLightness * 100) - 25;
	} else {
		minLightness = Math.round(bgLightness * 100) + 25;
		maxLightness = Math.round(bgLightness * 100) + 45;
	}
	var lightness = randomInt(minLightness, maxLightness) / 100;

	var q = lightness < 0.5 ? lightness * (lightness + saturation) : lightness + saturation - lightness * saturation;
	var p = 2 * lightness - q;

	var r = Math.floor(hue2rgb(p, q, hue + 1 / 3) * 255);
	var g = Math.floor(hue2rgb(p, q, hue) * 255);
	var b = Math.floor(hue2rgb(p, q, hue - 1 / 3) * 255);
	/* eslint-disable no-mixed-operators */
	var c = (b | g << 8 | r << 16 | 1 << 24).toString(16).slice(1);

	return '#' + c;
};

function getLightness(rgbColor) {
	if (rgbColor[0] !== '#') {
		return 1.0; // Invalid color ?
	}
	rgbColor = rgbColor.slice(1);
	if (rgbColor.length === 3) {
		rgbColor = rgbColor[0] + rgbColor[0] + rgbColor[1] + rgbColor[1] + rgbColor[2] + rgbColor[2];
	}

	var hexColor = parseInt(rgbColor, 16);
	var r = hexColor >> 16;
	var g = hexColor >> 8 & 255;
	var b = hexColor & 255;
	var max = Math.max(r, g, b);
	var min = Math.min(r, g, b);

	return (max + min) / (2 * 255);
}

function hue2rgb(p, q, h) {
	h = (h + 1) % 1;
	if (h * 6 < 1) {
		return p + (q - p) * h * 6;
	}
	if (h * 2 < 1) {
		return q;
	}
	if (h * 3 < 2) {
		return p + (q - p) * (2 / 3 - h) * 6;
	}
	return p;
}