interface Options {
	name: string;
	list?: string[];
	default: string;
	set(option: string);
}

class Remembered {
	value: string;
	constructor(options: Options) {
		this.value = localStorage.getItem(`setting-${options.name}`) || options.default;
	}
}

export const background = new Remembered(<Options>{
	name: "background",
	default: "Original",
	get list() {
		return this.namesToStyles.keys();
	},
	set(background) {
		document.body.style.background = this.namesToStyles.get(background);
	},
	namesToStyles: new Map([
		["Default", `url("../bg.png");`],
		["Dark", `url("../bginverted.png");`],
		["Original", `url("../img/tausta.png") no-repeat fixed center center / cover;`]
	])
});

export const meluMode = new Remembered(<Options>{
	name: "meluMode",
	list: ["true", "false"],
	default: "false",
	set(option) {
		const luluImage = 'url("../img/32.png")';
		const meluImage = 'url("../img/16.png")';
		document.body.style.setProperty("--32image", option === "true" ? meluImage : luluImage);
		document.body.style.setProperty("--32image", option === "true" ? luluImage : meluImage);
	}
});

export const themeColor = new Remembered(<Options>{
	name: "themeColor",
	default: "{ r: 255, g: 255, b: 255, a: 0.2 }",
	set(option) {
		const rgba = JSON.parse(option);
		document.body.style.setProperty("--theme-bg", `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`);
	}
});

export const textColor = new Remembered(<Options>{
	name: "textColor",
	default: "{ r: 0, g: 0, b: 0, a: 1 }",
	set(option) {
		const rgba = JSON.parse(option);
		document.body.style.setProperty("--theme-text", `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`);
	}
});
