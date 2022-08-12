<script>
	import { clickOutside } from "./util";
	import ColorPicker from "./ColorPicker.svelte";
	import { background, meluMode, themeColor, textColor } from "./effects";
	export let sizex, sizey;
	export let gridHeightElem, gridWidthElem;

	let sizeXSel = sizex;
	let sizeYSel = sizey;
	$: if (typeof sizeXSel == "number") sizex = sizeXSel = Math.max(1, sizeXSel);
	$: if (typeof sizeYSel == "number") sizey = sizeYSel = Math.max(1, sizeYSel);

	let backgroundSel = background.value;
	let meluModeSel = meluMode.value;
	$: background.set(backgroundSel);
	$: meluMode.set(meluModeSel);
</script>

<div class="needscontrast rounded p-1">
	<h2>Options</h2>
	<p>
		Grid width: <input
			bind:this={gridWidthElem}
			class="bg-transparent border w-12 pl-1"
			type="number"
			bind:value={sizeXSel}
			min="1"
			max="50"
		/><br />
	</p>
	<p>
		Grid height: <input
			bind:this={gridHeightElem}
			class="bg-transparent border w-12 pl-1"
			type="number"
			bind:value={sizeYSel}
			min="1"
			max="50"
		/><br />
	</p>
	<p>
		Melu moment: <input class="opacity-70" type="checkbox" bind:checked={meluModeSel} />
	</p>
	<p>
		Background:
		<select class="bg-transparent" bind:value={backgroundSel}>
			{#each background.list as bg}
				<option class="bg-transparent" value={bg}>{bg}</option>
			{/each}
		</select>
	</p>
	<!-- <p>
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
	</div> -->
</div>

<style global>
	.textcontainer,
	.needscontrast {
		background-color: var(--theme-bg);
		color: var(--theme-text);
	}
	input.needscontrast::placeholder {
		color: #666;
	}
</style>
