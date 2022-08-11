import { createRequire } from "module";
export const require = createRequire(import.meta.url);

import { fileURLToPath } from "url";
const path = require("path");
export const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function formatDate(date) {
	let y = date.getFullYear();
	let m = date.getMonth();
	let d = date.getDate();
	let hh = date.getHours();
	let mm = date.getMinutes();
	let ss = date.getSeconds();
	return [hh, mm, ss].map((n) => String(n).padStart(2, "0")).join(":") + " on " + [d, m, y].join(".");
}

export class PingCounter {
	get avgPingsPerSec() {
		return this.avgPingsPerSec;
	}
	ping() {
		this.pingsLastNSecs++;
	}

	pingsLastNSecs = 0;
	avgPingsPerSec = 0;
	constructor(updateInterval) {
		this.updateInterval = updateInterval;
		setInterval(() => {
			this.avgPingsPerSec = Math.round(this.pingsLastNSecs / this.updateInterval);
			this.pingsLastNSecs = 0;
		}, this.updateInterval * 1000);
	}
}
