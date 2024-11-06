// src/app/api/product/upload/[sku]/route.ts

import connectMongo from "@/libs/mongo/connectMongo";
import { NextRequest, NextResponse } from "next/server";
import { HttpStatusCode } from "axios";
import ProductModel, { IProduct } from "@/models/product";

interface ProductQuery {
	status?: string;
	prefix?: string;
	sku?: string;
}

export async function PUT(
	req: NextRequest,
	{ params }: { params: Promise<{ slug: string }> }
) {
	try {
		// TODOS : MAKE FOR LOOP
		await connectMongo();

		const { slug } = await params;
		const [status, prefix] = slug || [];
		const filter: ProductQuery = {};
		if (status) filter.status = status;
		if (prefix) filter.prefix = prefix;
		console.log("query", filter);

		// const sku = await params.sku;
		// const filter = { sku };

		const data: IProduct = await req.json();
		const uploadedProduct = await ProductModel.findOneAndUpdate(
			filter,
			data,
			{
				new: true,
			}
		).sort({ shirt_number: 1 });
		// const uploadedProduct = await ProductModel.findOneAndUpdate(
		// 	filter,
		// 	data,
		// 	{
		// 		new: true,
		// 	}
		// );

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
