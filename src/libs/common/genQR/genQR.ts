import QRCode from "qrcode";
import { IProduct } from "@/models/product";

const genQR = (productId: string) => {
	const id = productId;
	const url = `http://localhost:3000/qrscan/${id}`;
	const fileName = `${id}.png`;
	// const fileName = `${name}_${sku}.png`

	QRCode.toFile(fileName, url, function (err: unknown) {
		if (err) {
			console.log("can't gen QR Code, Error :", err);
			// console.error(err);
			return;
		}
		console.log("QR code saved to qrcode.png");
	});
};

export default genQR;
