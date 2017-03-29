'use strict';

var assert = require('assert');

module.exports = function (text, opts) {
	var ch = text[0];
	assert(ch, 'expect a string');

	var fontSize = opts.fontSize;
	var fontScale = 1 / opts.font.unitsPerEm * fontSize;

	var glyph = opts.font.charToGlyph(ch);
	var width = glyph.advanceWidth ? glyph.advanceWidth * fontScale : 0;
	var left = opts.x - width / 2;

	var height = (opts.ascender + opts.descender) * fontScale;
	var top = opts.y + height / 2;
	var path = glyph.getPath(left, top, fontSize);

	var pathData = path.toPathData();

	return pathData;
};