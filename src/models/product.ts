// @models/product.ts
import { model, models, Schema } from "mongoose";

export interface IProduct {
	sku: string;
	prefix: string;

	shirt_key: string;
	shirt_size: string;

	image_file_path: string;
	image_url: string;

	qrcode_file_path: string;
	qrcode_url: string;

	status: "available" | "sold-out" | "expire";
}

const ProductSchema = new Schema<IProduct>(
	{
		sku: { type: String, required: true, unique: true },
		prefix: { type: String, required: true },

		shirt_key: { type: String, required: true },
		shirt_size: { type: String, required: true },

		image_file_path: { type: String, required: true },
		image_url: { type: String, required: true },

		qrcode_file_path: { type: String, required: true },
		qrcode_url: { type: String, required: true },

		status: {
			type: String,
			enum: ["available", "sold-out", "expire"],
			default: "available",
		},
	},
	{
		timestamps: true,
	}
);

const ProductModel = models.Product || model("Product", ProductSchema);
export default ProductModel;
