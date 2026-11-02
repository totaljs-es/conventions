'use strict';

// The files for the models that read these pages: llms.txt (an index, in the format of https://llmstxt.org) and llms-full.txt
// (every page in one file). They are built from the pages of the repository, so they cannot differ from them, and a test checks it.
// This is a tooling script that runs with plain Node.js: it is not part of a Total.js application.
//
//   node scripts/llms.js            prints llms.txt
//   node scripts/llms.js --write    writes llms.txt and llms-full.txt

var Fs = require('fs');
var Path = require('path');

var ROOT = Path.join(__dirname, '..');
var BASE = 'https://raw.githubusercontent.com/totaljs-es/conventions/main/';

var SUMMARY = 'How Total.js 5 applications are written: ES5 over ES6, Total.js prototypes and Tangular first, no imports from Node.js, actions named Collection|verb, routes in controllers, DATA queries, PostgreSQL scripts and jComponent components loaded with COMPONENTATOR(). Learned from production Total.js 5 apps and the official style guide.';

var DETAILS = 'Read only the zone you work in: general, backend, database or frontend. Every rule has an example taken from real code. Written for Total.js 5 (`total5` on npm); the official guidelines are for Total.js 4 and the pages mark where they differ.';

// Every page, in the order in which it is read: [section, file, title, what it says]
var PAGES = [
	['Start here', 'README.md', 'README', 'The zones, the pages and the principles'],
	['Start here', 'AGENTS.md', 'AGENTS.md', 'For an agent: how to use these pages and the rules that apply to every change'],
	['General', 'general/project-structure.md', 'Project structure', 'Folders, index.js, where each kind of file goes, the checks'],
	['General', 'general/javascript-style.md', 'JavaScript style', 'ES5 over ES6, prototypes and Tangular first, no imports from Node.js, formatting and names'],
	['Backend', 'backend/actions.md', 'Actions', 'NEWACTION: naming with a pipe, input and params, answers, permissions, DATA'],
	['Backend', 'backend/routes-and-auth.md', 'Routes and authentication', 'ROUTE syntax for APIs, pages and uploads, and the single AUTH'],
	['Backend', 'backend/definitions-and-modules.md', 'Definitions and modules', 'auth, init, func and db definitions, config, modules, MAIN, REPO and FUNC'],
	['Backend', 'backend/gotchas.md', 'Gotchas of the server', 'Behaviours that differ from what you would guess'],
	['Database', 'database/sql-scripts.md', 'SQL scripts', 'PostgreSQL files, names, columns, order of the columns, code lists'],
	['Database', 'database/queries.md', 'Queries with DATA', 'read, find, autoquery, insert, modify, remove, conditions, raw SQL'],
	['Frontend', 'frontend/components.md', 'Components', 'Use the existing jComponent components, preferred ones, exec, intranetcss, COMPONENTATOR()'],
	['Frontend', 'frontend/plugins-ui.md', 'Plugins with UI', 'Server part, screens, forms, PLUGIN() and tapi'],
	['Frontend', 'frontend/views-and-layout.md', 'Views and layout', 'The layout, directives, translations, public pages'],
	['Frontend', 'frontend/css.md', 'CSS', 'Formatting, CLASS scoping, predefined classes']
];

exports.PAGES = PAGES;

exports.index = function() {

	var lines = ['# Total.js conventions', '', '> ' + SUMMARY, '', DETAILS, ''];
	var section = null;

	for (var i = 0; i < PAGES.length; i++) {
		var page = PAGES[i];
		if (page[0] !== section) {
			section = page[0];
			lines.push('## ' + section, '');
		}
		lines.push('- [' + page[2] + '](' + BASE + page[1] + '): ' + page[3]);
	}

	lines.push('');
	return lines.join('\n');
};

exports.full = function() {

	var lines = ['# Total.js conventions: every page', '', '> ' + SUMMARY, ''];

	for (var i = 0; i < PAGES.length; i++) {
		var page = PAGES[i];
		var text = Fs.readFileSync(Path.join(ROOT, page[1]), 'utf8').replace(/\r\n/g, '\n').trim();
		lines.push('---', '', 'Source: ' + BASE + page[1], '', text, '');
	}

	return lines.join('\n');
};

if (require.main === module) {
	if (process.argv.indexOf('--write') !== -1) {
		Fs.writeFileSync(Path.join(ROOT, 'llms.txt'), exports.index());
		Fs.writeFileSync(Path.join(ROOT, 'llms-full.txt'), exports.full());
		console.log('llms.txt and llms-full.txt written');
	} else
		process.stdout.write(exports.index());
}
