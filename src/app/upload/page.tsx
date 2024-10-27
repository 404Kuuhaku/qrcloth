"use client";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import SendIcon from "@mui/icons-material/Send";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import { useMemo, useState } from "react";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useForm, Controller } from "react-hook-form";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import axios from "axios";

export default function UploadPage() {
	const {
		register,
		control,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

	const handleFilesChange = (files: FileList | null) => {
		if (files) {
			const fileArray = Array.from(files);
			setSelectedFiles(fileArray);
		}
	};

	const onSubmit = async (data) => {
		console.log("Form Data: ", data);
		// console.log(data.expire_date);

		try {
			const formData = new FormData();
			selectedFiles.forEach((file) => formData.append("files", file));

			const response = await axios.post(
				"http://localhost:3000/api/image/upload",
				formData,
				{
					headers: { "Content-Type": "multipart/form-data" },
				}
			);
			console.log(response.data);
		} catch (error) {
			console.error("Error uploading files:", error);
		}
	};

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
			<form onSubmit={handleSubmit(onSubmit)}>
				<Typography
					variant="h2"
					component="h2"
					textAlign="center"
					sx={{ pt: 10 }}
				>
					IMAGE UPLOAD PAGE
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
					<Box sx={{ mx: 10 }}>
						<Box
							sx={{
								width: { xs: 200, lg: 400 },
								height: { xs: 150, lg: 300 },
								borderRadius: 6,
								bgcolor: "#9b9b9b",
								display: "flex",
								flexDirection: "column",
								justifyContent: "center",
								alignItems: "center",
								mb: 5,
							}}
						>
							{selectedFiles.length === 0 ? (
								<>
									<CloudUploadIcon
										sx={{
											color: "#121212",
											width: 200,
											height: 200,
											alignSelf: "center",
										}}
									/>
									<Typography
										variant="h5"
										component="h5"
										textAlign="center"
										sx={{ color: "#121212" }}
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
										padding: 1,
									}}
								>
									{selectedFiles.map((file, index) => (
										<Box
											key={index}
											sx={{
												width: "48%",
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
						<Controller
							name="files"
							control={control}
							defaultValue={[]}
							render={({ field }) => (
								<Button
									component="label"
									variant="contained"
									startIcon={<CloudUploadIcon />}
									sx={{ mr: 2 }}
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
								{...register("name")}
								sx={{ my: 1.5 }}
							/>
							<TextField
								required
								id="outlined-required"
								label="Description"
								{...register("description")}
								sx={{ my: 1.5 }}
							/>
							<TextField
								required
								id="outlined-required"
								label="SKU"
								{...register("sku")}
								sx={{ my: 1.5 }}
							/>
							<TextField
								required
								id="outlined-required"
								label="Price"
								type="number"
								{...register("price", { min: 0 })}
								sx={{ my: 1.5 }}
							/>
							<Controller
								name="size"
								control={control}
								rules={{ required: "Size is required" }}
								render={({ field }) => (
									<FormControl
										component="fieldset"
										sx={{ my: 1.5 }}
									>
										<FormLabel component="legend">
											Size
										</FormLabel>
										<RadioGroup
											row
											value={field.value ?? null}
											onChange={(e) =>
												field.onChange(e.target.value)
											}
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
										{errors.size && (
											<Typography
												color="error"
												variant="body2"
											>
												{errors.size.message as string}
											</Typography>
										)}
									</FormControl>
								)}
							/>

							<Controller
								name="posted"
								control={control}
								rules={{ required: "Post Status Is Required" }}
								render={({ field }) => (
									<FormControl
										component="fieldset"
										sx={{ my: 1.5 }}
									>
										<ToggleButtonGroup
											color="primary"
											exclusive
											value={field.value ?? null}
											onChange={(_, newValue) => {
												if (newValue !== null) {
													field.onChange(newValue);
												}
											}}
											aria-label="Post Status"
										>
											<ToggleButton
												value="true"
												sx={{
													textTransform: "uppercase",
												}}
											>
												Posted
											</ToggleButton>
											<ToggleButton
												value="false"
												sx={{
													textTransform: "uppercase",
												}}
											>
												Not Poste
											</ToggleButton>
										</ToggleButtonGroup>
										{errors.posted && (
											<Typography
												color="error"
												variant="body2"
											>
												{
													errors.posted
														.message as string
												}
											</Typography>
										)}
									</FormControl>
								)}
							/>

							<Box sx={{ my: 1.5 }}>
								<Typography gutterBottom>
									Expire Date
								</Typography>
								<Controller
									name="expire_date"
									control={control}
									rules={{
										required: "Expire Date is required",
									}}
									render={({ field, fieldState }) => (
										<>
											<DatePicker
												label="Expire Date"
												value={field.value || null}
												onChange={(newValue) =>
													field.onChange(newValue)
												}
												slotProps={{
													textField: {
														error: !!fieldState.error,
														helperText:
															fieldState.error
																?.message,
													},
												}}
											/>
										</>
									)}
								/>
							</Box>
							<Button
								variant="contained"
								endIcon={<SendIcon />}
								sx={{ my: 1.5 }}
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
