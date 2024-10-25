"use client";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import SendIcon from "@mui/icons-material/Send";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import { useMemo } from "react";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

export default function UploadPage() {
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
			<Box
				sx={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					width: "80vw",
					height: "100vh",
					mx: "auto",
					// pt: 10,
				}}
			>
				<Box sx={{ mx: 10 }}>
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
						<CloudUploadIcon
							sx={{
								color: "#121212",
								// mx: "auto",
								width: 200,
								height: 200,
								alignSelf: "center",
							}}
						/>
						<Typography
							variant="h5"
							component="h5"
							textAlign="center"
							sx={{
								color: "#121212",
							}}
						>
							Product Image
						</Typography>
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
				<Box sx={{ mx: 10 }}>
					<Stack>
						<TextField
							required
							id="outlined-required"
							label="Name"
							sx={{ my: 1.5 }}
						/>
						<TextField
							required
							id="outlined-required"
							label="Price"
							type="number"
							sx={{ my: 1.5 }}
						/>
						<FormControl sx={{ my: 1.5 }}>
							<FormLabel id="demo-row-radio-buttons-group-label">
								Size
							</FormLabel>
							<RadioGroup
								row
								aria-labelledby="demo-row-radio-buttons-group-label"
								name="row-radio-buttons-group"
							>
								<FormControlLabel
									value="S"
									control={<Radio />}
									label="S"
								/>
								<FormControlLabel
									value="M"
									control={<Radio />}
									label="M"
								/>
								<FormControlLabel
									value="L"
									control={<Radio />}
									label="L"
								/>
								<FormControlLabel
									value="XL"
									control={<Radio />}
									label="XL"
								/>
							</RadioGroup>
						</FormControl>
						<Box sx={{ my: 1.5 }}>
							<Typography gutterBottom>Expire Date</Typography>
							<DatePicker />
						</Box>

						<Button
							variant="contained"
							endIcon={<SendIcon />}
							sx={{ my: 1.5 }}
						>
							Send
						</Button>
					</Stack>
				</Box>
			</Box>
		</>
	);
}
