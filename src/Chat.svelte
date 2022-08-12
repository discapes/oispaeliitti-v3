<script context="module">
</script>

<script>
	import { tick, onMount } from "svelte";

	export let account;
	let messages = [];
	let value;
	let tf;
	const url = "ws://localhost:8443";
	let ws;

	onMount(async () => {
		ws = new WebSocket(url);
		ws.onopen = () => {
			if (!account) return;
			ws.send(`${account.name} connected`);
		};
		ws.onmessage = (event) => {
			messages = [...messages, event.data];
			tick().then(() => {
				if (!tf) return;
				if (tf.scrollHeight - tf.scrollTop - tf.clientHeight > tf.clientHeight - 80) return;
				tf.scrollTop = tf.scrollHeight;
			});
		};
	});

	function keypress(e) {
		if (e.key === "Enter") {
			if (account) {
				ws.send(`${account.name}: ${value}`);
				value = "";
			} else {
				alert("Login to chat");
			}
		}
	}
</script>

<div class="h-full bg-white/80 flex flex-col justify-between">
	<div bind:this={tf} class="overflow-y-scroll h-full">
		<table class="w-full">
			{#each messages as msg}
				<tr>
					<td>
						<b>{msg.split(" ")[0]}</b>{msg.slice(msg.indexOf(" "))}
					</td>
				</tr>
			{/each}
		</table>
	</div>
	<input class="needscontrast bg-transparent p-0.5 pl-1 border" bind:value on:keypress={keypress} />
</div>

<style>
	table {
		table-layout: fixed;
	}
	tr {
		height: 35px;
		max-height: 35px;
	}
	td {
		text-align: left;
		border: 1px solid;
		padding: 5px;
		width: 100%;
	}

	tr:nth-child(odd) {
		background-color: rgba(180, 180, 180, 0.2);
	}
</style>
