const colors = require("tailwindcss/colors");
module.exports = {
	future: {
		purgeLayersByDefault: true,
		removeDeprecatedGapUtilities: true
	},
	theme: {
		extend: {
			screens: {
				touch: { raw: "(hover: none)" },
				mouse: { raw: "(hover: hover)" }
			},
			colors: {
				primary: colors.purple,
				secondary: colors.pink
			}
		}
	},
	plugins: [],
	content: ["./src/**/*.svelte", "./src/**/*.js"]
};
