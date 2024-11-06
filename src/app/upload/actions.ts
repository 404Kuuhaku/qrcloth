// src/app/upload/actions.ts
"use server";

import fs from "fs";
import path from "path";
// import { generateSKU } from "./path/to/skuGenerator"; // Update with your actual path

export async function saveImages(files: File[]) {
	const uploadsDir = path.join(process.cwd(), "public/storage/image");
	if (!fs.existsSync(uploadsDir)) {
		fs.mkdirSync(uploadsDir, { recursive: true });
	}

	const imageDetails = [];

	for (const file of files) {
		const filePath = path.join(uploadsDir, file.name);
		const buffer = Buffer.from(await file.arrayBuffer());
		fs.writeFileSync(filePath, buffer);

		imageDetails.push({
			image_file_path: filePath,
			image_url: `storage/image/${file.name}`,
		});
	}

	return imageDetails;
}
