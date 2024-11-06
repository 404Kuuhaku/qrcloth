// src/app/api/product/clear/[sku]/route.ts

import connectMongo from "@/libs/mongo/connectMongo";
import { NextRequest, NextResponse } from "next/server";
import { HttpStatusCode } from "axios";
import ProductModel from "@/models/product";

export async function PUT(
	req: NextRequest,
	{ params }: { params: { sku: string } }
) {
	try {
		await connectMongo();

		const sku = await params.sku;
		const filter = { sku };
		const newProductData = {
			image_file_path: undefined,
			image_url: undefined,
			status: "not-active",
			expire_date: undefined,
			repeat: 1,
		};
		const updatedProduct = await ProductModel.findOneAndUpdate(
			filter,
			newProductData,
			{
				new: true,
			}
		);

        // TODOS : DELETE IMG 
		return NextResponse.json(updatedProduct, {
			status: HttpStatusCode.Accepted,
		});
	} catch (error) {
		return NextResponse.json(
			{
				message: "Error clearing slot",
				error: error,
			},
			{ status: HttpStatusCode.BadRequest }
		);
	}
}
