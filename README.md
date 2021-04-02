# MongoDB session middleware for Telegraf

MongoDB powered simple session middleware for [Telegraf 4.0](https://github.com/telegraf/telegraf) with TypeScript support.

## Installation

```js
$ npm install telegraf-session-prisma
```

```js
$ yarn add telegraf-session-prisma
```

## Example

[Full JavaScript example can be found here.](https://github.com/alexnzarov/telegraf-session-prisma-examples/tree/master/javascript-example)

```js
const { Telegraf } = require('telegraf');
const { PrismaClient } = require('@prisma/client');
const { session } = require('telegraf-session-prisma');

const bot = new Telegraf(process.env.BOT_TOKEN);

const prisma = new PrismaClient()

bot.use(session(db, { sessionName: 'session', collectionName: 'sessions' }));
```

## Example (TypeScript)

[Full TypeScript example can be found here.](https://github.com/waptik/telegraf-session-prisma-examples/tree/master/typescript-example)

```ts
import { Context, Telegraf } from 'telegraf';
import { PrismaClient } from "@prisma/client"
import { session } from 'telegraf-session-mongodb';

export interface SessionContext extends Context {
  session: any;
};

const bot = new Telegraf<SessionContext>(process.env.BOT_TOKEN);

const prisma = new PrismaClient()

bot.use(session(db, { sessionName: 'session', collectionName: 'sessions' }));
```

## API

### Options

* `collectionName`: name for MongoDB collection (default: `sessions`)
* `sessionName`: context property name (default: `session`)
* `sessionKeyFn`: function that generates the session key from the context ([default implementation](https://github.com/waptik/telegraf-session-prisma/blob/master/src/keys.ts#L10-L16), [legacy deprecated function](https://github.com/waptik/telegraf-session-prisma/blob/master/src/keys.ts#L21-L31))
