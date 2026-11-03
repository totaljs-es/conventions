'use strict';

// Standalone Node.js tool: checks reference snapshot identity, never edits the apps.
var Fs = require('fs');
var Path = require('path');
var Crypto = require('crypto');

exports.check = function(files, roots) {
	var errors = [];
	for (var i = 0; i < files.length; i++) {
		var item = files[i];
		var root = roots[item.root];
		if (!root) {
			errors.push(item.root + ': source root not provided');
			continue;
		}
		var filename = Path.resolve(root, item.path);
		var relative = Path.relative(Path.resolve(root), filename);
		if (Path.isAbsolute(item.path) || relative === '..' || relative.indexOf('..' + Path.sep) === 0 || Path.isAbsolute(relative)) {
			errors.push(item.path + ': path outside source root');
			continue;
		}
		try {
			var hash = Crypto.createHash('sha256').update(Fs.readFileSync(filename)).digest('hex');
			if (hash !== item.sha256)
				errors.push(item.root + '/' + item.path + ': changed since review');
		} catch (err) {
			errors.push(item.root + '/' + item.path + ': cannot read (' + err.code + ')');
		}
	}
	return errors;
};

if (require.main === module) {
	var args = process.argv.slice(2);
	var roots = {};
	for (var i = 0; i < args.length; i += 2) {
		if (['--apps', '--framework'].indexOf(args[i]) === -1 || !args[i + 1] || args[i + 1].indexOf('--') === 0) {
			console.error('Usage: node scripts/check-sources.js --apps /path/to/apps --framework /path/to/framework5');
			process.exit(2);
		}
		roots[args[i].substring(2)] = args[i + 1];
	}
	if (!roots.apps || !roots.framework) {
		console.error('Provide both --apps and --framework source roots.');
		process.exit(2);
	}
	var manifest = require('../sources.json');
	var errors = exports.check(manifest.files, roots);
	if (errors.length) {
		console.error(errors.join('\n'));
		process.exitCode = 1;
	} else
		console.log(manifest.files.length + ' reference files match the reviewed snapshots; this is not an app correctness check.');
}
