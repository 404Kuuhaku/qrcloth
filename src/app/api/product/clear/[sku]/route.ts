// // src/app/api/product/clear/[sku]/route.ts

import connectMongo from "@/libs/mongo/connectMongo";
import { NextRequest, NextResponse } from "next/server";
import { HttpStatusCode } from "axios";
import ProductModel from "@/models/product";
import fs from "fs";

export async function PUT(
	req: NextRequest,
	{ params }: { params: { sku: string } }
) {
	try {
		await connectMongo();

		const sku = params.sku;

		const product = await ProductModel.findOne({ sku });
		if (!product) {
			return NextResponse.json(
				{ message: `Product with SKU ${sku} not found.` },
				{ status: HttpStatusCode.NotFound }
			);
		}

		const imagePath = product.image_file_path;
		if (imagePath) {
			const fullPath = imagePath;
			if (fs.existsSync(fullPath)) {
				try {
					fs.unlinkSync(fullPath);
					console.log(`Deleted image: ${fullPath}`);
				} catch (error) {
					console.error(`Error deleting file: ${fullPath}`, error);
				}
			} else {
				console.log(`Image not found at path: ${fullPath}`);
			}
		}

		const updatedProduct = await ProductModel.findOneAndUpdate(
			{ sku },
			{
				$unset: {
					image_file_path: "",
					image_url: "",
					expire_date: "",
				},
				$set: {
					status: "not-active",
					repeat: 1,
				},
			},
			{ new: true }
		);

		return NextResponse.json(updatedProduct, {
			status: HttpStatusCode.Accepted,
		});
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{
				message: "Error clearing slot",
				error: error,
			},
			{ status: HttpStatusCode.BadRequest }
		);
	}
}
