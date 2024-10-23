// @libs/mongo/connectMongo.ts
import mongoose from "mongoose";

const MONGO_URI = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cloth.4eqg3.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`;

const cached: {
	connection?: typeof mongoose;
	promise?: Promise<typeof mongoose>;
} = {};
async function connectMongo() {
	if (!MONGO_URI) {
		throw new Error(
			"Please define the MONGO_URI environment variable inside .env.local"
		);
	}
	if (cached.connection) {
		return cached.connection;
	}
	if (!cached.promise) {
		const opts = {
			bufferCommands: false,
		};
		cached.promise = mongoose.connect(MONGO_URI, opts);
	}
	try {
		cached.connection = await cached.promise;
	} catch (e) {
		cached.promise = undefined;
		throw e;
	}
	return cached.connection;
}
export default connectMongo;
