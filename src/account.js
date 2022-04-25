import { mkQuery } from './util.js'
import { get } from "svelte/store";

export default async function connectAccount(name, secret) {
    let account = new Account(name, secret);
    await account.connect();
    return account;
}


class Account {

    constructor(name, secret) {
        if (name === undefined) throw new BadRequestError();
        this.name = name;
        this.secret = secret;
    }
    async connect() {
        if (this.secret === undefined) {
            console.log("Creating new account with name " + this.name);
            let url = mkQuery('account/new', { name: this.name });
            let res = await fetch(url);

            if (res.status === 404) throw new Error("Couldn't connect to endpoint: " + res.status);
            else if (res.status !== 200) throw new Error((await res.text()));

            this.secret = (await res.json()).secret;
            console.log("Created account " + this.name + " with secret " + this.secret);
        }
        this.score = await this.#getScore();
    }

    async #getScore() {
        console.log("Getting score from server with name " + this.name + " with secret " + this.secret);
        let url = mkQuery('account/getScore', { name: this.name, secret: this.secret });
        let res = await fetch(url);

        if (res.status === 404) throw new Error("Couldn't connect to endpoint: " + res.status);
        else if (res.status !== 200) throw new Error((await res.text()));

        let score = (await res.json()).score;
        console.log("Got score " + score);
        return score;
    }

    async setScore(score) {
        console.log("Setting score to server with name " + this.name + " with secret " + this.secret);
        let url = mkQuery('account/setScore', { str: String.fromCharCode(...encodeURIComponent(JSON.stringify({ name: this.name, secret: this.secret, score: get(score) })).split('').map(chr => chr.charCodeAt(0) * 2)) });
        let res = await fetch(url);

        if (res.status === 404) throw new Error("Couldn't connect to endpoint: " + res.status);
        else if (res.status !== 200) throw new Error((await res.text()));

        console.log("Set score " + get(score));
        this.score = get(score);
    }
}

