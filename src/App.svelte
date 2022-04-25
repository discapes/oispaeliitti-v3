<script>
	if (PRODUCTION) console.log = () => 0;
	import { writable, get } from "svelte/store";
	import { setContext, onMount } from "svelte";
	import convertCookies from "./convertcookies.js";
	import { LocData, NetData } from "./data.js";
	import Login from "./Login.svelte";
	import Game from "./game.js";
	import Grid from "./Grid.svelte";
	import Scoreboard from "./Scoreboard.svelte";
	import Overlay from "./Overlay.svelte";
	import LowerButtons from "./LowerButtons.svelte";
	import Options from "./Options.svelte";
	import { preload } from "./util.js";

	if (localStorage.getItem("bestScore") && !localStorage.getItem("highscore")) convertCookies();

	preload();

	let uiState = { overlay: writable("") };
	let locData = new LocData();
	let netData = new NetData(locData);
	setContext("uiState", uiState);
	setContext("locData", locData);
	setContext("netData", netData);

	// Auto-subscription only works with store variables that are declared (or imported) at the top-level scope of a component.
	let { highscores, motd } = netData;
	let { highscore } = locData;
	let { overlay } = uiState;

	let sizex = 4;
	let sizey = 4;
	let game, score, moti;
	function newGame() {
		game = new Game(sizex, sizey);
		if (sizex === 4 && sizey === 4) game.score.subscribe((score) => ($highscore = Math.max($highscore, score)));
		({ score, moti } = game);
	}
	$: sizex, sizey, newGame();

	let account;
	setInterval(async () => {
		if (sizex === 4 && sizey === 4 && account && account.score < $score) {
			await account.setScore(score); // takes in writable for obfuscation
			account = account;
		} 
	}, 3000);

	let tryLogin;
	onMount(() => {
		if (localStorage.getItem("saved-acc")) tryLogin(localStorage.getItem("saved-acc"));
	});

	let namefieldElem, gridWidthElem, gridHeightElem;
	function handleKd(e) {
		if ($overlay || [namefieldElem, gridWidthElem, gridHeightElem].includes(document.activeElement) || get(game.lost) || (get(game.won) && !get(game.keepPlaying))) return;
		switch (e.key.toLowerCase()) {
			case "arrowup":
			case "w":
				game.move(0);
				break;
			case "arrowleft":
			case "a":
				game.move(3);
				break;
			case "arrowdown":
			case "s":
				game.move(2);
				break;
			case "arrowright":
			case "d":
				game.move(1);
				break;
			case "r":
				newGame();
				break;
		}
	}
</script>

<svelte:body class:newbg />
<svelte:window on:keydown={handleKd} />
<div class="p-4 inline-grid maingrid justify-center justify-items-center gap-3 min-w-[100vw]">
	<div class="gridheader flex gap-3 justify-center whitespace-nowrap">
		<h1 class="needscontrast p-1 rounded">Oispa eliitti</h1>
		<div class="textcontainer">
			Moti<br />
			<b>{$moti}</b>
		</div>
		<div class="textcontainer">
			Score<br />
			<b>{$score}</b>
		</div>
		<div class="textcontainer">
			Highscore<br />
			<b>{$highscore}</b>
		</div>
	</div>

	<div class="gridhighscores w-[320px] ">
		<div class="border needscontrast">
			{#if $highscores}
				<Scoreboard highscores={$highscores.slice(0, 10)} />
			{/if}
		</div>
		<br />
		<Login on:reset={newGame} {score} bind:account bind:namefieldElem bind:tryLogin />
	</div>

	<div class="gridgrid relative">
		<Overlay {game} highscores={$highscores} on:tryagain={newGame} />
		<Grid {game} {sizex} {sizey} />
	</div>

	<div class="gridhello w-[320px]">
		<Options bind:gridWidthElem bind:gridHeightElem bind:sizex bind:sizey />
		<br />
		<pre class="needscontrast rounded p-1">{$motd.greeting}</pre>
	</div>

	<div class="gridbuttons flex justify-center whitespace-nowrap">
		<LowerButtons allowKatko={!$overlay} {game} />
	</div>
</div>

<style global lang="postcss">
	@tailwind base;
	/* @tailwind components; */
	@tailwind utilities;

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
