import connectMongo from "@/libs/mongo/connectMongo";
import SKUCounterModel from "@/models/skuCounter";

const generateSKU = async (prefix: string) => {
	console.log("generateSKU is Connecting to MongoDB...");
	await connectMongo();

	console.log("Generating SKU...");
	const counterDoc = await SKUCounterModel.findOneAndUpdate(
		{ prefix: prefix },
		{ $inc: { counter: 1 } },
		{ new: true, upsert: true }
	);

	if (!counterDoc) {
		throw new Error(`Failed to update counter for prefix: ${prefix}`);
	}

	const skuNumber = counterDoc.counter.toString().padStart(2, "0");
	const nextSKU = `${prefix}${skuNumber}`;

	console.log("SKU generated:", nextSKU);
	return nextSKU;
};

export default generateSKU;
