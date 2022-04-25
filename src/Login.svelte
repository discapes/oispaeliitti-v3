<script>
    import { fade } from "svelte/transition";
    import { getFormValues } from "./util.js";
    import Account from "./account.js";
    import { createEventDispatcher, onMount } from "svelte";
    const dispatch = createEventDispatcher();

    export let account;
    export let namefieldElem;

    let response = "";
    let responseVisible = true;
    let clearResponseTimeout;

    onMount(() => {
        if (localStorage.getItem("saved-acc")) tryLogin(localStorage.getItem("saved-acc"));
    });

    async function formHandler(e) {
        if (clearResponseTimeout) clearTimeout(clearResponseTimeout);
        response = "";

        if (account) {
            if (account.score < 3000 || confirm("This action resets the game. Continue?")) {
                account = undefined;
                dispatch("reset");
            }
        } else {
            let name = getFormValues(e.target).name;
            if (name) await tryLogin(name);
        }
    }

    export async function tryLogin(name) {
        let secret = localStorage.getItem(name + "-secret") || undefined;
        try {
            const _account = new Account(name, secret);
            await _account.connect();
            account = _account;

            localStorage.setItem(account.name + "-secret", account.secret);
            localStorage.setItem("saved-acc", account.name);
        } catch (e) {
            response = "Error: " + e.message;
            clearResponseTimeout = setTimeout(() => (responseVisible = false), 5000);
        }
        responseVisible = true;
    }
</script>

<h3 class="needscontrast p-1 rounded">Login</h3>
{#if responseVisible}
    <span out:fade class={(account ? "text-green-700" : "text-rose-700") + (response ? " needscontrast " : " ") + "p-1 rounded"}
        >{account ? "Logged in as " + account.name + " (" + account.score + ")" : response}</span>
{/if}
<form on:submit|preventDefault={formHandler}>
    <div class="flex w-full gap-3">
        <input bind:this={namefieldElem} name="name" type="text" placeholder="username" class="needscontrast bg-transparent p-0.5 pl-1 border" />
        <button class="textcontainer buttonfx !p-0.5">{!account ? "Enter" : "Reset"}</button>
    </div>
</form>
