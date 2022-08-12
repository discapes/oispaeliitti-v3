import { MongoClient } from "mongodb";

const mongoClient = new MongoClient("mongodb://127.0.0.1:27017");
await mongoClient.connect();

const database = mongoClient.db("oispaeliitti");
const db = database.collection("accounts");
export default db;

export async function pingDB() {
	return (await database.command({ ping: 1 })).ok;
}

process.on("exit", () => mongodb.close());
