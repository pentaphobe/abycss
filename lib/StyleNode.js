'use strict';

/**
 * Provides convenience functions to wrap POJOs and provide navigation
 */
function StyleNode(pojo) {
	this.data = pojo.ast;
	this.src = pojo.src;
	// console.dir(this.data, {colors:true, depth:7});
}

StyleNode.prototype.isType = function(typeName) {
	return this.data.type === typeName;
}

StyleNode.prototype.get = function(path) {
	// currently just gonna use eval() for laziness, but should just parse it
	return new StyleNode(eval('this.' + path));
}


module.exports = StyleNode;