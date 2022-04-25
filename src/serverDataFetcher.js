import { writable, get } from "svelte/store";
import { makeURL } from "./util";

// maps server data to writables (readable)
export default class ServerDataFetcher {
	
	leaderboard = writable();
	motd = writable({ greeting: "Getting message of the day..." });
	ilmoituksetHTML = writable("Loading ilmoitukset...");
	infoHTML = writable("Loading info...");
	ilmoituksetVersion = writable(0);

	constructor() {
		fetch(makeURL('ilmoitukset')).then(async res => {
			this.ilmoituksetVersion.set(res.headers.get('version'));
			this.ilmoituksetHTML.set(await res.text())
			console.log(`Loaded ilmoitukset HTML: ${get(this.ilmoituksetHTML).slice(0, 20)}...`);
			console.log(`Loaded ilmoitukset version: ${get(this.ilmoituksetVersion)}`);
		});
		fetch(makeURL('info')).then(async res => {
			this.infoHTML.set(await res.text());
			console.log(`Loaded info HTML: ${get(this.infoHTML).slice(0, 20)}...`);
		});

		setInterval((function poll() {
			fetch(makeURL('highscores')).then((res) => res.json())
				.then(lb => this.leaderboard.set(lb))
				.catch(e => {
					this.leaderboard.set([{ name: "[ error ]", highscore: "[ error ]" }]);
					throw e;
				});
			fetch(makeURL('hello')).then((res) => res.json())
				.then(motd => this.motd.set(motd))
				.catch(e => {
					this.motd.set("Couldn't connect to server!");
					throw e;
				});
			return poll.bind(this);
		}).bind(this)(), 1000);
	}
}