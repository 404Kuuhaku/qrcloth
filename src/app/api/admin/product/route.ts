// src/app/api/admin/product/route.ts

import connectMongo from "@/libs/mongo/connectMongo";
import { NextRequest, NextResponse } from "next/server";
import { HttpStatusCode } from "axios";
import ProductModel, { IProduct } from "@/models/product";

export async function POST(req: NextRequest) {
	try {
		const data: IProduct[] = await req.json();

		if (!data || !Array.isArray(data) || data.length === 0) {
			return NextResponse.json(
				{ error: "Invalid or empty product data" },
				{ status: HttpStatusCode.BadRequest }
			);
		}

		await connectMongo();

		const result = await ProductModel.insertMany(data);

		return NextResponse.json(result, { status: HttpStatusCode.Created });
	} catch (error) {
		console.error("Error inserting products:", error);
		return NextResponse.json(
			{
				message: "Error inserting products",
				error: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: HttpStatusCode.InternalServerError }
		);
	}
}
