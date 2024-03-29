interface Options {
	name: string;
	list?: string[];
	default: any;
	set(option: any): void;
}

class Remembered implements Options {
	value: string;
	options: Options;
	name: string;
	default: string;
	constructor(options: Options) {
		const lsItem = localStorage.getItem(`setting-${options.name}`);
		this.value = lsItem ? JSON.parse(lsItem) : options.default;
		this.options = options;
		this.name = options.name;
		this.default = options.default;
	}
	set(option: any) {
		this.value = option;
		localStorage.setItem(`setting-${this.options.name}`, JSON.stringify(option));
		this.options.set(option);
	}
	get list() {
		return this.options.list;
	}
}

export const background = new Remembered({
	name: "background",
	default: "Original",
	get list() {
		return [...this.namesToStyles.keys()];
	},
	set(background: string) {
		document.body.style.background = this.namesToStyles.get(background);
	},
	namesToStyles: new Map([
		["Light", `url("../bg.png")`],
		["Dark", `url("../bginverted.png")`],
		["Original", `url("../img/tausta.png") no-repeat fixed center center / cover`]
	])
} as any as Options);

export const meluMode = new Remembered(<Options>{
	name: "meluMode",
	list: ["true", "false"],
	default: "false",
	set(option) {
		const luluImage = 'url("../img/32.png")';
		const meluImage = 'url("../img/16.png")';
		document.documentElement.style.setProperty("--32image", option === "true" ? meluImage : luluImage);
		document.documentElement.style.setProperty("--16image", option === "true" ? luluImage : meluImage);
	}
});

export const themeColor = new Remembered(<Options>{
	name: "themeColor",
	default: { r: 255, g: 255, b: 255, a: 0.2 },
	set(rgba) {
		document.documentElement.style.setProperty("--theme-bg", `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`);
	}
});

export const textColor = new Remembered(<Options>{
	name: "textColor",
	default: { r: 0, g: 0, b: 0, a: 1 },
	set(rgba) {
		document.documentElement.style.setProperty("--theme-text", `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`);
	}
});
