// src/app/api/product/update/[sku]/route.ts

import connectMongo from "@/libs/mongo/connectMongo";
import { NextRequest, NextResponse } from "next/server";
import { HttpStatusCode } from "axios";
import ProductModel, { IProduct } from "@/models/product";

export async function GET(
	req: NextRequest,
	{ params }: { params: { sku: string } }
) {
	try {
		const sku = await params.sku;

		const filter = { sku };
		await connectMongo();

		const product = await ProductModel.findOne(filter);
		return NextResponse.json({ product });
	} catch (error) {
		return NextResponse.json(
			{
				message: "Error fetching product",
				error: error,
			},
			{ status: HttpStatusCode.InternalServerError }
		);
	}
}

// export async function PUT(
// 	req: NextRequest,
// 	{ params }: { params: { sku: string } }
// ) {
// 	try {
// 		await connectMongo();

// 		const sku = await params.sku;
// 		const filter = { sku };
// 		const data: IProduct = await req.json();
// 		const updatedProduct = await ProductModel.findOneAndUpdate(
// 			filter,
// 			data,
// 			{
// 				new: true,
// 			}
// 		);

// 		// TODOS : UPLOAD NEW IMG IF IT'S HAS AND CHANG IMG AND PATH ALSO
// 		return NextResponse.json(updatedProduct, {
// 			status: HttpStatusCode.Accepted,
// 		});
// 	} catch (error) {
// 		return NextResponse.json(
// 			{
// 				message: "Error updating product",
// 				error: error,
// 			},
// 			{ status: HttpStatusCode.BadRequest }
// 		);
// 	}
// }

export async function PUT(
	req: NextRequest,
	{ params }: { params: { sku: string } }
) {
	try {
		await connectMongo();
		const sku = await params.sku;
		const { status }: { status: string } = await req.json();
		// Validate status value
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

		// Find the product by SKU
		const product = await ProductModel.findOne({ sku });

		if (!product) {
			return NextResponse.json(
				{ message: "Product not found" },
				{ status: HttpStatusCode.NotFound }
			);
		}

		// Prepare the update object
		const updateData: any = { status };

		// If transitioning from 'expire' to 'working', increment the repeat field
		if (product.status === "expire" && status === "working") {
			// updateData.$inc = { repeat: 1 }; // Increment repeat by 1

			const updatedProduct = await ProductModel.findOneAndUpdate(
				{ sku },
				{ $set: updateData, $inc: { repeat: 1 } },
				{ new: true }
			);
			return NextResponse.json(updatedProduct, {
				status: HttpStatusCode.Accepted,
			});
		} else {
			const updatedProduct = await ProductModel.findOneAndUpdate(
				{ sku },
				{ $set: updateData },
				{ new: true }
			);

			return NextResponse.json(updatedProduct, {
				status: HttpStatusCode.Accepted,
			});
		}
	} catch (error) {
		// Error handling
		return NextResponse.json(
			{
				message: "Error updating product",
				error: error,
			},
			{ status: HttpStatusCode.BadRequest }
		);
	}
}
