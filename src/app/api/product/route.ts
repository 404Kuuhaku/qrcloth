// src/app/api/product/route.ts

import connectMongo from "@/libs/mongo/connectMongo";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { HttpStatusCode } from "axios";
import ProductModel from "@/models/product";
import QRCode from "qrcode";
import generateSKU from "@/libs/server/SKU/generateSKU";
import generatePrefix from "@/libs/server/SKU/generatePrefix";

export async function GET() {
	try {
		await connectMongo();
		const products = await ProductModel.find();
		return NextResponse.json(products);
	} catch (error) {
		return NextResponse.json(
			{
				message: "Error fetching products",
				error: error,
			},
			{ status: 500 }
		);
	}
}

// export async function POST(req: NextRequest) {
// 	try {
// 		const data = await req.formData();

// 		const files = data.getAll("files") as File[];
// 		const quantity = parseInt((data.get("quantity") as string) || "0");

// 		const shirt_key = data.get("shirt_key") as string;
// 		const shirt_size = data.get("shirt_size") as string;

// 		const prefix = await generatePrefix(shirt_key, shirt_size);
// 		const sku = await generateSKU(prefix);

// 		let image_file_path: string;
// 		let image_url: string;

// 		if (!files.length) {
// 			return NextResponse.json(
// 				{ error: "No files uploaded" },
// 				{ status: 400 }
// 			);
// 		}

// 		if (files.length != quantity) {
// 			return NextResponse.json(
// 				{ error: "Quantity of images quantity are inconsistent" },
// 				{ status: 400 }
// 			);
// 		}

// 		const uploadsDir = path.join(process.cwd(), "public/storage");

// 		if (!fs.existsSync(uploadsDir)) {
// 			fs.mkdirSync(uploadsDir, { recursive: true });
// 		}

// 		for (let index = 0; index < quantity; index++) {
// 			const file = files[index];
// 			const filePath = path.join(uploadsDir, file.name);
// 			const buffer = Buffer.from(await file.arrayBuffer());
// 			fs.writeFileSync(filePath, buffer);

// 			image_file_path = filePath;
// 			image_url = `storage/${file.name}`;

// 			console.log("Files uploaded successfully");

// 			await connectMongo();

// 			const newProductData = {
// 				sku,
// 				prefix,
// 				shirt_key,
// 				shirt_size,
// 				image_file_path,
// 				image_url,
// 			};

// 			const newProduct = new ProductModel(newProductData);
// 			await newProduct.save();

// 			const qrCodeData = `http://localhost:3000/qrscan/${newProduct._id}`;
// 			const qrCodePath = path.join(
// 				uploadsDir,
// 				`QR_${newProduct._id}.png`
// 			);
// 			await QRCode.toFile(qrCodePath, qrCodeData);

// 			newProduct.qr_code_data = {
// 				qrcode_url: `storage/QR_${newProduct._id}.png`,
// 				qrcode_path: qrCodePath,
// 			};
// 			await newProduct.save();

// 			return NextResponse.json(newProduct, { status: 201 });
// 		}
// 	} catch (error) {
// 		return NextResponse.json(
// 			{
// 				message: "Error creating product",
// 				error: error,
// 			},
// 			{ status: HttpStatusCode.BadRequest }
// 		);
// 	}
// }

export async function POST(req: NextRequest) {
	try {
		const data = await req.formData();

		const files = data.getAll("files") as File[];
		const quantity = parseInt((data.get("quantity") as string) || "0");
		const shirt_key = data.get("shirt_key") as string;
		const shirt_size = data.get("shirt_size") as string;

		// Logging each part to ensure data is coming through correctly
		console.log("Files:", files);
		console.log("Quantity:", quantity);
		console.log("Shirt Key:", shirt_key);
		console.log("Shirt Size:", shirt_size);

		const prefix = await generatePrefix(shirt_key, shirt_size);
		// const sku = await generateSKU(prefix);

		if (!files.length) {
			return NextResponse.json(
				{ error: "No files uploaded" },
				{ status: 400 }
			);
		}

		if (files.length !== quantity) {
			return NextResponse.json(
				{
					error: "Quantity of images and quantity value are inconsistent",
				},
				{ status: 400 }
			);
		}

		const uploadsDir = path.join(process.cwd(), "public/storage");
		if (!fs.existsSync(uploadsDir)) {
			fs.mkdirSync(uploadsDir, { recursive: true });
		}

		const uploadedProducts = [];

		// await connectMongo();
		for (let index = 0; index < quantity; index++) {
			const sku = await generateSKU(prefix);

			const file = files[index];
			const filePath = path.join(uploadsDir, file.name);
			const buffer = Buffer.from(await file.arrayBuffer());
			fs.writeFileSync(filePath, buffer);

			const image_file_path = filePath;
			const image_url = `storage/${file.name}`;

			await connectMongo();

			const newProductData = {
				sku,
				prefix,
				shirt_key,
				shirt_size,
				image_file_path,
				image_url,
			};

			const newProduct = new ProductModel(newProductData);
			await newProduct.save();

			const qrCodeData = `http://localhost:3000/qrscan/${newProduct._id}`;
			const qrCodePath = path.join(
				uploadsDir,
				`QR_${newProduct._id}.png`
			);
			await QRCode.toFile(qrCodePath, qrCodeData);

			newProduct.qrcode_url = `storage/QR_${newProduct._id}.png`;
			newProduct.qrcode_file_path = qrCodePath;
			await newProduct.save();

			uploadedProducts.push(newProduct);
		}

		return NextResponse.json(uploadedProducts, { status: 201 });
	} catch (error) {
		console.error("Error creating product:", error);
		return NextResponse.json(
			{
				message: "Error creating product",
				error: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: HttpStatusCode.BadRequest }
		);
	}
}
