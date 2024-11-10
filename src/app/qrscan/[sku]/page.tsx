"use client";
import * as React from "react";
import { useEffect, useState } from "react";
import {
	Typography,
	Button,
	Box,
	Stack,
	TextField,
	FormControl,
	FormLabel,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SaveIcon from "@mui/icons-material/Save";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import axios from "axios";

export default function EditProductInfoPage({
	params,
}: {
	params: { sku: string };
}) {
	const { sku } = React.use(params);
	const skuUpperCase = sku.toUpperCase();
	console.log(sku);

	const [loading, setLoading] = useState(true);
	const [skuProduct, setSkuProduct] = useState("");
	const [alignment, setAlignment] = useState("");
	const [imgUrl, setImgUrl] = useState("");
	// const [ showImage , setShowingImage ] = React.useState('');

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			try {
				const response = await axios.get(
					`http://localhost:3000/api/product/update/${skuUpperCase}`
				);
				setSkuProduct(response.data.product.sku);
				setAlignment(response.data.product.status);
				setImgUrl(response.data.product.image_url);
				console.log(response.data.product);
			} catch (error) {
				console.error(error);
			}
			setLoading(false);
		};

		fetchData();
	}, [skuUpperCase]);

	// console.log(imgUrl);

	const handleUpdate = async () => {
		console.log("status", alignment);

		if (alignment === "not-active") {
			const response = await axios.put(
				`http://localhost:3000/api/product/clear/${skuUpperCase}`
			);
			console.log(response);
			return;
		}

		const response = await axios.put(
			`http://localhost:3000/api/product/update/${skuUpperCase}`,
			{ status: alignment }
		);
		console.log(response);
	};

	const handleChange = (
		event: React.MouseEvent<HTMLElement>,
		newAlignment: string
	) => {
		setAlignment(newAlignment);
	};

	return (
		<>
			{loading ? (
				<Typography
					// variant="h6"
					variant="h5"
					component="h2"
					textAlign="center"
					sx={{
						pt: { xs: 5, md: 10 },
						fontSize: { xs: "1.5rem", md: "2rem" },
					}}
				>
					Loading...
				</Typography>
			) : (
				<>
					<Typography
						variant="h4"
						component="h2"
						textAlign="center"
						sx={{
							pt: { xs: 5, md: 10 },
							fontSize: { xs: "1.5rem", md: "2rem" },
						}}
					>
						Edit Product Information: {skuUpperCase}
					</Typography>
					<Box
						sx={{
							display: "flex",
							flexDirection: { xs: "column", md: "row" },
							alignItems: "center",
							justifyContent: "center",
							width: "100%",
							height: "auto",
							mx: "auto",
							p: { xs: 2, md: 5 },
						}}
					>
						<Box
							sx={{
								mx: { xs: 0, md: 5 },
								mb: { xs: 3, md: 0 },
								width: { xs: "100%", md: "auto" },
							}}
						>
							{!imgUrl ? (
								<Box
									sx={{
										width: { xs: "100%", sm: 200, lg: 400 },
										height: { xs: 150, sm: 200, lg: 300 },
										borderRadius: 6,
										bgcolor: "#9b9b9b",
										display: "flex",
										flexDirection: "column",
										justifyContent: "center",
										alignItems: "center",
										mb: 2,
									}}
								>
									<CloudUploadIcon
										sx={{
											color: "#121212",
											width: {
												xs: 100,
												sm: 150,
												lg: 200,
											},
											height: {
												xs: 100,
												sm: 150,
												lg: 200,
											},
											alignSelf: "center",
										}}
									/>
									<Typography
										// variant="h6"
										variant="h5"
										component="h2"
										textAlign="center"
										sx={{ color: "#121212", mt: 1 }}
									>
										Product Image
									</Typography>
								</Box>
							) : (
								<Box
									sx={{
										width: { xs: "100%", sm: 200, lg: 400 },
										height: { xs: 150, sm: 200, lg: 300 },
										borderRadius: 6,
										display: "flex",
										flexDirection: "column",
										justifyContent: "center",
										alignItems: "center",
										mb: 2,

										backgroundImage: `url(/${imgUrl})`,
										backgroundRepeat: "no-repeat",
										// backgroundImage: imgUrl,
										backgroundSize: "cover",
										backgroundPosition: "center",
									}}
								/>
							)}
						</Box>
						<Box
							sx={{
								width: { xs: "auto", md: "auto" },
								px: { xs: 1, sm: 3, md: 5 },
							}}
						>
							<Stack spacing={2}>
								<TextField
									disabled
									id="outlined"
									label="SKU"
									type="string"
									sx={{ my: 1.5 }}
									fullWidth
									defaultValue={skuProduct}
								/>
								<FormControl sx={{ my: 1.5 }}>
									<FormLabel id="demo-row-radio-buttons-group-label">
										Size
									</FormLabel>
									<ToggleButtonGroup
										color="primary"
										value={alignment}
										exclusive
										onChange={handleChange}
										aria-label="Product Status"
										fullWidth
									>
										<ToggleButton
											value="available"
											sx={{ textTransform: "uppercase" }}
										>
											Available
										</ToggleButton>
										<ToggleButton
											value="working"
											sx={{ textTransform: "uppercase" }}
										>
											Working
										</ToggleButton>
										<ToggleButton
											value="sold-out"
											sx={{ textTransform: "uppercase" }}
										>
											Sold-out
										</ToggleButton>
										<ToggleButton
											value="expired"
											sx={{ textTransform: "uppercase" }}
										>
											Expired
										</ToggleButton>
										<ToggleButton
											value="not-active"
											sx={{ textTransform: "uppercase" }}
										>
											Not-Active
										</ToggleButton>
									</ToggleButtonGroup>
								</FormControl>
								<Button
									variant="contained"
									endIcon={<SaveIcon />}
									sx={{ my: 1.5 }}
									onClick={handleUpdate}
								>
									Update
								</Button>
							</Stack>
						</Box>
					</Box>
				</>
			)}
		</>
	);
}
