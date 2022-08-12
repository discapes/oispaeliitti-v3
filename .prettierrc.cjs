module.exports = {
	plugins: [require("prettier-plugin-svelte")],
	useTabs: true,
	tabWidth: 4,
	singleQuote: false,
	trailingComma: "none",
	printWidth: 150,
	singleAttributePerLine: false,
	overrides: [
		{
			files: "*.svelte",
			options: { parser: "svelte" }
		}
	]
};
