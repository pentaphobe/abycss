'use strict'

var StyleNode = require('../lib/StyleNode');

function Plugin(name) {
		this.name = name;
		this.root = null;
		this.current = null;
}
Plugin.prototype.apply = function(ast, src) {
	// console.err(`plugin ${this.name} doesn't implement apply()`);
	this.root = new StyleNode(ast);
	this.rules = this.root.data.stylesheet.rules;
}


module.exports = Plugin;