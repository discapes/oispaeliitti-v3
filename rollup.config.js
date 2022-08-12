import svelte from "rollup-plugin-svelte";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import livereload from "rollup-plugin-livereload";
import { terser } from "rollup-plugin-terser";
import css from "rollup-plugin-css-only";
import sveltePreprocess from "svelte-preprocess";
import replace from "@rollup/plugin-replace";
import "dotenv/config";
import { readFile, writeFile } from "fs/promises";
import typescript from "@rollup/plugin-typescript";

const production = !process.env.ROLLUP_WATCH;

function serve() {
	let server;

	function toExit() {
		if (server) server.kill(0);
	}

	return {
		writeBundle() {
			if (server) return;
			server = require("child_process").spawn("npm", ["run", "start", "--", "--dev"], {
				stdio: ["ignore", "inherit", "inherit"],
				shell: true
			});

			process.on("SIGTERM", toExit);
			process.on("exit", toExit);
		}
	};
}

function bllist() {
	return {
		async writeBundle() {
			const bll = (await readFile("src/bllist.html")).toString();
			let newbll = bll.replace("__SERVER__", process.env.NODE_ENV === "dev" ? process.env.DEVSERVER : process.env.SERVER);
			await writeFile("public/bllist.html", newbll);
		}
	};
}

export default {
	input: "src/main.ts",
	output: {
		sourcemap: true,
		format: "iife",
		name: "app",
		file: "public/build/bundle.js"
	},
	plugins: [
		svelte({
			preprocess: sveltePreprocess({ sourceMap: !production }),
			compilerOptions: {
				// enable run-time checks when not in production
				dev: !production
			},
			preprocess: sveltePreprocess({
				sourceMap: !production,
				postcss: {
					plugins: [require("tailwindcss"), require("autoprefixer")]
				}
			})
		}),
		replace({
			WIN_TILE: process.env.WIN_TILE,
			START_TILES: process.env.START_TILES,
			SERVER: process.env.NODE_ENV === "dev" ? process.env.DEVSERVER : process.env.SERVER,
			MAX_TILE: process.env.MAX_TILE,
			INITIAL_MOTICOSTS: process.env.INITIAL_MOTICOSTS,
			PRODUCTION: production
		}),
		// we'll extract any component CSS out into
		// a separate file - better for performance
		css({ output: "bundle.css" }),

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration -
		// consult the documentation for details:
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		resolve({
			browser: true,
			dedupe: ["svelte"]
		}),
		commonjs(),
		typescript({
			sourceMap: !production,
			inlineSources: !production
		}),

		// In dev mode, call `npm run start` once
		// the bundle has been generated
		!production && serve(),

		bllist(),

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		!production && livereload("public"),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser()
	],
	watch: {
		clearScreen: false
	}
};
