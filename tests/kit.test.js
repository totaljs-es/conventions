require('total5');
require('total5/test');

// The files for agents and models: AGENTS.md and the pointers to it, the skills, llms.txt and llms-full.txt, and the links of the pages.
// They are only useful if they are true, so they are tested. Run: node tests/kit.test.js

var llms = require('../scripts/llms');
var ROOT = Total.Path.join(__dirname, '..');
var SKIP = ['.git', '.claude', '.agents', '.github', 'node_modules', 'scripts', 'tests'];

function check(message, ok) {
	Test.print(message, ok ? null : 'failed');
}

function exists(file) {
	return Total.Fs.existsSync(Total.Path.join(ROOT, file));
}

function read(file) {
	return Total.Fs.readFileSync(Total.Path.join(ROOT, file), 'utf8').replace(/\r\n/g, '\n');
}

function pages(directory, found) {
	found = found || [];
	var entries = Total.Fs.readdirSync(Total.Path.join(ROOT, directory), { withFileTypes: true });
	for (var i = 0; i < entries.length; i++) {
		var entry = entries[i];
		var path = directory ? directory + '/' + entry.name : entry.name;
		if (entry.isDirectory()) {
			if (SKIP.indexOf(entry.name) === -1)
				pages(path, found);
		} else if (/\.md$/.test(entry.name))
			found.push(path);
	}
	return found;
}

Test.push('files for agents', function(next) {

	check('AGENTS.md exists', exists('AGENTS.md'));
	check('CLAUDE.md points to AGENTS.md', (/@AGENTS\.md/).test(read('CLAUDE.md')));
	check('GEMINI.md points to AGENTS.md', (/@AGENTS\.md/).test(read('GEMINI.md')));
	check('copilot instructions point to AGENTS.md', (/AGENTS\.md/).test(read('.github/copilot-instructions.md')));

	['.claude/skills', '.agents/skills'].forEach(function(base) {
		var folders = Total.Fs.readdirSync(Total.Path.join(ROOT, base));
		check(base + ' has skills', folders.length >= 2);
		folders.forEach(function(name) {
			var text = read(base + '/' + name + '/SKILL.md');
			check(base + '/' + name + ' has a name equal to its folder and a description', new RegExp('^---\\nname: ' + name + '\\ndescription: .{20,}\\n---\\n').test(text));
		});
	});

	Total.Fs.readdirSync(Total.Path.join(ROOT, '.agents/skills')).forEach(function(name) {
		var text = read('.agents/skills/' + name + '/SKILL.md');
		check(name + ' points to the shared checklist', new RegExp('\\.claude/skills/' + name + '/SKILL\\.md').test(text) && exists('.claude/skills/' + name + '/SKILL.md'));
	});

	next();
});

Test.push('llms.txt and llms-full.txt', function(next) {

	check('llms.txt matches the pages (run npm run llms)', read('llms.txt') === llms.index());
	check('llms-full.txt matches the pages (run npm run llms)', read('llms-full.txt') === llms.full());

	var listed = llms.PAGES.map(function(page) {
		return page[1];
	});

	pages('').forEach(function(file) {
		if (['llms.txt', 'llms-full.txt', 'CLAUDE.md', 'GEMINI.md'].indexOf(file) === -1)
			check(file + ' is listed in scripts/llms.js', listed.indexOf(file) !== -1);
	});

	listed.forEach(function(file) {
		check(file + ' exists', exists(file));
	});

	next();
});

Test.push('the pages', function(next) {

	var all = pages('').concat(['CLAUDE.md', 'GEMINI.md']);

	['.agents/skills', '.claude/skills'].forEach(function(base) {
		Total.Fs.readdirSync(Total.Path.join(ROOT, base)).forEach(function(name) {
			all.push(base + '/' + name + '/SKILL.md');
		});
	});

	all.forEach(function(file) {
		var regex = /\]\(([^)#\s]+)(#[^)]*)?\)/g;
		var text = read(file);
		var match;
		while ((match = regex.exec(text))) {
			if (/^(https?:|mailto:)/.test(match[1]))
				continue;
			var target = Total.Path.normalize(Total.Path.join(Total.Path.dirname(Total.Path.join(ROOT, file)), match[1]));
			check(file + ' links to ' + match[1], Total.Fs.existsSync(target));
		}
	});

	// The pages that teach the rules may show the bad form, after "avoid" or "instead of": the rest must follow them.
	['backend/actions.md', 'backend/routes-and-auth.md', 'database/queries.md', 'frontend/plugins-ui.md'].forEach(function(file) {
		var blocks = read(file).match(/```js\n[\s\S]*?```/g) || [];
		blocks.forEach(function(block) {
			check(file + ' does not require a Node.js module in an example', !(/require\('(fs|path|crypto|os|http|https|zlib)'\)/).test(block));
			check(file + ' has no arrow function in an example', !(/=>/).test(block));
		});
	});

	next();
});

Test.run();
