// @models/product.ts
import { model, models, Schema } from "mongoose";

export interface IProduct {
	sku: string;
	sku_with_underscore: string;
	prefix: string;

	shirt_key: string;
	shirt_size: number;
	shirt_number: number;

	image_file_path?: string;
	image_url?: string;

	qrcode_file_path?: string;
	qrcode_url?: string;

	status: "available" | "working" | "sold-out" | "expire" | "not-active";

	expire_date?: Date;

	repeat: number;
}

const ProductSchema = new Schema<IProduct>(
	{
		sku: { type: String, required: true, unique: true },
		sku_with_underscore: { type: String, required: true, unique: true },
		prefix: { type: String, required: true },

		shirt_key: { type: String, required: true },
		shirt_size: { type: Number, required: true },
		shirt_number: { type: Number, required: true },

		image_file_path: { type: String },
		image_url: { type: String },

		qrcode_file_path: { type: String },
		qrcode_url: { type: String },

		status: {
			type: String,
			enum: ["available", "working", "sold-out", "expire", "not-active"],
			default: "not-active",
			required: true,
		},

		expire_date: { type: Date },

		repeat: { type: Number, default: 1, required: true },
	},
	{
		timestamps: true,
	}
);

const ProductModel = models.Product || model("Product", ProductSchema);
export default ProductModel;
