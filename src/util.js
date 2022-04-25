export function mkQuery(path, params = {}) {
    return SERVER + "/" + path + "?" + new URLSearchParams(params).toString();
}
export function runQuery(path, params = {}) {
    return fetch(mkQuery(path, params));
}

export function getFormValues(target) {
    const formData = new FormData(target);
    const data = {};
    for (let field of formData) {
        const [key, value] = field;
        data[key] = value;
    }
    return data;
}
    

export function setMelu(checked) {
    let rootStyle = document.documentElement.style;
    if (!checked) {
        rootStyle.setProperty('--32image', 'url("../img/32.png")');
        rootStyle.setProperty('--16image', 'url("../img/16.png")');
    } else {
        rootStyle.setProperty('--16image', 'url("../img/32.png")');
        rootStyle.setProperty('--32image', 'url("../img/16.png")');
    }
}

export function preload() {
    for (let i = 2; i <= 4096; i *= 2) {
        let img = new Image();
        img.src = `../img/${i}.png`;
    }
}