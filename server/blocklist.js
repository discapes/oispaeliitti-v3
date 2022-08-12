import * as express from "express";
import { __dirname } from "./util.js";
import { writeFile, readFile } from "fs/promises";

const router = express.Router();
export default router;
let bl;
try {
	bl = (await readFile(__dirname + "blocklist.txt"))
		.toString()
		.split(" ")
		.filter((i) => i);
} catch (e) {
	bl = [];
}
export { bl as blocklist };

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.post("/", async (req, res) => {
	bl = req.body.text.split(/\s+/);
	writeFile(__dirname + "blocklist.txt", bl.join(" "));
	res.set("location", `${req.headers.origin}/bllist.html`);
	res.sendStatus(303);
});

router.get("/", async (req, res) => {
	res.send(bl.join(" "));
});
