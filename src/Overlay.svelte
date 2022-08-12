<script>
	import { getContext, createEventDispatcher } from "svelte";
	import Chat from "./Chat.svelte";
	const dispatch = createEventDispatcher();
	import Leaderboard from "./Leaderboard.svelte";

	export let leaderboard;
	export let type;
	export let account;
	const { ilmoituksetHTML, infoHTML } = getContext("netData");
</script>

{#if type && type !== "musiikki"}
	<div class="overflow-auto absolute z-30 bg-white/90 rounded w-full h-full">
		{#if type == "info"}
			{@html $infoHTML}
		{:else if type === "ilmoitukset"}
			{@html $ilmoituksetHTML}
		{:else if type === "chat"}
			<Chat {account} />
		{:else if type === "tulokset"}
			<div class="border rounded rounded-br-none overflow-y-auto overflow-x-hidden">
				<Leaderboard leaderboard={leaderboard.slice(0, 30)} />
			</div>
		{:else if type === "won"}
			<div class="flex flex-col h-full justify-center items-center gap-3">
				<h1 class="block">You won</h1>
				<div class="flex gap-3">
					<button class="buttonfx textcontainer" on:click={() => dispatch("keepplaying")}>Continue</button>
					<button class="buttonfx textcontainer" on:click={() => dispatch("tryagain")}>Try again</button>
				</div>
			</div>
		{:else if type === "lost"}
			<div class="flex flex-col justify-center h-full items-center gap-3">
				<h1>Game over</h1>
				<button class="buttonfx textcontainer" on:click={() => dispatch("tryagain")}>Try again</button>
			</div>
		{/if}
	</div>
{/if}

<div class="bg-neutral-50 absolute w-full h-full overflow-hidden z-30 rounded" style={`display: ${type == "musiikki" ? "block" : "none"};`}>
	<iframe
		title="musiikki"
		scrolling="no"
		src="https://cheat.abitti.fi/build/index.html?fi&amp;muzak#"
		style="border: 0px none; height: 550px; margin-top: -135px; width: 480px;"
	/>
</div>
