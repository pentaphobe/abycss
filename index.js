#!/usr/bin/env node --harmony

'use strict';

let 
		fs = require('fs'),
		path = require('path'),
		program = require('commander'),
		glob = require('glob'),
		_ = require('lodash'),
		css = require('css'),

		defaultOptions = {
			globPattern: '**/*.css',
			dryRun: true,		// perform all actions, but don't write to the filesystem
			quiet: false,		// whether to post updates to the console, or just shut up unless there are errors
		},
		options = _.extend({}, defaultOptions);

function exception(message, opts) {
	return {
		message,
		opts
	};
}

function parse(filename) {
	if (!fs.existsSync(filename)) {
		throw exception('file not found', {filename: filename});
	}

	let 
			src = fs.readFileSync(filename, {encoding:'utf8'}),
			ast = css.parse(src);

	return {
		src,
		ast
	};
}

function makeSearcher(matchPattern, replacers) {
	return function (filename) {
		if (!fs.existsSync(filename)) {
			throw exception("file not found", {filename: filename});
		}
		let src = fs.readFileSync(filename, {encoding:'utf8'});
		let match = matcher(src);

		if (match) {
			let document = match.document.html();

			if (!options.dryRun) {
				fs.writeFileSync(filename, document, {encoding:'utf8'});
			}

			if (!options.quiet) {
				console.log(`changed ${filename}`);
			}

			if (options.dumpContent) {
				console.log(document);
			}

			return {
				filename,				
				document
			}
		}
		return null;
	};
}

function buildFileList(root, options) {
	return glob.sync(options.globPattern, {
		cwd: root,
		nosort: true		
	});
}

program
	.arguments('<root>')
	.action(function (root, env) {
		let files = buildFileList(root, options);
		
		let plugins = [
			'AllSelectors',
			'CommentRatio'
		].reduce( (all, plugName) => {
			// node strips the leading './' if it's local
			var Plug = require('.' + path.sep + path.join('plugins', plugName));
			all[plugName] = new Plug();

			return all;
		}, {});

		console.log(plugins);

		files.forEach( fname => {			
			let parsed = parse( path.join(root, fname) );
			Object.getOwnPropertyNames(plugins).forEach( pluginName => {
				var plugin = plugins[pluginName];
				console.log(`applying plugin ${pluginName}`);
				plugin.apply(parsed);
				// console.dir(plugin.apply(parsed), {colors: true, depth: 5});
			});
			// console.dir(parsed.ast, {colors: true, depth:5});
		});
		// files = files.map(makeSearcher(find, replacers)).filter( v => v !== null );
	});

program.parse(process.argv);
