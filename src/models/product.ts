// @models/product.ts
import { model, models, Schema } from "mongoose";

export interface IImages {
	image_path: string;
	image_url: string;
}

const ImageSchema = new Schema<IImages>(
	{
		image_path: { type: String, required: true },
		image_url: { type: String, required: true },
	},
	{ _id: false }
);

export interface IQRCode {
	qrcode_url: string;
	qrcode_path: string;
}

const QRCodeSchema = new Schema<IQRCode>(
	{
		qrcode_url: { type: String, required: true, unique: true },
		qrcode_path: { type: String, required: true },
	},
	{ _id: false }
);

export interface IProduct {
	sku: string;
	prefix: string;

	shirt_key: string;
	shirt_size: string;

	images: IImages[];
	qr_code_data?: IQRCode;

	status: "available" | "sold-out" | "expire";
}

const ProductSchema = new Schema<IProduct>(
	{
		sku: { type: String, required: true, unique: true },
		prefix: { type: String, required: true },

		shirt_key: { type: String, required: true },
		shirt_size: { type: String, required: true },

		images: { type: [ImageSchema], required: true },
		qr_code_data: { type: QRCodeSchema },

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
