"use client";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
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
			<Box sx={{ display: "flex", width: "80vw", mx: "auto" }}>
				<Box sx={{ mr: 30 }}>
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
				<Box>
					<Stack>
						<TextField
							required
							id="outlined-required"
							label="Name"
						/>
						<TextField
							required
							id="outlined-required"
							label="Price"
							type="number"
						/>
						<FormControl>
							<FormLabel id="demo-row-radio-buttons-group-label">
								Gender
							</FormLabel>
							<RadioGroup
								row
								aria-labelledby="demo-row-radio-buttons-group-label"
								name="row-radio-buttons-group"
							>
								<FormControlLabel
									value="female"
									control={<Radio />}
									label="Female"
								/>
								<FormControlLabel
									value="male"
									control={<Radio />}
									label="Male"
								/>
								<FormControlLabel
									value="other"
									control={<Radio />}
									label="Other"
								/>
								<FormControlLabel
									value="disabled"
									disabled
									control={<Radio />}
									label="other"
								/>
							</RadioGroup>
						</FormControl>
					</Stack>
				</Box>
			</Box>
		</>
	);
}
