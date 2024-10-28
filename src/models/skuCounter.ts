// @models/skuCounter.ts
import { model, models, Schema } from "mongoose";

export interface ISKUCounter {
	prefix: string;
	sku_counter: number;
}

const SKUCounterSchema = new Schema<ISKUCounter>({
	prefix: { type: String, required: true, unique: true },
	sku_counter: { type: Number, default: 0 },
});

const SKUCounterModel =
	models.SKUCounter || model("SKUCounter", SKUCounterSchema);

export default SKUCounterModel;
