// src/app/api/product/[id]/route.ts

import connectMongo from "@/libs/mongo/connectMongo";
import { NextRequest, NextResponse } from "next/server";
import { HttpStatusCode } from "axios";
import ProductModel, { IProduct } from "@/models/product";

export async function PUT(
	req: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		await connectMongo();

		const id = await params.id;
		const data: IProduct = await req.json();
		const updatedProduct = await ProductModel.findByIdAndUpdate(id, data, {
			new: true,
		});
		return NextResponse.json(updatedProduct);
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

export async function DELETE(
	req: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		await connectMongo();
		const id = await params.id;
		await ProductModel.findByIdAndDelete(id);
		return NextResponse.json({ message: "Product deleted" });
	} catch (error) {
		return NextResponse.json(
			{
				message: "Error deleting product",
				error: error,
			},
			{ status: HttpStatusCode.BadRequest }
		);
	}
}
