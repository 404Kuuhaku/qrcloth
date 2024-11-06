// src/app/api/product/clear/[sku]/route.ts

import connectMongo from "@/libs/mongo/connectMongo";
import { NextRequest, NextResponse } from "next/server";
import { HttpStatusCode } from "axios";
import ProductModel, { IProduct } from "@/models/product";

export async function PUT(
	req: NextRequest,
	{ params }: { params: { sku: string } }
) {
	try {
		await connectMongo();

		const sku = await params.sku;
        const filter = { sku };
		const data: IProduct = await req.json();
		const updatedProduct = await ProductModel.findOneAndUpdate(filter, data, {
			new: true,
		});

        // TODOS : UPLOAD NEW IMG IF IT'S HAS AND CHANG IMG AND PATH ALSO
		return NextResponse.json(updatedProduct, {
			status: HttpStatusCode.Accepted,
		});
	} catch (error) {
		return NextResponse.json(
			{
				message: "Error updating product",
				error: error,
			},
			{ status: HttpStatusCode.BadRequest }
		);
	}
}
