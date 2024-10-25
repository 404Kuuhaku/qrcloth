"use client";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import Button from "@mui/material/Button";
import { useMemo } from "react";
import { styled } from "@mui/material/styles";

export default function QRCodeScanPage() {
	const VisuallyHiddenInput = useMemo(() => {
		return styled("input")({
			clip: "rect(0 0 0 0)",
			clipPath: "inset(50%)",
			height: 1,
			overflow: "hidden",
			position: "absolute",
			bottom: 0,
			left: 0,
			whiteSpace: "nowrap",
			width: 1,
		});
	}, []);
	return (
		<>
			<Typography
				variant="h2"
				component="h2"
				textAlign="center"
				sx={{ pt: 10 }}
			>
				QR CODE SCAN PAGE
			</Typography>
			<Box
				sx={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					width: "80vw",
					height: "70vh",
					mx: "auto",
				}}
			>
				<Box>
					<Box
						sx={{
							width: {
								xs: 200,
								lg: 400,
							},
							height: {
								xs: 150,
								lg: 300,
							},
							borderRadius: 6,
							// bgcolor: "primary.main",
							bgcolor: "#9b9b9b",
							display: "flex",
							flexDirection: "column",
							justifyContent: "center",
							alignItems: "center",
							mb: 5,
							// "&:hover": {
							// 	bgcolor: "#5b5b5b",
							// },
						}}
					>
						<QrCodeScannerIcon
							sx={{
								color: "#121212",
								// mx: "auto",
								width: 200,
								height: 200,
								alignSelf: "center",
							}}
						/>
					</Box>
					<Button
						component="label"
						role={undefined}
						variant="contained"
						tabIndex={-1}
						startIcon={<CloudUploadIcon />}
						sx={{ mr: 2 }}
					>
						Upload From Device
						<VisuallyHiddenInput
							type="file"
							onChange={(event) =>
								console.log(event.target.files)
							}
							multiple
						/>
					</Button>
					<Button
						component="label"
						role={undefined}
						variant="contained"
						tabIndex={-1}
						startIcon={<CameraAltIcon />}
					>
						Open Camera
					</Button>
				</Box>
			</Box>
		</>
	);
}
