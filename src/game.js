import { get } from "svelte/store";
import { writable } from "svelte/store";
import Grid from "./grid.js";

// tracks moti and moticost, and maps state to writables
export default class Game {
    score = writable(0);
    moti = writable(0);
    motiCost = writable(this.#calcMotiCost(0 + 1));
    won = writable(false);
    lost = writable(false);
    grid = undefined;
    move = undefined;
    keepPlaying = writable();

    #katkoja = 0;
    #addScoreCbs = [];
    #onMoveCbs = [];

    constructor(sizex, sizey) {
        console.log(`Initializing new game, [${sizex}x${sizey}]`)
        const onWin = () => {
            this.won.set(true);
        }
        const onLoss = () => {
            this.lost.set(true);
        }
        const onAddScore = (add) => {
            this.score.update(s => s + add);
            this.moti.update(m => m + add);
            this.#addScoreCbs.forEach(cb => cb(add));
        }

        this.grid = new Grid(sizex, sizey, { onWin, onLoss, onAddScore });
        this.move = (dir) => {
            if (!get(this.lost) && (!get(this.won) || get(this.keepPlaying))) {
                this.#onMoveCbs.forEach(cb => cb());
                this.grid.move(dir);
            }
        }
    }

    setKeepPlaying() {
        this.keepPlaying.set(true);
    }
    onAddScore(f) {
        this.#addScoreCbs.push(f);
    }
    onMove(f) {
        this.#onMoveCbs.push(f);
    }
    tryKatko() {
        if (get(this.moti) >= get(this.motiCost)) {
            this.moti.update(moti => moti - get(this.motiCost));
            this.motiCost.set(this.#calcMotiCost(++this.#katkoja + 1));
            get(this.grid.katkoReissu());
            this.#onMoveCbs.forEach(cb => cb());
            return true;
        } else {
            return false;
        }
    }
    #calcMotiCost(nthKatko) {
        let x = nthKatko;
        if (x <= 5) return INITIAL_MOTICOSTS[x - 1]; //50 * x^2 - (50 * x) + 1000;
        else return 500 * x ** 2 - 4500 * x + 12000; // (2000), 3000, 5000, 8000, 12000
    }
}

