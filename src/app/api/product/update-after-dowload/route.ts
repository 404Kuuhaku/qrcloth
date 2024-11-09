import connectMongo from "@/libs/mongo/connectMongo";
import { NextRequest, NextResponse } from "next/server";
import { HttpStatusCode } from "axios";
import ProductModel from "@/models/product";

// export async function PUT(req: NextRequest) {
// 	try {
// 		await connectMongo();

// 		const skuList: string[] = await req.json(); // Expecting a list of SKUs in the request body

// 		// Update the status of all selected products to 'working'
// 		const updatedProducts = await ProductModel.updateMany(
// 			{ sku: { $in: skuList } }, // Find products where SKU is in the provided list
// 			{ $set: { status: "working" } } // Set the status to 'working'
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

export async function PUT(req: NextRequest) {
	try {
		await connectMongo();

		const { skuList, status }: { skuList: string[]; status: string } =
			await req.json(); // Expecting both SKUs and status

		// Update the status of all selected products to the provided status
		const updatedProducts = await ProductModel.updateMany(
			{ sku: { $in: skuList } }, // Find products where SKU is in the provided list
			{ $set: { status } } // Dynamically set the status
		);

		return NextResponse.json(updatedProducts, {
			status: HttpStatusCode.Accepted,
		});
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
