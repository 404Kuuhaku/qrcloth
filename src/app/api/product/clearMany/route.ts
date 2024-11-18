// // src/app/api/product/clearMany/route.ts

import connectMongo from "@/libs/mongo/connectMongo";
import { NextRequest, NextResponse } from "next/server";
import { HttpStatusCode } from "axios";
import ProductModel from "@/models/product";
import fs from "fs";

export async function PUT(req: NextRequest) {
	try {
		await connectMongo();

		const { skuList }: { skuList: string[] } = await req.json();

		const products = await ProductModel.find({ sku: { $in: skuList } });

		const imagePathsToDelete: string[] = products
			.map((product) => product.image_file_path)
			.filter((filePath) => !!filePath);

		const deletedFiles: string[] = [];
		const notFoundFiles: string[] = [];

		for (const imagePath of imagePathsToDelete) {
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
				error: error,
			},
			{ status: HttpStatusCode.BadRequest }
		);
	}
}
