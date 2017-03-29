'use strict';

var path = require('path');
var opentype = require('opentype.js');
var charPreset = require('./char-preset');

var fontPath = path.join(__dirname, '../fonts/Comismsh.ttf');
var font = opentype.loadSync(fontPath);
var ascender = font.ascender;
var descender = font.descender;

var options = {
	width: 150,
	height: 50,
	noise: 1,
	color: false,
	background: '',
	size: 4,
	ignoreChars: '',
	fontSize: 56,
	charPreset: charPreset, font: font, ascender: ascender, descender: descender
};

var loadFont = function loadFont(filepath) {
	var font = opentype.loadSync(filepath);
	options.font = font;
	options.ascender = font.ascender;
	options.descender = font.descender;
};

module.exports = {
	options: options, loadFont: loadFont
};