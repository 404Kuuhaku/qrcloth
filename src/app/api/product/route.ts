// src/app/api/product/route.ts

import connectMongo from "@/libs/mongo/connectMongo";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { HttpStatusCode } from "axios";
import ProductModel, { IProduct, IImages } from "@/models/product";
import QRCode from "qrcode";
import strToBool from "@/libs/common/strToBool/strToBool";

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

export async function POST(req: NextRequest) {
	try {
		const data = await req.formData();
		const files = data.getAll("files") as File[];

		if (!files.length) {
			return NextResponse.json(
				{ error: "No files uploaded" },
				{ status: 400 }
			);
		}

		const uploadsDir = path.join(process.cwd(), "public/storage");

		if (!fs.existsSync(uploadsDir)) {
			fs.mkdirSync(uploadsDir, { recursive: true });
		}

		const imagesData: IImages[] = [];

		const fileInfos = await Promise.all(
			files.map(async (file) => {
				const filePath = path.join(uploadsDir, file.name);
				const buffer = Buffer.from(await file.arrayBuffer());
				fs.writeFileSync(filePath, buffer);

				imagesData.push({ image_path: `storage/${file.name}` });

				return { fileName: file.name, filePath };
			})
		);

		console.log("Files uploaded successfully");
		console.log("Files Info", fileInfos);

		const postedStr = data.get("posted") as string
		const postedConverted = strToBool(postedStr);

		await connectMongo();

		const newProductData = {
			name: data.get("name"),
			details: data.get("details"),
			price: data.get("price"),
			size: data.get("size"),

			images: imagesData,

			sku: data.get("sku"),
			posted: postedConverted,
			expire_date: data.get("expire_date"),
		};

		const newProduct = new ProductModel(newProductData);
		await newProduct.save();


		const qrCodeUrl = `http://localhost:3000/qrscan/${newProduct._id}`;

		// Generate the QR code image and save it
		const qrCodePath = path.join(uploadsDir, `QR_${newProduct._id}.png`);
		await QRCode.toFile(qrCodePath, qrCodeUrl);

		// Update the product with QR code data
		newProduct.qr_code_data = {
			qrcode_url: qrCodeUrl,
			qrcode_path: `storage/QR_${newProduct._id}.png`,
		};
		await newProduct.save();


		return NextResponse.json(newProduct, { status: 201 });
	} catch (error) {
		return NextResponse.json(
			{
				message: "Error creating product",
				error: error,
			},
			{ status: HttpStatusCode.BadRequest }
		);
	}

	// try {
	// 	await connectMongo();
	// 	const data: IProduct = await req.json();
	// 	const newProduct = new ProductModel(data);
	// 	await newProduct.save();
	// 	return NextResponse.json(newProduct, { status: 201 });
	// } catch (error) {
	// 	return NextResponse.json(
	// 		{
	// 			message: "Error creating product",
	// 			error: error,
	// 		},
	// 		{ status: HttpStatusCode.BadRequest }
	// 	);
	// }
}
