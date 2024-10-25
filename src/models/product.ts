// @models/product.ts
import { model, models, Schema } from "mongoose";

export interface IProduct {
	name: string;
	details?: string;
	image_path: string;
	qrcode_url: string;
	sku: string;
	status: "available" | "unavailable" | "sold-out" | "expire";
	buyer_name?: string;
	buy_date?: Date;
	expire_date: Date;
}

const ProductSchema = new Schema<IProduct>(
	{
		name: { type: String, required: true },
		details: { type: String },
		image_path: { type: String, required: true },
		qrcode_url: { type: String, required: true, unique: true },
		sku: { type: String, required: true, unique: true },
		status: {
			type: String,
			enum: ["available", "unavailable", "sold-out", "expire"],
			default: "available",
		},
		buyer_name: {
			type: String,
		},
		buy_date: {
			type: Date,
		},
		expire_date: {
			type: Date,
		},
	},
	{
		timestamps: true,
	}
);

const ProductModel = models.Product || model("Product", ProductSchema);
export default ProductModel;
