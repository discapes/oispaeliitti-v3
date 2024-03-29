You can try the app at [oispaeliitti.miikat.dev](https://oispaeliitti.miikat.dev).

## Get started

Requirements: MongoDB running.

Install the dependencies...

```bash
npm install
```

Configure the app in `rollup.config.js`

...then start [Rollup](https://rollupjs.org) and the server:

```bash
npm run dev
```

Navigate to [localhost:8080](http://localhost:8080). You should see your app running. Edit a component file in `src`, save it, and reload the page to see your changes.

By default, the server will only respond to requests from localhost. To allow connections from other computers, edit the `sirv` commands in package.json to include the option `--host 0.0.0.0`.

If you're using [Visual Studio Code](https://code.visualstudio.com/) we recommend installing the official extension [Svelte for VS Code](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode). If you are using other editors you may need to install a plugin in order to get syntax highlighting and intellisense.

## Run the server

```bash
node server/index.js
```

## Building and running in production mode

To create an optimised version of the app in public/:

```bash
npm run build
```

You can run the newly built app with `npm run start`. This uses [sirv](https://github.com/lukeed/sirv), which is included in your package.json's `dependencies` so that the app will work when you deploy to platforms like [Heroku](https://heroku.com).
