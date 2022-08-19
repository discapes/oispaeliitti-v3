import { __dirname } from "./util.js";
import express from "express";
import { readFile } from "fs/promises";
import { createServer as HTTPSCreateServer } from "https";
import { createServer as HTTPCreateServer } from "http";
import db, { pingDB } from "./database.js";
import WebSocket, { WebSocketServer } from "ws";
import { formatDate, PingCounter } from "./util.js";
import accountRouter from "./account.js";
import blocklistRouter, { blocklist } from "./blocklist.js";
import { homedir } from "os";
import { createWriteStream } from "fs";

const app = express();
const dev = process.env.NODE_ENV == "dev";
const activePlayers = new PingCounter(4);

let dbOK = false;
setTimeout(async () => (dbOK = await pingDB()), 1000);

app.use(cors);

app.use("/block_list", blocklistRouter);
app.use("/account", accountRouter);
app.get("/hello", async (req, res) => {
	activePlayers.ping();
	res.json({
		greeting:
			"Server operating normally\n" +
			activePlayers.avgPingsPerSec +
			" currently playing" +
			"\nLocal time is " +
			formatDate(new Date()) +
			"\nDatabase: " +
			(dbOK ? "connected" : "disconnected")
	});
});

let highscores = [];
setInterval(async () => {
	highscores = (await db.aggregate([{ $sort: { score: -1 } }, { $limit: 30 }]).toArray())
		.filter((p) => !blocklist.some((swear) => p.name.includes(swear)))
		.map((p) => ({ name: p.name, score: p.score }));
}, 1000);

app.get("/highscores", async (req, res) => {
	res.json(highscores);
});

app.get("/info", async (req, res) => {
	res.sendFile("info.html", { root: __dirname });
});

app.get("/ilmoitukset", async (req, res) => {
	res.set("version", 11);
	res.sendFile("ilmoitukset.html", { root: __dirname });
});

app.use(errorHandler);

const port = 8443;
let server;
if (process.env.NODE_ENV === "dev") {
	server = HTTPCreateServer(app);
	server.listen(port, () => console.log(`HTTP server listening on port ${port}`));
} else {
	const privateKey = await readFile(homedir + "/privkey.pem");
	const certificate = await readFile(homedir + "/cert.pem");
	server = HTTPSCreateServer(
		{
			key: privateKey,
			cert: certificate
		},
		app
	);
	server.listen(port, () => console.log(`HTTPS server listening on port ${port}`));
}
const wss = new WebSocketServer({ server });
const logStream = createWriteStream('log.txt', {flags: 'a'});
const buffer = [];
wss.on("connection", (ws) => {
	buffer.forEach((msg) => ws.send(msg));
	ws.on("message", (data, isBinary) => {
		if (!data.toString() || !data.toString().replaceAll(" ", "")) return;
		logStream.write(data.toString() + "\n");
		if (blocklist.some((swear) => data.includes(swear))) return;
		buffer.push(data.toString());
		if (buffer.length > 10) buffer.shift();
		[...wss.clients]
			.filter((c) => c.readyState === WebSocket.OPEN)
			.forEach((c) => {
				c.send(data, { binary: isBinary });
			});
	});
});

function cors(req, res, next) {
	res.set("Access-Control-Allow-Origin", "*");
	res.set("Access-Control-Expose-Headers", "*");
	next();
}

function errorHandler(err, req, res, next) {
	console.error(err);
	if (dev) res.send(err.stack);
	else res.sendStatus(500);
}
