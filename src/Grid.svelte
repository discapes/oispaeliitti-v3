<script>
	export let grid;
	let tileContainer;

	$: update(grid);

	function update(grid) {
		window.requestAnimationFrame(() => {
			while (tileContainer.firstChild) tileContainer.removeChild(tileContainer.firstChild);
			for (let col of grid.cells) for (let cell of col) if (cell) drawTile(cell);
		});
	}

	function drawTile(tile) {
		let wrapper = document.createElement("div");
		let inner = document.createElement("div");
		let position = tile.previousPosition || { x: tile.x, y: tile.y };

		// We can't use classlist because it somehow glitches when replacing classes
		let classes = ["tile", "tile-" + Math.min(MAX_TILE, tile.value)];

		applyClasses(wrapper, classes);
		wrapper.style = `transform: translate(${125 * position.x}px, ${125 * position.y}px);`;

		inner.classList.add("tile-inner");

		if (tile.previousPosition) {
			// Make sure that the tile gets rendered in the previous position first
			window.requestAnimationFrame(function () {
				applyClasses(wrapper, classes); // Update the position
				wrapper.style = `transform: translate(${125 * tile.x}px, ${125 * tile.y}px);`;
			});
		} else if (tile.mergedFrom) {
			classes.push("tile-merged");
			applyClasses(wrapper, classes);

			// Render the tiles that merged
			tile.mergedFrom.forEach(function (merged) {
				drawTile(merged);
			});
		} else {
			classes.push("tile-new");
			applyClasses(wrapper, classes);
		}

		wrapper.appendChild(inner);
		tileContainer.appendChild(wrapper);

		function applyClasses(element, classes) {
			element.setAttribute("class", classes.join(" "));
		}
	}
</script>

<div class="absolute z-10 translate-y-[16px] translate-x-[16px]" bind:this={tileContainer} />
<div
	class="grid grid-flow-col gap-[15px] p-4 bg-black/10 rounded"
	style={`grid-template-rows: repeat(${grid.sizey}, minmax(0, 1fr)); grid-template-columns: repeat(${grid.sizex}`}
