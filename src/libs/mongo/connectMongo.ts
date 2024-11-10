// @libs/mongo/connectMongo.ts
import mongoose from "mongoose";

// const MONGO_URI = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cloth.4eqg3.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`;
// const MONGO_URI = `mongodb://localhost:27017/QRcloth`;
const MONGO_URI = `mongodb://localhost:27017/${process.env.MONGO_DB}`;


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

// import mongoose from "mongoose";

// const MONGO_URI = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cloth.4eqg3.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`;

// const globalWithMongoose = global as typeof globalThis & {
// 	mongooseConnection: typeof mongoose | undefined;
// 	mongoosePromise: Promise<typeof mongoose> | undefined;
// };

// if (!globalWithMongoose.mongoosePromise) {
// 	const opts = {
// 		bufferCommands: false,
// 		serverSelectionTimeoutMS: 30000,
// 		useNewUrlParser: true,
// 		useUnifiedTopology: true,
// 	};
// 	globalWithMongoose.mongoosePromise = mongoose.connect(MONGO_URI, opts);
// }

// async function connectMongo() {
// 	try {
// 		globalWithMongoose.mongooseConnection =
// 			await globalWithMongoose.mongoosePromise;
// 		return globalWithMongoose.mongooseConnection;
// 	} catch (e) {
// 		globalWithMongoose.mongoosePromise = undefined; // Reset on error
// 		throw e;
// 	}
// }

// export default connectMongo;
