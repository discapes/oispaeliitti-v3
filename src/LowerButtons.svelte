<script>
    import { createEventDispatcher, getContext } from "svelte";
    const dispatch = createEventDispatcher();

    export let game, overlayType, ilmoituksetVersion;
    let { ilmoituksetVersion: netIlmoituksetVersion } = getContext("netData");

    const setOverlay = (o) => overlayType = o;
    $: baseOverlay = game.playing ? "" : (game.won ? "won" : "lost");
</script>

<div class="flex gap-3">
    <button
        class="textcontainer buttonfx"
        on:click={() => {
            if (!overlayType) dispatch('katko')
        }}>
        Koeviikko&nbsp(-{game.motiCost})
    </button>
    <button class="textcontainer buttonfx" on:click={() => setOverlay(overlayType == "info" ? baseOverlay : "info")}> Info </button>
    <button
        class="textcontainer buttonfx"
        on:click={() => {
            setOverlay(overlayType == "ilmoitukset" ? baseOverlay : "ilmoitukset");
            ilmoituksetVersion = $netIlmoituksetVersion;
        }}>
        Ilmoitukset {ilmoituksetVersion < $netIlmoituksetVersion ? "🔸" : ""}
    </button>
    <button class="textcontainer buttonfx" on:click={() => setOverlay(overlayType == "musiikki" ? baseOverlay : "musiikki")}> Musiikki </button>
    <button class="textcontainer buttonfx" on:click={() => setOverlay(overlayType == "tulokset" ? baseOverlay : "tulokset")}> Tulokset </button>
</div>
