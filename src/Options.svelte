<script>
	import { clickOutside } from "./util";
	import ColorPicker from "./ColorPicker.svelte";
	export let sizex, sizey;
	export let gridHeightElem, gridWidthElem;

	let rawSizex = sizex;
	let rawSizey = sizey;
	$: if (typeof rawSizex == "number") sizex = rawSizex = Math.max(1, rawSizex);
	$: if (typeof rawSizey == "number") sizey = rawSizey = Math.max(1, rawSizey);

	let selectedBackground = localStorage.getItem("background") || "defaultbg";

	$: setBg(selectedBackground);
	function setBg(bg) {
		document.body.classList.remove("oldbg");
		document.body.classList.remove("darkbg");
		document.body.classList.remove("defaultbg");
		document.body.classList.add(bg);
		localStorage.setItem("background", bg);
	}

	let rgba = { r: 255, g: 255, b: 255, a: 0.2 };
	if (localStorage.getItem("colorscheme")) rgba = JSON.parse(localStorage.getItem("colorscheme"));
	let pickerOpen = false;
	function rgbaChange({ detail: rgba }) {
		localStorage.setItem("colorscheme", JSON.stringify(rgba));
		let rootStyle = document.documentElement.style;
		rootStyle.setProperty("--theme-bg", `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`);
	}

	let rgba2 = { r: 0, g: 0, b: 0, a: 1 };
	if (localStorage.getItem("colorscheme2")) rgba2 = JSON.parse(localStorage.getItem("colorscheme2"));
	let picker2Open = false;
	function rgbaChange2({ detail: rgba2 }) {
		localStorage.setItem("colorscheme2", JSON.stringify(rgba2));
		let rootStyle = document.documentElement.style;
		rootStyle.setProperty("--theme-text", `rgba(${rgba2.r}, ${rgba2.g}, ${rgba2.b}, ${rgba2.a})`);
	}

	let melu = localStorage.getItem("melu") === "true";
	$: {
		localStorage.setItem("melu", melu);
		setMelu(melu);
	}

	function setMelu(checked) {
		let rootStyle = document.documentElement.style;
		if (!checked) {
			rootStyle.setProperty("--32image", 'url("../img/32.png")');
			rootStyle.setProperty("--16image", 'url("../img/16.png")');
		} else {
			rootStyle.setProperty("--16image", 'url("../img/32.png")');
			rootStyle.setProperty("--32image", 'url("../img/16.png")');
		}
	}
</script>

<div class="needscontrast rounded p-1">
	<h2>Options</h2>
	<p>
		Grid width: <input
			bind:this={gridWidthElem}
			class="bg-transparent border w-12 pl-1"
			type="number"
			bind:value={rawSizex}
			min="1"
			max="50"
		/><br />
	</p>
	<p>
		Grid height: <input bind:this={gridHeightElem} class="bg-transparent border w-12 pl-1" type="number" bind:value={rawSizey} min="1" max="50" />
	</p>
	<p>
		Melu moment: <input class="opacity-70" type="checkbox" bind:checked={melu} />
	</p>
	<p>
		Background:
		<select class="bg-transparent" bind:value={selectedBackground}>
			<option class="bg-transparent" value="defaultbg">Default</option>
			<option class="bg-transparent" value="darkbg">Dark</option>
			<option class="bg-transparent" value="oldbg">Original</option>
		</select>
	</p>
	<p>
		Custom color: <button on:click={() => (pickerOpen = true)} class="align-text-top w-6 h-6 border bg-white/20" />
	</p>
	<div class:invisible={!pickerOpen} use:clickOutside on:outclick={() => (pickerOpen = false)} class="absolute translate-y-[10px]">
		<ColorPicker startRGBA={rgba} on:colorChange={rgbaChange} />
	</div>

	<p>
		Text color: <button on:click={() => (picker2Open = true)} class="align-text-top w-6 h-6 border bg-white/20" />
	</p>
	<div class:invisible={!picker2Open} use:clickOutside on:outclick={() => (picker2Open = false)} class="absolute translate-y-[10px]">
		<ColorPicker startRGBA={rgba2} on:colorChange={rgbaChange2} />
	</div>
</div>

<style global>
	body.oldbg {
		background: rgba(0, 0, 0, 0) url("../img/tausta.png") no-repeat fixed center center / cover;
	}
	body.darkbg {
		background-image: url("../bginverted.png");
	}
	body.defaultbg {
		background-image: url("../bg.png");
	}
	.textcontainer,
	.needscontrast {
		background-color: var(--theme-bg);
		color: var(--theme-text);
	}
	input.needscontrast::placeholder {
		color: #666;
	}
</style>
