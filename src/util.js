export function makeURL(path, params = {}) {
	return SERVER + "/" + path + "?" + new URLSearchParams(params).toString();
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

export function clickOutside(node) {
	const handleClick = (event) => {
		if (!node.contains(event.target)) {
			node.dispatchEvent(new CustomEvent("outclick"));
		}
	};

	document.addEventListener("mousedown", handleClick, true);

	return {
		destroy() {
			document.removeEventListener("mousedown", handleClick, true);
		}
	};
}

export function preloadImages() {
	for (let i = 2; i <= 4096; i *= 2) {
		let img = new Image();
		img.src = `../img/${i}.png`;
	}
}
