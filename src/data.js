import { mkQuery, runQuery } from "./util.js";
import { writable, get } from 'svelte/store';

// maps server data to writables (readable)
export class NetData {

    highscores = writable();
    motd = writable({ greeting: "Getting message of the day..."});
    ilmoituksetHTML = writable("Loading ilmoitukset...");
    infoHTML = writable("Loading info...");
    ilmoituksetVersion = writable(0);

    // for caching purposes
    constructor(locData) {
        this.highscores.set(get(locData.highscores));
        this.highscores.subscribe(hs => locData.highscores.set(hs));

        runQuery('ilmoitukset').then(async res => {
            this.ilmoituksetVersion.set(res.headers.get('version'));
            this.ilmoituksetHTML.set(await res.text())
            console.log(`Loaded ilmoitukset HTML: ${get(this.ilmoituksetHTML).slice(0, 20)}...`);
            console.log(`Loaded ilmoitukset version: ${get(this.ilmoituksetVersion)}`);
        });
        runQuery('info').then(async res => {
            this.infoHTML.set(await res.text());
            console.log(`Loaded info HTML: ${get(this.infoHTML).slice(0, 20)}...`);
        });
        this.startPolling('highscores', this.highscores, 3000, [{ name: "[ error ]", highscore: "[ error ]" }]);
        this.startPolling('hello', this.motd, 1000, "Couldn't connect to server!");
    }


    startPolling(path, writable, interval, errorValue) {
        function req() {
            runQuery(path)
                .then((res) => {
                    res.json()
                        .then(obj => writable.set(obj))
                        .catch((err) => console.log(`Polled ${path}, error`) || writable.set(errorValue))
                })
                .catch((err) => console.log(`Polled ${path}, error`) || writable.set(errorValue));
        };
        req();
        setInterval(req, interval);
    }
}


// maps writables to localstorage
export class LocData {

    ilmoituksetVersion = writable(localStorage.getItem("ilmoitukset-version") || 0);
    highscores = writable(JSON.parse(localStorage.getItem("highscores")) || []);
    highscore = writable(localStorage.getItem("highscore") || 0);

    constructor() {
        console.log(`Initializing LocData, 
        iv: [${get(this.ilmoituksetVersion)}],
        highscore: [${get(this.highscore)}],
        highscores: [${JSON.stringify(get(this.highscores)).slice(0, 20)}...]`);

        this.ilmoituksetVersion.subscribe(iv => localStorage.setItem("ilmoitukset-version", iv));
        this.highscores.subscribe(hs => localStorage.setItem("highscores", JSON.stringify(hs)));
        this.highscore.subscribe(hs => localStorage.setItem("highscore", hs));
    }
}