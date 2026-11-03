'use strict';

var Test = require('node:test');
var Assert = require('node:assert/strict');
var Fs = require('fs');
var Path = require('path');
var Os = require('os');
var Crypto = require('crypto');
var check = require('../scripts/check-sources').check;

Test.test('source identity check distinguishes matching, changed and missing files', function(t) {
	var root = Fs.mkdtempSync(Path.join(Os.tmpdir(), 'totaljs-sources-'));
	t.after(function() { Fs.rmSync(root, { recursive: true, force: true }); });
	var filename = Path.join(root, 'example.js');
	Fs.writeFileSync(filename, 'var value = 1;\n');
	var files = [{ root: 'apps', path: 'example.js', sha256: Crypto.createHash('sha256').update(Fs.readFileSync(filename)).digest('hex') }];
	Assert.deepEqual(check(files, { apps: root }), []);
	Fs.writeFileSync(filename, 'var value = 2;\n');
	Assert.match(check(files, { apps: root })[0], /changed since review/);
	Fs.unlinkSync(filename);
	Assert.match(check(files, { apps: root })[0], /cannot read/);
});

Test.test('source identity check rejects unavailable roots and paths outside a root', function() {
	Assert.match(check([{ root: 'apps', path: 'example.js' }], {})[0], /root not provided/);
	Assert.match(check([{ root: 'apps', path: '../outside.js' }], { apps: '/tmp/example' })[0], /outside source root/);
	Assert.match(check([{ root: 'apps', path: '/tmp/outside.js' }], { apps: '/tmp/example' })[0], /outside source root/);
});

Test.test('source manifest has distinct relative paths and SHA-256 hashes', function() {
	var manifest = require('../sources.json');
	var seen = {};
	Assert.ok(manifest.files.length > 0);
	manifest.files.forEach(function(item) {
		Assert.ok(['apps', 'framework'].indexOf(item.root) !== -1);
		Assert.ok(!Path.isAbsolute(item.path) && item.path.split('/').indexOf('..') === -1);
		Assert.match(item.sha256, /^[a-f0-9]{64}$/);
		var key = item.root + '/' + item.path;
		Assert.ok(!seen[key], key + ' is duplicated');
		seen[key] = true;
	});
});
