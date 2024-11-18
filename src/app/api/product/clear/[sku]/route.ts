// // src/app/api/product/clear/[sku]/route.ts

// import connectMongo from "@/libs/mongo/connectMongo";
// import { NextRequest, NextResponse } from "next/server";
// import { HttpStatusCode } from "axios";
// import ProductModel from "@/models/product";

// export async function PUT(
// 	req: NextRequest,
// 	{ params }: { params: { sku: string } }
// ) {
// 	try {
// 		await connectMongo();

// 		const sku = await params.sku;
// 		const filter = { sku };
// 		// const newProductData = {
// 		// 	image_file_path: undefined,
// 		// 	image_url: undefined,
// 		// 	status: "not-active",
// 		// 	expire_date: undefined,
// 		// 	repeat: 1,
// 		// };
// 		const newProductData = {
// 			$unset: {
// 				image_file_path: "",
// 				image_url: "",
// 				expire_date: "",
// 			},
// 			$set: {
// 				status: "not-active",
// 				repeat: 1,
// 			},
// 		};
// 		const updatedProduct = await ProductModel.findOneAndUpdate(
// 			filter,
// 			newProductData,
// 			{
// 				new: true,
// 			}
// 		);

// 		// TODOS : DELETE IMG
// 		return NextResponse.json(updatedProduct, {
// 			status: HttpStatusCode.Accepted,
// 		});
// 	} catch (error) {
// 		return NextResponse.json(
// 			{
// 				message: "Error clearing slot",
// 				error: error,
// 			},
// 			{ status: HttpStatusCode.BadRequest }
// 		);
// 	}
// }

import connectMongo from "@/libs/mongo/connectMongo";
import { NextRequest, NextResponse } from "next/server";
import { HttpStatusCode } from "axios";
import ProductModel from "@/models/product";
import fs from "fs";
import path from "path";

export async function PUT(
	req: NextRequest,
	{ params }: { params: { sku: string } }
) {
	try {
		await connectMongo();

		// Extract SKU from params
		const sku = params.sku;

		// Find the product by SKU
		const product = await ProductModel.findOne({ sku });
		if (!product) {
			return NextResponse.json(
				{ message: `Product with SKU ${sku} not found.` },
				{ status: HttpStatusCode.NotFound }
			);
		}

		// Get the image file path and delete it if it exists
		const uploadsDir = path.join(process.cwd(), "public/storage/image");
		const imagePath = product.image_file_path;
		if (imagePath) {
			// const fullPath = path.join(uploadsDir, imagePath);
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

		// Update the product document in MongoDB
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
			{ new: true } // Return the updated document
		);

		// Respond with the updated product
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
