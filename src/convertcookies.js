// convert old version cookies to new

let debugMap = new Map([
    ["accounts", '{"asdasdas":"6e3e285523bb1","kertt":"8bb8271259adc","sllfsajlflasf":"90628476fec07"}'],
    ["bestScore", "532"],
    ["logged", '{"username":"asdasdas","uuid":"6e3e285523bb1"}'],
])
let newMap = new Map();

export default function oldToNew() {
    // const get = (k) => localStorage.getItem(k);
    // const set = (k, v) => localStorage.getItem(k, v);
    const get = (k) => debugMap.get(k);
    const set = (k,v) => newMap.set(k, v);

    let highscore = get("bestScore");
    set("highscore", highscore);

    let logged = get("logged");
    if (logged && logged !== "null") set("saved-acc", JSON.parse(logged).username);

    let accounts = get("accounts");
    if (accounts) {
        let accountsObject = JSON.parse(accounts);
        for (let name in accountsObject) {
            set(name + "-secret", accountsObject[name]);
        }
    }
    console.log(newMap);
}