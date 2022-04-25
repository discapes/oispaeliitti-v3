<script>
	export let game;
	export let highscore;
</script>

<h1 class="needscontrast p-1 rounded">Oispa eliitti</h1>
<div class="textcontainer">
	Moti<br />
	<b>{game.moti}</b>
</div>
<div class="textcontainer">
	Score<br />
	<b>{game.score}</b>
</div>
<div class="textcontainer">
	Highscore<br />
	<b>{highscore}</b>
</div>