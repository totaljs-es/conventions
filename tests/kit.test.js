'use strict';

// The files for agents and models: AGENTS.md and the pointers to it, the skills, llms.txt and llms-full.txt, and the links of the pages.
// They are only useful if they are true, so they are tested.

var Test = require('node:test');
var Assert = require('node:assert/strict');
var Path = require('path');
var Fs = require('fs');

var ROOT = Path.join(__dirname, '..');
var llms = require('../scripts/llms');

function read(file) {
	return Fs.readFileSync(Path.join(ROOT, file), 'utf8').replace(/\r\n/g, '\n');
}

function pages(directory, found) {
	found = found || [];
	var entries = Fs.readdirSync(Path.join(ROOT, directory), { withFileTypes: true });
	for (var i = 0; i < entries.length; i++) {
		var entry = entries[i];
		var path = directory ? directory + '/' + entry.name : entry.name;
		if (entry.isDirectory()) {
			if (['.git', '.claude', '.agents', '.github', 'node_modules', 'scripts', 'tests'].indexOf(entry.name) === -1)
				pages(path, found);
		} else if (/\.md$/.test(entry.name))
			found.push(path);
	}
	return found;
}

Test.describe('files for agents', function() {

	Test.test('the pointers lead to AGENTS.md', function() {
		Assert.ok(Fs.existsSync(Path.join(ROOT, 'AGENTS.md')));
		Assert.match(read('CLAUDE.md'), /@AGENTS\.md/);
		Assert.match(read('GEMINI.md'), /@AGENTS\.md/);
		Assert.match(read('.github/copilot-instructions.md'), /AGENTS\.md/);
	});

	Test.test('every skill has a name equal to its folder and a description', function() {
		['.claude/skills', '.agents/skills'].forEach(function(base) {
			var folders = Fs.readdirSync(Path.join(ROOT, base));
			Assert.ok(folders.length >= 2, base + ' has skills');
			folders.forEach(function(name) {
				var text = read(base + '/' + name + '/SKILL.md');
				Assert.match(text, new RegExp('^---\\nname: ' + name + '\\ndescription: .{20,}\\n---\\n'), base + '/' + name);
			});
		});
	});

	Test.test('the skills of .agents point to an existing shared checklist', function() {
		Fs.readdirSync(Path.join(ROOT, '.agents/skills')).forEach(function(name) {
			var text = read('.agents/skills/' + name + '/SKILL.md');
			Assert.match(text, new RegExp('\\.claude/skills/' + name + '/SKILL\\.md'));
			Assert.ok(Fs.existsSync(Path.join(ROOT, '.claude/skills', name, 'SKILL.md')));
		});
	});
});

Test.describe('llms.txt and llms-full.txt', function() {

	Test.test('they match the pages (run npm run llms)', function() {
		Assert.equal(read('llms.txt'), llms.index());
		Assert.equal(read('llms-full.txt'), llms.full());
	});

	Test.test('every page of the zones is listed', function() {
		var listed = llms.PAGES.map(function(page) { return page[1]; });
		var found = pages('').filter(function(file) { return file !== 'llms.txt' && file !== 'llms-full.txt' && file !== 'CLAUDE.md' && file !== 'GEMINI.md'; });
		found.forEach(function(file) {
			Assert.ok(listed.indexOf(file) !== -1, file + ' is not listed in scripts/llms.js');
		});
		listed.forEach(function(file) {
			Assert.ok(Fs.existsSync(Path.join(ROOT, file)), file + ' does not exist');
		});
	});
});

Test.describe('the pages', function() {

	Test.test('every relative link works', function() {
		var all = pages('').concat(['CLAUDE.md', 'GEMINI.md']);
		['.agents/skills', '.claude/skills'].forEach(function(base) {
			Fs.readdirSync(Path.join(ROOT, base)).forEach(function(name) {
				all.push(base + '/' + name + '/SKILL.md');
			});
		});
		all.forEach(function(file) {
			var text = read(file);
			var regex = /\]\(([^)#\s]+)(#[^)]*)?\)/g;
			var match;
			while ((match = regex.exec(text))) {
				if (/^(https?:|mailto:)/.test(match[1]))
					continue;
				var target = Path.normalize(Path.join(Path.dirname(Path.join(ROOT, file)), match[1]));
				Assert.ok(Fs.existsSync(target), file + ' links to ' + match[1]);
			}
		});
	});

	Test.test('no page asks for a Node.js import or an arrow function in its examples of good code', function() {
		// The pages that teach the rules may show the bad form, after "avoid" or "instead of": the rest must follow them.
		['backend/actions.md', 'backend/routes-and-auth.md', 'database/queries.md', 'frontend/plugins-ui.md'].forEach(function(file) {
			var blocks = read(file).match(/```js\n[\s\S]*?```/g) || [];
			blocks.forEach(function(block) {
				Assert.ok(!/require\('(fs|path|crypto|os|http|https|zlib)'\)/.test(block), file + ' requires a Node.js module');
				Assert.ok(!/=>/.test(block), file + ' has an arrow function in a js example');
			});
		});
	});
});
