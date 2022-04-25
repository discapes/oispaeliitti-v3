<script>
    import { getContext, createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();
    import Scoreboard from "./Scoreboard.svelte";

    export let highscores;
    export let game;
    let { overlay: type } = getContext("uiState");
    let { ilmoituksetHTML, infoHTML } = getContext("netData");

    let lost, won, keepPlaying;
    $: ({ lost, won, keepPlaying } = game);

    let paused = false;
    $: paused = $lost || ($won && !$keepPlaying);
</script>

{#if ($type && $type != "musiikki") || paused}
    <div class="overflow-auto absolute z-30 bg-white/90 rounded w-full h-full">
        {#if $type == "info"}
            {@html $infoHTML}
        {:else if $type == "ilmoitukset"}
            {@html $ilmoituksetHTML}
        {:else if $type == "tulokset"}
            <div class="border rounded rounded-r-none overflow-y-auto overflow-x-hidden">
                <Scoreboard highscores={highscores.slice(0, 30)} />
            </div>
        {:else if $won}
            <div class="flex flex-col h-full justify-center items-center gap-3">
                <h1 class="block">You won</h1>
                <div class="flex gap-3">
                    <button class="buttonfx textcontainer" on:click={() => game.setKeepPlaying()}>Continue</button>
                    <button class="buttonfx textcontainer" on:click={() => dispatch("tryagain")}>Try again</button>
                </div>
            </div>
        {:else if $lost}
            <div class="flex flex-col justify-center h-full items-center gap-3">
                <h1>Game over</h1>
                <button class="buttonfx textcontainer" on:click={() => dispatch("tryagain")}>Try again</button>
            </div>
        {/if}
    </div>
{/if}

<div class="bg-neutral-50 absolute w-full h-full overflow-hidden z-30 rounded" style={`display: ${$type == "musiikki" ? "block" : "none"};`}>
    <iframe
        title="musiikki"
        scrolling="no"
        src="https://cheat.abitti.fi/build/index.html?fi&amp;muzak#"
        style="border: 0px none; height: 550px; margin-top: -135px; width: 480px;" />
</div>
