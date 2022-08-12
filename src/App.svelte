<script>
	if (PRODUCTION) console.log = () => 0;
	import { setContext } from "svelte";
	import ServerDataFetcher from "./serverDataFetcher";
	import Login from "./Login.svelte";
	import Grid from "./Grid.svelte";
	import Leaderboard from "./Leaderboard.svelte";
	import Overlay from "./Overlay.svelte";
	import LowerButtons from "./LowerButtons.svelte";
	import Options from "./Options.svelte";
	import Game from "./game";
	import { preloadImages } from "./util.js";
	import TopBar from "./TopBar.svelte";

	preloadImages();
	$: gameChanged(game); // needs to be above highscore reactivity

	let ilmoituksetVersion = +localStorage.getItem("ilmoitukset-version") || 0;
	$: localStorage.setItem("ilmoitukset-version", ilmoituksetVersion);
	let highscore = +localStorage.getItem("highscore") || 0;
	$: localStorage.setItem("highscore", highscore);

	const serverDataFetcher = new ServerDataFetcher();
	setContext("netData", serverDataFetcher);
	const { leaderboard, motd } = serverDataFetcher;

	let overlayType = "";
	let account;

	let sizex = 4;
	let sizey = 4;
	let game;
	$: game = new Game(sizex, sizey, onGameEnd);

	function onKeepPlaying() {
		game.playing = true;
		overlayType = "";
	}
	function onGameEnd() {
		overlayType = game.won ? "won" : "lost";
	}
	function onTryAgain() {
		game = new Game(sizex, sizey);
		overlayType = "";
	}

	function gameChanged(game) {
		if (sizex === 4 && sizey === 4) {
			highscore = Math.max(game.score, highscore);
			updateAccount(game.score);
		}

		function updateAccount(newScore) {
			if (account && newScore > account.score) {
				account.setScore(newScore);
				account = account;
			}
		}
	}

	let namefieldElem, gridWidthElem, gridHeightElem;
	function handleKd(e) {
		if (overlayType || [namefieldElem, gridWidthElem, gridHeightElem].includes(document.activeElement)) return;
		switch (e.key.toLowerCase()) {
			case "arrowup":
			case "w":
				game = game.move(0);
				break;
			case "arrowleft":
			case "a":
				game = game.move(3);
				break;
			case "arrowdown":
			case "s":
				game = game.move(2);
				break;
			case "arrowright":
			case "d":
				game = game.move(1);
				break;
			case "r":
				game = new Game(sizex, sizey);
				break;
		}
	}
</script>

<svelte:body class:newbg />
<svelte:window on:keydown={handleKd} />
<div class="p-4 inline-grid maingrid justify-center justify-items-center gap-3 min-w-[100vw]">
	<div class="gridheader flex gap-3 justify-center whitespace-nowrap">
		<TopBar {highscore} {game} />
	</div>

	<div class="gridhighscores w-[320px]">
		<div class="border needscontrast overflow-hidden">
			{#if $leaderboard}
				<Leaderboard leaderboard={$leaderboard.slice(0, 10)} />
			{/if}
		</div>
		<br />
		<Login bind:account on:reset={() => (game = new Game(sizex, sizey))} bind:namefieldElem />
	</div>

	<div class="gridgrid relative">
		<Overlay {account} type={overlayType} leaderboard={$leaderboard} on:keepplaying={onKeepPlaying} on:tryagain={onTryAgain} />
		<Grid grid={game.grid} />
	</div>

	<div class="gridhello w-[320px]">
		<Options bind:gridWidthElem bind:gridHeightElem bind:sizex bind:sizey />
		<br />
		<pre class="needscontrast rounded p-1">{$motd.greeting}</pre>
	</div>

	<div class="gridbuttons flex justify-center whitespace-nowrap">
		<LowerButtons bind:ilmoituksetVersion {game} bind:overlayType on:katko={(() => game.tryKatko(), (game = game))} />
	</div>
</div>

<style global lang="postcss">
	@tailwind base;
	/* @tailwind components; */
	@tailwind utilities;

	html {
		transform: scale(0.8);
		transform-origin: top center;
		--16image: url("../img/16.png");
		--32image: url("../img/32.png");
	}

	h1 {
		@apply uppercase text-6xl font-thin;
	}
	h2 {
		@apply uppercase text-3xl mb-3 font-thin;
	}
	h3 {
		@apply text-2xl mb-1 font-thin inline-block mr-3;
	}

	.maingrid {
		grid-template-areas:
			". header ."
			"highscores grid hello"
			". buttons .";
	}
	.gridheader {
		grid-area: header;
		max-width: 0;
	}
	.gridhighscores {
		grid-area: highscores;
	}
	.gridgrid {
		grid-area: grid;
	}
	.gridhello {
		grid-area: hello;
	}
	.gridbuttons {
		grid-area: buttons;
		max-width: 0;
	}

	.textcontainer {
		@apply border p-2 min-w-[100px] text-center;
	}

	@media (hover: none) {
		.buttonfx:active {
			background-color: #fff8;
		}
	}
	@media (hover: hover) {
		.buttonfx:hover {
			background-color: #fff8;
		}
	}

	p,
	.pdiv {
		font-size: 16px;
		padding: 10px 20px;
		line-height: 1.65;
	}

	ol,
	ul {
		margin: 16px 0;
		padding: 0 0 0 40px;
	}
	li {
		list-style: none outside disc;
	}

	hr {
		border-width: medium medium 0.5px;
		margin-top: 40px;
		margin-bottom: 10px;
	}

	img,
	svg,
	video,
	canvas,
	audio,
	iframe,
	embed,
	object {
		display: inline-block;
	}

	body {
		background-image: url("../bg.png");
		/* font-family: "Clear Sans", "Helvetica Neue", Arial, sans-serif; */
		width: 100%;
	}
	* {
		border-color: black;
	}
</style>
