# Queries with `DATA`

Total.js talks to PostgreSQL through `DATA`, a query builder. Use it for everything it can express; write raw SQL only for what it cannot.

Always end with `.promise($)` (in an async action) or `.callback($)`. Passing `$` lets the framework answer the request with the error.

## Read

```js
// one record
var item = await DATA.read('tbl_user').fields('id,name').id(params.id).error('@(User not found)').promise($);

// several
var items = await DATA.find('tbl_tag').fields('id,search').where('folderid', id).promise($);

// values from a list
var apps = await DATA.find('op.tbl_app_permission').fields('id,appid').in('id', permissions).promise($);
```

- `.fields('a,b')` selects columns; name them, do not read `*`.
- `.id(value)` filters by the primary key.
- `.error('@(text)')` or `.error(404)` answers with that error when nothing is found. It is what turns a missing row into a 404.

## A list for the UI

`autoquery` reads the query string (`?q=`, `sort`, `page`, `limit`) and builds the query. Name the allowed fields and their types, a default sort and a maximum page size:

```js
NEWACTION('Groups|list', {
	name: 'List of groups',
	action: function($) {
		DATA.find('op.view_group').autoquery($.query, 'id:UID,name,color,icon,users:Number,dtcreated:Date,dtupdated:Date', 'dtcreated_desc', 100).callback($);
	}
});
```

A list that joins several tables reads from a `view_`.

## Write

```js
model.id = UID();
model.dtcreated = NOW;
await DATA.insert('tbl_ticket_time', model).promise($);

model.dtupdated = NOW;
await DATA.modify('op.tbl_group', model).id(params.id).error('@(Group not found)').promise($);

await DATA.remove('tbl_tag').id(params.id).error(404).promise($);
await DATA.remove('tbl_notification').where('ticketid', params.id).where('typeid', 'logwork').promise($);
```

- Fill `id` with `UID()` and the dates with `NOW` in the action, not in the database.
- Remove fields that are not columns before `insert` / `modify` (`model.permissions = undefined`).
- Update or insert in one call: `DATA.modify('tbl_x', data, true).id(id).insert(fn, params)`.

## Conditions

`where(field, value)`, `in(field, array)`, `notin(field, array)`, `search(field, keyword)`, `or(b => b.search('name', m).search('email', m))`.

```js
var keywords = text.toKeywords(true, true);
for (var keyword of keywords)
	builder.search('a.search', keyword);
```

## Raw SQL

`DATA.query('UPDATE tbl_ticket a SET worked=(SELECT ...) WHERE a.id=$1', [id]).promise($)`.

- Prefer parameters (`$1`) over building the text.
- When a value must go into the text, escape it with `PG_ESCAPE(value)` before `.format()`. Never concatenate user input.

## Schemas (namespaces)

A table can be addressed with its schema: `op.tbl_user`. Keep the prefix consistent inside one file.
