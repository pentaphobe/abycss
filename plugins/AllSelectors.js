'use strict';

var Plugin = require('../lib/Plugin');

function AllSelectors () {
	Plugin.call(this, 'all selectors');

	this.selectorMap = {};
	this.globalStats = {
		totalDeclarations: 0,
		totalReferences: 0
	};
}

AllSelectors.prototype.get = function(selector) {
	let defaultObj = {
		// unnecessary values for convenience
		count: 0,
		refCount: 0,
		isCompoundOnly: false,

		// actual data
		declarations: [],
		references: []
	};	
	var selectorNode = this.selectorMap[selector] || (this.selectorMap[selector] = defaultObj );	

	return selectorNode;
};

/**
 * Process declaration with specific selector
 */
AllSelectors.prototype.bumpDeclaration = function(selector, data) {
	var selectorNode = this.get(selector);

	// console.log(`bumping selector ${selector}`);
	selectorNode.count += 1;
	selectorNode.isCompountOnly = false;
	selectorNode.declarations.push(data);
	this.globalStats.totalDeclarations += 1;
}

/** Process declaration with *any* reference to a selector (eg. compound selectors) */
AllSelectors.prototype.bumpReferences = function(selector, data) {
	var selectorParts = selector.split(/[\s,]+/);

	selectorParts.forEach( selectorName => {
		var selectorNode = this.get(selectorName);
		if (selectorNode.count == 0) {
			selectorNode.isCompountOnly = true;
		}
		selectorNode.refCount += 1;
		selectorNode.references.push(data);
		this.globalStats.totalReferences += 1;
	});
}



AllSelectors.prototype.apply = function(ast, src) {
	Plugin.prototype.apply.call(this, ast);
	this.rules
		.filter(rule => rule.type == 'rule')
		.map(rule => {
			// console.dir(rule, {colors:true, depth:5});
			rule.selectors.forEach( selector => {
				this.bumpDeclaration(selector, rule);
				this.bumpReferences(selector, rule);
			});
		})

	console.dir(this.globalStats, {colors:true, depth:2});
	// console.dir(this.selectorMap, {colors:true, depth:2});
}


module.exports = AllSelectors;