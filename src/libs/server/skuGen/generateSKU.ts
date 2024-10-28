import SKUCounterModel from "@/models/skuCounter";

const generateSKU = async (shirtType: string, shirtSize: string) => {
	const prefix_filter = shirtType + shirtSize;

	const counterDoc = await SKUCounterModel.findOneAndUpdate(
		{ prefix: prefix_filter },
		{ $inc: { sku_counter: 1 } },
		{ new: true, upsert: true }
	);

    const skuNumber = counterDoc.sku_counter.toString().padStart(2, '0');
    const nextSKU = `${prefix_filter}${skuNumber}`;

	return nextSKU;
};

export default generateSKU;
