// @models/skuCounter.ts
import { model, models, Schema } from "mongoose";

export interface ISKUCounter {
	prefix: string;
	counter: number;
}

const SKUCounterSchema = new Schema<ISKUCounter>({
	prefix: { type: String, required: true, unique: true },
	counter: { type: Number, default: 0 },
});

const SKUCounterModel =
	models.SKUCounter || model("SKUCounter", SKUCounterSchema);

export default SKUCounterModel;
