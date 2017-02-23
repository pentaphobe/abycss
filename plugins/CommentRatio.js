'use strict';

var Plugin = require('../lib/Plugin');

function CommentRatio () {
	Plugin.call(this, 'comment ratio');
}
CommentRatio.prototype.apply = function(ast, src) {
	Plugin.prototype.apply.call(this, ast);

	var lineCounts = {
	};

	this.rules
		.map(rule => {
			console.dir(rule, {colors:true, depth:5});
			var lineCounter = lineCounts[rule.type] || (lineCounts[rule.type] = 0);

			lineCounter += rule.position.end.line - rule.position.start.line;

			lineCounts[rule.type] = lineCounter;
		})

	console.dir(lineCounts, {colors:true, depth:2});
}


module.exports = CommentRatio;