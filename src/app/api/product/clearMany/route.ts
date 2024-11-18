// // src/app/api/product/clearMany/route.ts

// import connectMongo from "@/libs/mongo/connectMongo";
// import { NextRequest, NextResponse } from "next/server";
// import { HttpStatusCode } from "axios";
// import ProductModel from "@/models/product";

// export async function PUT(req: NextRequest) {
// 	try {
// 		await connectMongo();

// 		const { skuList, status }: { skuList: string[]; status: string } =
// 			await req.json();

// 		const updatedProducts = await ProductModel.updateMany(
// 			{ sku: { $in: skuList } },
// 			{
// 				$unset: {
// 					image_file_path: "",
// 					image_url: "",
// 					expire_date: "",
// 				},
// 				$set: {
// 					status: "not-active",
// 					repeat: 1,
// 				},
// 			}
// 		);

// 		// TODOS : DELETE IMG
// 		return NextResponse.json(updatedProducts, {
// 			status: HttpStatusCode.Accepted,
// 		});
// 	} catch (error) {
// 		return NextResponse.json(
// 			{
// 				message: "Error clearing slots",
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

export async function PUT(req: NextRequest) {
	try {
		// Connect to MongoDB
		await connectMongo();

		// Parse the request body
		const { skuList }: { skuList: string[] } = await req.json();

		// Fetch the products with the given SKUs
		const products = await ProductModel.find({ sku: { $in: skuList } });

		// Collect image paths to delete
		const imagePathsToDelete: string[] = products
			.map((product) => product.image_file_path)
			.filter((filePath) => !!filePath); // Ensure only valid file paths are included

		// Delete images from the filesystem
		const uploadsDir = path.join(process.cwd(), "public/storage/image");
		const deletedFiles: string[] = [];
		const notFoundFiles: string[] = [];

		for (const imagePath of imagePathsToDelete) {
			// const fullPath = path.join(uploadsDir, imagePath);
			const fullPath = imagePath;

			if (fs.existsSync(fullPath)) {
				try {
					fs.unlinkSync(fullPath);
					deletedFiles.push(imagePath);
				} catch (error) {
					console.error(`Error deleting file: ${fullPath}`, error);
				}
			} else {
				notFoundFiles.push(imagePath);
			}
		}

		// Update the MongoDB documents
		const updatedProducts = await ProductModel.updateMany(
			{ sku: { $in: skuList } },
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
			}
		);

		// Return response
		return NextResponse.json(
			{
				message: "Products updated successfully",
				deletedFiles,
				notFoundFiles,
				updatedProducts,
			},
			{
				status: HttpStatusCode.Accepted,
			}
		);
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{
				message: "Error clearing slots",
				error: error.message,
			},
			{ status: HttpStatusCode.BadRequest }
		);
	}
}
