// @models/product.ts
import { model, models, Schema } from "mongoose";

export interface IImages {
	image_path: string;
}

const ImageSchema = new Schema<IImages>(
	{
		image_path: { type: String, required: true },
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
	// name: string;
	sku: string;
	shirt_type: string;
	size: string;
	price: number;
	details?: string;
	expire_date?: Date;

	images: IImages[];
	qr_code_data?: IQRCode;

	status: "available" | "unavailable" | "sold-out" | "expire";
	posted: boolean;
	buyer_name?: string;
	buy_date?: Date;
}

const ProductSchema = new Schema<IProduct>(
	{
		// name: { type: String, required: true },
		details: { type: String },
		price: { type: Number, required: true },
		size: { type: String, required: true },
		images: { type: [ImageSchema], required: true },
		qr_code_data: { type: QRCodeSchema },
		sku: { type: String, required: true, unique: true },
		status: {
			type: String,
			enum: ["available", "unavailable", "sold-out", "expire"],
			default: "available",
		},
		posted: {
			type: Boolean,
			required: true,
			default: false,
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
