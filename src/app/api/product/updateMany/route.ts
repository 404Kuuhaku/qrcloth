// import connectMongo from "@/libs/mongo/connectMongo";
// import { NextRequest, NextResponse } from "next/server";
// import { HttpStatusCode } from "axios";
// import ProductModel from "@/models/product";

// export async function PUT(req: NextRequest) {
// 	try {
// 		await connectMongo();

// 		const { skuList, status }: { skuList: string[]; status: string } =
// 			await req.json(); // Expecting both SKUs and status

// 		// Update the status of all selected products to the provided status
// 		const updatedProducts = await ProductModel.updateMany(
// 			{ sku: { $in: skuList } }, // Find products where SKU is in the provided list
// 			{ $set: { status } } // Dynamically set the status
// 		);

// 		return NextResponse.json(updatedProducts, {
// 			status: HttpStatusCode.Accepted,
// 		});
// 	} catch (error) {
// 		return NextResponse.json(
// 			{
// 				message: "Error updating products",
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

export async function PUT(req: NextRequest) {
	try {
		await connectMongo();

		const { skuList, status }: { skuList: string[]; status: string } =
			await req.json(); // Expecting both SKUs and status

		if (
			![
				"available",
				"working",
				"sold-out",
				"expire",
				"not-active",
			].includes(status)
		) {
			return NextResponse.json(
				{ message: "Invalid status value" },
				{ status: HttpStatusCode.BadRequest }
			);
		}

		// Fetch current statuses of products
		const products = await ProductModel.find({ sku: { $in: skuList } });

		// Update products conditionally
		const bulkOperations = products.map((product) => {
			if (product.status === "expire" && status === "working") {
				return {
					updateOne: {
						filter: { sku: product.sku },
						update: { $set: { status }, $inc: { repeat: 1 } },
					},
				};
			} else {
				return {
					updateOne: {
						filter: { sku: product.sku },
						update: { $set: { status } },
					},
				};
			}
		});

		if (bulkOperations.length > 0) {
			await ProductModel.bulkWrite(bulkOperations);
		}

		return NextResponse.json(
			{ message: "Products updated successfully" },
			{ status: HttpStatusCode.Accepted }
		);
	} catch (error) {
		return NextResponse.json(
			{
				message: "Error updating products",
				error: error,
			},
			{ status: HttpStatusCode.BadRequest }
		);
	}
}
