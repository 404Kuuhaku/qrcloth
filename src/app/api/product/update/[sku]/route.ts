// src/app/api/product/update/[sku]/route.ts

import connectMongo from "@/libs/mongo/connectMongo";
import { NextRequest, NextResponse } from "next/server";
import { HttpStatusCode } from "axios";
import ProductModel from "@/models/product";

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

export async function PUT(
	req: NextRequest,
	{ params }: { params: { sku: string } }
) {
	try {
		await connectMongo();
		const sku = await params.sku;
		const { status }: { status: string } = await req.json();
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

		const product = await ProductModel.findOne({ sku });

		if (!product) {
			return NextResponse.json(
				{ message: "Product not found" },
				{ status: HttpStatusCode.NotFound }
			);
		}

		const updateData: any = { status };

		if (product.status === "expire" && status === "working") {
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
		return NextResponse.json(
			{
				message: "Error updating product",
				error: error,
			},
			{ status: HttpStatusCode.BadRequest }
		);
	}
}
