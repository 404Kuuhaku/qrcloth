// src/app/api/product/upload/[sku]/route.ts

import connectMongo from "@/libs/mongo/connectMongo";
import { NextRequest, NextResponse } from "next/server";
import { HttpStatusCode } from "axios";
import ProductModel, { IProduct } from "@/models/product";

export async function PUT(
	req: NextRequest,
	{ params }: { params: { sku: string } }
) {
	try {
		// TODOS : MAKE FOR LOOP
		await connectMongo();

		const sku = await params.sku;
		const filter = { sku };
		const data: IProduct = await req.json();
		const uploadedProduct = await ProductModel.findOneAndUpdate(
			filter,
			data,
			{
				new: true,
			}
		);

		// TODOS : UPLOAD IMG
		return NextResponse.json(uploadedProduct, {
			status: HttpStatusCode.Accepted,
		});
	} catch (error) {
		return NextResponse.json(
			{
				message: "Error uploading product",
				error: error,
			},
			{ status: HttpStatusCode.BadRequest }
		);
	}
}

// export async function DELETE(
// 	req: NextRequest,
// 	{ params }: { params: { sku: string } }
// ) {
// 	try {
// 		await connectMongo();
// 		const sku = await params.sku;
// 		await ProductModel.findByIdAndDelete(sku);
// 		return NextResponse.json({ message: "Product deleted" });
// 	} catch (error) {
// 		return NextResponse.json(
// 			{
// 				message: "Error deleting product",
// 				error: error,
// 			},
// 			{ status: HttpStatusCode.BadRequest }
// 		);
// 	}
// }
