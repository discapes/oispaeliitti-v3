<script>
    export let highscores = [];
</script>

<table class="w-full">
    <tr>
        <th>Highscore</th>
        <th class="w-full">Name</th>
    </tr>
    {#each highscores as record}
        <tr>
            <td>{record.score}</td>
            <td>{record.name}</td>
        </tr>
    {/each}
</table>

<style>
    	th,
	td {
		text-align: left;
		border: 1px solid;
		padding: 5px;
	}

	tr:nth-child(odd) {
		background-color: rgba(255, 255, 255, 0.2);
	}
	table tr:first-child th {
		border-top: 0;
	}
	table tr:last-child td {
		border-bottom: 0;
	}
	table tr td:first-child,
	table tr th:first-child {
		border-left: 0;
	}
	table tr td:last-child,
	table tr th:last-child {
		border-right: 0;
	}
</style>