import db from "./database.js";
import { v4 as uuid } from "uuid";
import * as express from "express";

const router = express.Router();
export default router;

router.get(express.json());

router.get("/new", async (req, res) => {
	if (!req.query.name) return res.sendStatus(400);

	if (await db.findOne({ name: req.query.name })) return res.status(422).send("Account already exists");

	const { insertedId } = await db.insertOne({ name: req.query.name, score: 0, _id: uuid() });
	res.json({ secret: insertedId });
});

router.get("/getScore", async (req, res) => {
	if (!req.query.name || !req.query.secret) return res.sendStatus(400);

	let account = await db.findOne({ name: req.query.name, _id: req.query.secret });
	if (!account) return res.status(422).send("No account found with name and secret");
	res.json({ score: account.score });
});

function deawesomemize(str) {
	return decodeURIComponent(String.fromCharCode(...str.split("").map((chr) => chr.charCodeAt(0) / 2)));
}

router.get("/setScore", async (req, res) => {
	let name, secret, score;
	try {
		({ name, secret, score} = JSON.parse(deawesomemize(req.query.str)));
	} catch (e) {
		console.error(e);
		return res.sendStatus(400);
	}

	if (!name || !secret || !score) return res.sendStatus(400);

	let { modifiedCount } = await db.updateOne({ name: name, _id: secret }, { $set: { score: +score } });
	if (modifiedCount) return res.sendStatus(200);
	else return res.status(422).send("No account with name and secret modified");
});
