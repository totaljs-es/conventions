# Standalone actions with tests

A kit is a repository of reusable actions that are not part of one application: one folder per action, each with its own test that needs no network and no credentials. An application copies the action, or loads it, and supplies the configuration.

## Layout

```
actions/<name>/
  action.js        one or more NEWACTION(), the folder is named after the provider or the topic (lower case)
  test.js          runs the actions with assertions
  fixtures/        sample data for the tests (only if needed)
example/           the template: action.js and test.js
tools/check.js     checks structure and style, then runs test.js
```

Single files from an older layout (`actions/*.js`) stay as they are; a new action always has its folder and its test.

## Contract first

Name the action `Collection|verb` (see [actions](actions.md)) and write the contract before the code: `input`, `output`, `config` and the errors it returns. Split by responsibility:

- a `parse` action only transforms data it receives, no network;
- a `search` (or `read`, `send`, `ask`) action calls the provider and delegates the transformation to `parse` with `$.action('Shipments|parse', { data: response.body }).callback($)`.

The parser is tested with a fixture, the caller with a local server.

## action.js

```js
NEWACTION('Shipments|search', {
	name: 'Search shipments',
	summary: 'Searches shipments between two cities',
	input: '*from,*to,limit:Number',
	output: 'success:Boolean, items:[{ id:String, from:String, to:String, delay:Number }]',
	config: { url: 'https://api.example.com', token: '' },
	action: function($, model) {

		var opt = {};
		opt.method = 'GET';
		opt.url = $.config.url + '/shipments?from=' + encodeURIComponent(model.from) + '&to=' + encodeURIComponent(model.to);
		opt.headers = { Authorization: 'Bearer ' + $.config.token };
		opt.callback = function(err, response) {

			if (err || response.status !== 200) {
				$.invalid(err || response.status);
				return;
			}

			$.action('Shipments|parse', { data: response.body }).callback($);
		};

		REQUEST(opt);
	}
});

/*
	EXAMPLE:
	ACTION('Shipments|search', { from: 'Berlin', to: 'Vienna' }).config({ token: 'YOUR_TOKEN' }).callback(console.log);
*/
```

- Always give `name`, `summary`, `input` and `output`. `summary` is the description an AI client sees when the action is exposed with `mcp: true`. `output` is also a filter: only the declared keys leave the action.
- Everything configurable (base URL, token, limits) is in `config` and read as `$.config.<key>`. The default of a secret is an empty string or `YOUR_TOKEN`, never a real value. A caller overrides it with `.config({ ... })`. The base URL belongs in `config` because it lets a test point the action at a local server. Do not read `process.env` inside an action.
- Whatever the provider returns is not trusted: check that the keys you read exist and answer `$.invalid('@(Unknown format)')` instead of crashing. A non-2xx status is not an `err` of `REQUEST`: check `response.status`.
- Reuse other actions with `$.action(...)`: `.callback($)` passes its answer or error on; `await ... .promise($)` gives the value inside an `async` action.
- `route: true`, `user: true`, `permissions`, `timeout` and `mcp: true` only when the task asks for them. Add an `EXAMPLE:` comment at the end showing a call.

## Test

`test.js` runs the action the way an application does, with `ACTION(...)` and the Total.js test library, and asserts the result. A test that only prints is not a test.

```js
require('total5');
require('total5/test');
require('./action');

const USER = new User({ id: 'test', name: 'Test', sa: true, permissions: [] });
const FIXTURE = Total.Fs.readFileSync(PATH.root('fixtures/shipments.json'), 'utf8');

function call(name, input, config) {
	return ACTION(name, input).env('test').user(USER).config(config || {}).promise();
}

Test.push('Shipments|parse', async function(next) {

	var out = await call('Shipments|parse', { data: FIXTURE });
	Test.print('returns 2 items', out.items.length === 2 ? null : 'got ' + out.items.length);

	try {
		await call('Shipments|parse', { data: '{}' });
		Test.print('rejects an unknown format', 'did not fail');
	} catch (e) {
		Test.print('rejects an unknown format');
	}

	next();
});

Test.run();
```

- `Test.push(name, fn)` registers a step and `fn` calls `next()` when it ends. `Test.print(message)` records `[OK]`; `Test.print(message, error)` with a value records `[FAIL]` and the process exits with code 1. `Test.run()` runs the steps in order and ends the process.
- `.promise()` resolves with the answer and rejects with the error list, for example when a required field is missing.
- Cover for every action: a valid call, a missing required field, an empty or unknown answer of the provider and the edge cases of the data.
- The provider is never called. Its answers come from `fixtures/` (trimmed, anonymized, without tokens or personal data): passed directly to a `parse` action, or served by a local `Total.Http.createServer` on port `0` and given to the caller through `.config({ url: url })`. Close the server so the test ends by itself.
- Call actions by their explicit name, not `Object.keys(Total.actions)[0]`: the order of files on disk is not a contract.
- `PATH.root(file)` is relative to the folder where `node test.js` runs: run the test from the action's folder.
- An npm dependency of the test is installed with `NPM.wait(NPMINSTALL, function() { ... })`; add one only when it is needed. A live test against the real provider is a separate file, skipped unless asked for.

## Checker

`tools/check.js` is a plain Node tool (a standalone tool may use `require`, see [definitions and modules](definitions-and-modules.md)). For a folder it checks `node --check`, the `Collection|verb` name, `name`, `summary`, `input`, `output`, that every action answers, that `config` holds no real secret, the ES5 style and `require()` / `process.env` in the action, that the test asserts and uses a local URL, and then runs `test.js`. Run `node tools/check.js actions/<name>` or without arguments for every folder; it ends with the number of errors and the exit code. A passing check does not prove the real provider works: say which part was verified only against a fixture.
