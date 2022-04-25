<script>
    import { getContext } from "svelte";

    export let game;
    export let allowKatko;
    let motiCost;
    $: ({ motiCost } = game);
    let { overlay } = getContext("uiState");
    let { ilmoituksetVersion: netIlmoituksetVersion } = getContext("netData");
    let { ilmoituksetVersion: locIlmoituksetVersion } = getContext("locData");
</script>

<div class="flex gap-3">
    <button
        class="textcontainer buttonfx"
        on:click={() => {
            if (allowKatko) game.tryKatko();
        }}>
        Koeviikko&nbsp(-{$motiCost})
    </button>
    <button class="textcontainer buttonfx" on:click={() => ($overlay = $overlay == "info" ? "" : "info")}> Info </button>
    <button
        class="textcontainer buttonfx"
        on:click={() => {
            $overlay = $overlay == "ilmoitukset" ? "" : "ilmoitukset";
            $locIlmoituksetVersion = $netIlmoituksetVersion;
        }}>
        Ilmoitukset {$locIlmoituksetVersion < $netIlmoituksetVersion ? "🔸" : ""}
    </button>
    <button class="textcontainer buttonfx" on:click={() => ($overlay = $overlay == "musiikki" ? "" : "musiikki")}> Musiikki </button>
    <button class="textcontainer buttonfx" on:click={() => ($overlay = $overlay == "tulokset" ? "" : "tulokset")}> Tulokset </button>
</div>
