// src/app/api/product/table/route.ts

import connectMongo from "@/libs/mongo/connectMongo";
import { NextRequest, NextResponse } from "next/server";
import { HttpStatusCode } from "axios";
import ProductModel from "@/models/product";

interface ProductQuery {
	status?: string;
	shirt_key?: string;
	shirt_size?: number;
}

export async function GET(req: NextRequest) {
	try {
		const { searchParams } = new URL(req.url);
		const page = parseInt(searchParams.get("page") || "1", 10);
		const limit = 50;
		const skip = (page - 1) * limit;

		const status = searchParams.get("status");
		const type = searchParams.get("type");
		const size = searchParams.get("size");
		const sizeToInt = size ? parseInt(size) : null;

		const filter: ProductQuery = {};
		if (status) filter.status = status;
		if (type) filter.shirt_key = type;
		if (sizeToInt) filter.shirt_size = sizeToInt;
		console.log("table filter", filter);

		await connectMongo();

		const products = await ProductModel.find(filter)
			.skip(skip)
			.limit(limit);

		// Optionally, get the total count for pagination info
		const totalCount = await ProductModel.countDocuments(filter);
		const totalPages = Math.ceil(totalCount / limit);
		return NextResponse.json({
			products,
			pagination: {
				totalItems: totalCount,
				totalPages,
				currentPage: page,
			},
		});
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