>
	{#each { length: grid.sizex * grid.sizey } as _}
		<div class="min-h-[110px] min-w-[110px] bg-black/20 rounded" />
	{/each}
</div>

<style global>
	.tile,
	.tile .tile-inner {
		width: 110px;
		height: 110px;
		overflow: hidden;
	}

	.tile {
		color: rgba(0, 0, 0, 0);
		position: absolute;
		transition: 100ms ease-in-out;
		transition-property: transform;
	}

	.tile .tile-inner {
		border-radius: 3px;
		background: #eee4da;
		text-align: center;
		font-weight: bold;
		z-index: 10;
	}
	.tile.tile-2 .tile-inner {
		background: #fff url("../img/2.png");
		background-size: cover;
		box-shadow: 0 0 30px 10px rgba(243, 215, 116, 0), inset 0 0 0 1px rgba(255, 255, 255, 0);
	}

	.tile.tile-4 .tile-inner {
		background: #fff url("../img/4.png");
		background-size: cover;
		box-shadow: 0 0 30px 10px rgba(243, 215, 116, 0), inset 0 0 0 1px rgba(255, 255, 255, 0);
	}

	.tile.tile-8 .tile-inner {
		background: #fff url("../img/8.png");
		background-size: cover;
	}

	.tile.tile-16 .tile-inner {
		background: #fff var(--16image);
		background-size: cover;
	}

	.tile.tile-32 .tile-inner {
		background: #fff var(--32image);
		background-size: cover;
	}

	.tile.tile-64 .tile-inner {
		background: #fff url("../img/64.png");
		background-size: cover;
	}

	.tile.tile-128 .tile-inner {
		background: #fff url("../img/128.png");
		background-size: cover;
	}

	.tile.tile-256 .tile-inner {
		background: #fff url("../img/256.png");
		background-size: cover;
	}

	.tile.tile-512 .tile-inner {
		background: #fff url("../img/512.png");
		background-size: cover;
	}

	.tile.tile-1024 .tile-inner {
		background: #fff url("../img/1024.png");
		background-size: cover;
	}

	.tile.tile-2048 .tile-inner {
		background: #fff url("../img/2048.png");
		background-size: cover;
	}

	.tile.tile-4096 {
		border-radius: 3px;
		background-size: cover;

		background: linear-gradient(
				rgba(255, 0, 0, 1) 0%,
				rgba(255, 154, 0, 1) 10%,
				rgba(208, 222, 33, 1) 20%,
				rgba(79, 220, 74, 1) 30%,
				rgba(63, 218, 216, 1) 40%,
				rgba(47, 201, 226, 1) 50%,
				rgba(28, 127, 238, 1) 60%,
				rgba(95, 21, 242, 1) 70%,
				rgba(186, 12, 248, 1) 80%,
				rgba(251, 7, 217, 1) 90%,
				rgba(255, 0, 0, 1) 100%
			)
			0 0/100% 800%;
		animation: a 4s linear infinite;
	}

	@keyframes a {
		to {
			background-position: 0 -200%;
		}
	}

	.tile.tile-4096 .tile-inner {
		border-radius: 3px;
		background: url("../img/4096.png");
		background-size: cover;
	}

	@-webkit-keyframes appear {
		0% {
			opacity: 0;
			-webkit-transform: scale(0);
			-moz-transform: scale(0);
			transform: scale(0);
		}

		100% {
			opacity: 1;
			-webkit-transform: scale(1);
			-moz-transform: scale(1);
			transform: scale(1);
		}
	}

	@-moz-keyframes appear {
		0% {
			opacity: 0;
			-webkit-transform: scale(0);
			-moz-transform: scale(0);
			transform: scale(0);
		}

		100% {
			opacity: 1;
			-webkit-transform: scale(1);
			-moz-transform: scale(1);
			transform: scale(1);
		}
	}

	@keyframes appear {
		0% {
			opacity: 0;
			-webkit-transform: scale(0);
			-moz-transform: scale(0);
			transform: scale(0);
		}

		100% {
			opacity: 1;
			-webkit-transform: scale(1);
			-moz-transform: scale(1);
			transform: scale(1);
		}
	}

	.tile-new .tile-inner {
		-webkit-animation: appear 200ms ease 100ms;
		-moz-animation: appear 200ms ease 100ms;
		animation: appear 200ms ease 100ms;
		-webkit-animation-fill-mode: backwards;
		-moz-animation-fill-mode: backwards;
		animation-fill-mode: backwards;
	}

	@-webkit-keyframes pop {
		0% {
			-webkit-transform: scale(0);
			-moz-transform: scale(0);
			transform: scale(0);
		}

		50% {
			-webkit-transform: scale(1.2);
			-moz-transform: scale(1.2);
			transform: scale(1.2);
		}

		100% {
			-webkit-transform: scale(1);
			-moz-transform: scale(1);
			transform: scale(1);
		}
	}

	@-moz-keyframes pop {
		0% {
			-webkit-transform: scale(0);
			-moz-transform: scale(0);
			transform: scale(0);
		}

		50% {
			-webkit-transform: scale(1.5);
			-moz-transform: scale(1.5);
			transform: scale(1.5);
		}

		100% {
			-webkit-transform: scale(1);
			-moz-transform: scale(1);
			transform: scale(1);
		}
	}

	@keyframes pop {
		0% {
			-webkit-transform: scale(0);
			-moz-transform: scale(0);
			transform: scale(0);
		}

		50% {
			-webkit-transform: scale(1.5);
			-moz-transform: scale(1.5);
			transform: scale(1.5);
		}

		100% {
			-webkit-transform: scale(1);
			-moz-transform: scale(1);
			transform: scale(1);
		}
	}

	.tile-merged .tile-inner {
		z-index: 20;
		-webkit-animation: pop 200ms ease 100ms;
		-moz-animation: pop 200ms ease 100ms;
		animation: pop 200ms ease 100ms;
		-webkit-animation-fill-mode: backwards;
		-moz-animation-fill-mode: backwards;
		animation-fill-mode: backwards;
	}
</style>
