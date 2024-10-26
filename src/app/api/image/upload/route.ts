//src/app/api/image/upload/route.ts

import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
	const data = await req.formData();
	const file = data.get("file") as File;

	if (!file) {
		return NextResponse.json(
			{ error: "No file uploaded" },
			{ status: 400 }
		);
	}

	const uploadsDir = path.join(process.cwd(), "src/storage");
	const filePath = path.join(uploadsDir, file.name);

	// Ensure uploads directory exists
	if (!fs.existsSync(uploadsDir)) {
		fs.mkdirSync(uploadsDir, { recursive: true });
	}

	const buffer = Buffer.from(await file.arrayBuffer());
	fs.writeFileSync(filePath, buffer);

	return NextResponse.json({ message: "File uploaded successfully" });
}
