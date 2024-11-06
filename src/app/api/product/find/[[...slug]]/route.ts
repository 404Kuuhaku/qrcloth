// src/app/api/product/find/route.ts

import connectMongo from "@/libs/mongo/connectMongo";
import { NextRequest, NextResponse } from "next/server";
import { HttpStatusCode } from "axios";
import ProductModel from "@/models/product";

interface ProductQuery {
	status?: string;
	prefix?: string;
	sku?: string;
}

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ slug: string }> }
) {
	try {
		const { slug } = await params;
		const [status, prefix, sku] = slug || [];
		const query: ProductQuery = {};
		if (status) query.status = status;
		if (prefix) query.prefix = prefix;
		if (sku) query.sku = sku;
		console.log("query", query);

		await connectMongo();

		const products = await ProductModel.find(query);
		const count = await ProductModel.countDocuments(query);
		return NextResponse.json({ products, count });
	} catch (error) {
		return NextResponse.json(
			{
				message: "Error fetching products",
				error: error,
			},
			{ status: HttpStatusCode.InternalServerError }
		);
	}
}
