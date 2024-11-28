"use client";
import { List, ListItem, ListItemText, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import SendIcon from "@mui/icons-material/Send";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import { useMemo, useState } from "react";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import { saveImages } from "./actions";

export default function UploadPage() {
	const { register, control, handleSubmit } = useForm();
	const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

	const handleFilesChange = (files: FileList | null) => {
		if (files) {
			const fileArray = Array.from(files);
			setSelectedFiles(fileArray);
		}
	};

	const onSubmit = async (data) => {
		try {
			const shirt_key = data.shirt_key.toUpperCase();
			const shirt_size = parseInt(data.shirt_size);
			const status_filter = "not-active";
			const quantity = parseInt(data.quantity);

			const checking = await axios.get(
				`http://localhost:3000/api/product/find/${status_filter}/${shirt_key}${shirt_size}`
			);

			if (selectedFiles.length !== quantity) {
				throw new Error("Quantity and image quantity not match");
			}

			if (checking.data.count < quantity) {
				throw new Error("Don't have enough slot to add products");
			}

			const imgDetails = await saveImages(selectedFiles);

			imgDetails.forEach(async (image) => {
				const image_file_path = image.image_file_path;
				const image_url = image.image_url;

				const response = await axios.put(
					`http://localhost:3000/api/product/upload/${status_filter}/${shirt_key}${shirt_size}`,
					{
						image_file_path,
						image_url,
						status: "available",
					}
				);
				console.log(response.data);
			});
		} catch (error) {
			console.error("Error uploading files:", error);
		}
	};

	const VisuallyHiddenInput = useMemo(() => {
		return styled("input")({
			display: "none",
		});
	}, []);

	return (
		<>
			<Box
				sx={{
					position: "fixed",
					left: 20,
					top: "20%",
					transform: "translateY(-50%)",
					width: 100,
					padding: 2,
					// backgroundColor: "#B8B8B8",
					boxShadow: 3,
					borderRadius: 1,
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					gap: 2,
				}}
			>
				<List>
					<ListItem button component="a" href="/table">
						<ListItemText primary="Table" />
					</ListItem>
					<ListItem button component="a" href="/upload">
						<ListItemText primary="Upload" />
					</ListItem>
					<ListItem button component="a" href="/qrscan">
						<ListItemText primary="QR Scan" />
					</ListItem>
				</List>
			</Box>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Typography
					variant="h4"
					component="h4"
					textAlign="center"
					sx={{ pt: 5, fontSize: "2rem" }}
				>
					IMAGE UPLOAD PAGE
				</Typography>
				<Box
					sx={{
						display: "flex",
						flexDirection: { xs: "column", md: "row" },
						justifyContent: "center",
						alignItems: "center",
						width: "100%",
						px: 2,
						py: 4,
						maxWidth: "1200px",
						mx: "auto",
					}}
				>
					{/* Image Upload Section */}
					<Box
						sx={{ mb: 3, mx: 2, width: { xs: "100%", md: "50%" } }}
					>
						<Box
							sx={{
								width: "100%",
								height: { xs: 200, md: 300 },
								borderRadius: 4,
								bgcolor: "#9b9b9b",
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								mb: 3,
								overflow: "hidden",
							}}
						>
							{selectedFiles.length === 0 ? (
								<>
									<CloudUploadIcon
										sx={{
											color: "#121212",
											width: 100,
											height: 100,
										}}
									/>
									<Typography
										variant="body1"
										component="div"
										sx={{ color: "#121212", mt: 1 }}
									>
										Product Image
									</Typography>
								</>
							) : (
								<Box
									sx={{
										display: "flex",
										flexWrap: "wrap",
										gap: 1,
										width: "100%",
										height: "100%",
										overflowY: "auto",
										borderRadius: 2,
										bgcolor: "#e0e0e0",
										p: 1,
									}}
								>
									{selectedFiles.map((file, index) => (
										<Box
											key={index}
											sx={{
												width: "100%",
												height: "auto",
												paddingTop: "50%",
												backgroundImage: `url(${URL.createObjectURL(
													file
												)})`,
												backgroundSize: "cover",
												backgroundPosition: "center",
												borderRadius: 1,
											}}
										/>
									))}
								</Box>
							)}
						</Box>

						{/* Hidden Input for Device File Upload */}
						<Controller
							name="files"
							control={control}
							defaultValue={[]}
							render={({ field }) => (
								<Button
									component="label"
									variant="contained"
									startIcon={<CloudUploadIcon />}
									sx={{ width: "100%", mb: 2 }}
								>
									Upload From Device
									<VisuallyHiddenInput
										type="file"
										multiple
										onChange={(event) => {
											const files = event.target.files
												? Array.from(event.target.files)
												: [];
											handleFilesChange(
												event.target.files
											);
											field.onChange(files);
										}}
									/>
								</Button>
							)}
						/>

						{/* Camera Input for Mobile Devices
            <Button
              component="label"
              variant="contained"
              startIcon={<CameraAltIcon />}
              sx={{ width: "100%" }}
            >
              Open Camera
              <VisuallyHiddenInput
                type="file"
                accept="image/*"
                capture="environment"
                onChange={(event) => {
                  const files = event.target.files
                    ? Array.from(event.target.files)
                    : [];
                  handleFilesChange(event.target.files);
                }}
              />
            </Button> */}
					</Box>

					{/* Product Details Section */}
					<Box sx={{ mx: 2, width: { xs: "100%", md: "50%" } }}>
						<Stack spacing={2}>
							<TextField
								required
								label="Product ID"
								{...register("shirt_key")}
							/>
							<TextField
								required
								label="Shirt Size"
								{...register("shirt_size")}
							/>
							<TextField
								required
								label="Quantity"
								{...register("quantity")}
							/>
							<Button
								variant="contained"
								endIcon={<SendIcon />}
								sx={{ mt: 2 }}
								type="submit"
							>
								Send
							</Button>
						</Stack>
					</Box>
				</Box>
			</form>
		</>
	);
}
