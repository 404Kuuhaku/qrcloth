//src/app/api/image/upload/route.ts

import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
	const data = await req.formData();
	const files = data.getAll("files") as File[];

	if (!files.length) {
		return NextResponse.json(
			{ error: "No files uploaded" },
			{ status: 400 }
		);
	}

	const uploadsDir = path.join(process.cwd(), "public/storage");

	// Ensure uploads directory exists
	if (!fs.existsSync(uploadsDir)) {
		fs.mkdirSync(uploadsDir, { recursive: true });
	}

	const fileInfos = await Promise.all(
		files.map(async (file) => {
			const filePath = path.join(uploadsDir, file.name);
			const buffer = Buffer.from(await file.arrayBuffer());
			fs.writeFileSync(filePath, buffer);

			return { fileName: file.name, filePath };
		})
	);

	return NextResponse.json({
		message: "Files uploaded successfully",
		files: fileInfos,
	});
}
