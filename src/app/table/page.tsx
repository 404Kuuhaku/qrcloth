"use client";
import React, { useEffect, useState } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Checkbox,
	Button,
	Box,
	TextField,
	TablePagination,
	Typography,
	Select,
	MenuItem,
} from "@mui/material";
import axios from "axios";

interface RowData {
	sku: string;
	type: string;
	size: number;
	status: "available" | "working" | "sold-out" | "expire" | "not-active";
	image_url: string;
	qrcode_url: string;
}

// Function to download QR code image
const downloadQRCode = (url: string) => {
	const link = document.createElement("a");
	// link.href = `/storage/qrcode/${url}`; // Use the URL returned from the API
	link.href = `${url}`; // Use the URL returned from the API
	link.download = url.split("/").pop() || "qrcode.png"; // Get the file name from the URL
	link.click(); // Trigger the download
};

const MyTablePage: React.FC = () => {
	const [loading, setLoading] = useState(true);
	const [rows, setRows] = useState<RowData[]>([]);
	const [filters, setFilters] = useState({
		status: "",
		type: "",
		size: "",
	});
	const [selectedRows, setSelectedRows] = useState<string[]>([]); // Track selected rows
	const [page, setPage] = useState(0);
	const [debounceTimeout, setDebounceTimeout] =
		useState<NodeJS.Timeout | null>(null);
	const [popupVisible, setPopupVisible] = useState(true);
	const [newStatus, setNewStatus] = useState<RowData["status"]>("available");
	const rowsPerPage = 50;

	// Fetch data with filters
	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			try {
				const response = await axios.get(
					`http://localhost:3000/api/product/table?page=${
						page + 1
					}&status=${filters.status}&type=${filters.type}&size=${
						filters.size
					}`
				);
				setRows(response.data.products); // Set the filtered rows returned by the API
			} catch (error) {
				console.error(error);
			}
			setLoading(false);
		};

		fetchData();
	}, [filters, page]); // Fetch data when filters or page change

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			try {
				const response = await axios.get(
					`http://localhost:3000/api/product/table?page=${
						page + 1
					}&status=${filters.status}&type=${filters.type}&size=${
						filters.size
					}`
				);
				setRows(response.data.products); // Set the filtered rows returned by the API
			} catch (error) {
				console.error(error);
			}
			setLoading(false);
		};

		// Debouncing the fetch request to avoid unnecessary calls
		if (debounceTimeout) {
			clearTimeout(debounceTimeout); // Clear the previous timeout
		}
		setDebounceTimeout(setTimeout(fetchData, 500)); // Wait 500ms after the last change

		return () => {
			if (debounceTimeout) {
				clearTimeout(debounceTimeout); // Clean up on component unmount
			}
		};
	}, [filters, page]); // Fetch data when filters or page change

	// Handle row selection/unselection
	const handleCheckboxChange = (sku: string) => {
		setSelectedRows((prevSelected) => {
			const isSelected = prevSelected.includes(sku);
			if (isSelected) {
				return prevSelected.filter((row) => row !== sku); // Deselect row
			} else {
				return [...prevSelected, sku]; // Select row
			}
		});

		const updatedSelection = selectedRows;
		setPopupVisible(updatedSelection.length > 0);
	};

	useEffect(() => {
		console.log("selectedRows", selectedRows);
	}, [selectedRows]);

	// Handle pagination change
	const handleChangePage = (event: unknown, newPage: number) => {
		setPage(newPage);
	};

	// Handle filter changes
	const handleFilterChange = (
		column: keyof typeof filters,
		value: string
	) => {
		setFilters({ ...filters, [column]: value });
	};

	// Function to call API and update selected products' status
	// const handleUpdateStatusToWorking = async () => {
	// 	const fetchData = async () => {
	// 		// setLoading(true);
	// 		try {
	// 			const response = await axios.get(
	// 				`http://localhost:3000/api/product/table?page=${
	// 					page + 1
	// 				}&status=${filters.status}&type=${filters.type}&size=${
	// 					filters.size
	// 				}`
	// 			);
	// 			setRows(response.data.products); // Set the filtered rows returned by the API
	// 		} catch (error) {
	// 			console.error(error);
	// 		}
	// 		// setLoading(false);
	// 	};

	// 	try {
	// 		const response = await axios.put(
	// 			"http://localhost:3000/api/product/update-after-dowload",
	// 			selectedRows // Send the list of selected SKUs
	// 		);
	// 		console.log("Updated products:", response.data);

	// 		fetchData();

	// 		setSelectedRows([]);
	// 	} catch (error) {
	// 		console.error("Error updating products:", error);
	// 	}
	// };
	const handleUpdateStatus = async (status: string) => {
		const fetchData = async () => {
			try {
				const response = await axios.get(
					`http://localhost:3000/api/product/table?page=${
						page + 1
					}&status=${filters.status}&type=${filters.type}&size=${
						filters.size
					}`
				);
				setRows(response.data.products);
			} catch (error) {
				console.error(error);
			}
		};

		try {
			const response = await axios.put(
				"http://localhost:3000/api/product/update-after-dowload",
				{ skuList: selectedRows, status } // Send SKUs and the status
			);
			console.log("Updated products:", response.data);

			fetchData();

			setSelectedRows([]);
		} catch (error) {
			console.error("Error updating products:", error);
		}
	};

	// Modify the handleDownloadQRs function to call the update status API after downloads
	const handleDownloadQRs = () => {
		selectedRows.forEach((sku) => {
			// Find the row with the selected SKU and get the qrcode_url
			const selectedRow = rows.find((row) => row.sku === sku);
			if (selectedRow) {
				downloadQRCode(selectedRow.qrcode_url); // Use the qrcode_url from the API response
			}
		});

		// After downloading, update the status of all selected products to 'working'
		handleUpdateStatus("working");
	};

	// Change the status of selected rows to the selected status
	const handleChangeStatus = () => {
		setPopupVisible(true);
		console.log("newStatus", newStatus);

		// if (selectedRows.length <= 0) {
		// 	// console.log(selectedRows);
		// 	console.log("no product selected");
		// }

		if (selectedRows.length > 0) {
			handleUpdateStatus(newStatus);
		} else {
			// console.log(selectedRows);
			console.log("no product selected");
		}

		// initialRows.forEach((row) => {
		// 	if (selectedRows.includes(row.sku)) {
		// 		row.status = newStatus;
		// 	}
		// });
		// setPopupVisible(true);
		// setSelectedRows([]);
	};

	return (
		<>
			{loading ? (
				<Typography
					// variant="h6"
					variant="h5"
					component="h2"
					textAlign="center"
					sx={{ pt: 5 }}
				>
					Loading...
				</Typography>
			) : (
				<TableContainer
					component={Paper}
					sx={{ maxWidth: 800, margin: "auto", mt: 5 }}
				>
					<Box
						display="flex"
						justifyContent="space-between"
						alignItems="center"
						px={2}
						pt={2}
					>
						<Box display="flex" gap={2}>
							{/* Dropdown for Status */}
							<TextField
								label="Filter by Status"
								variant="outlined"
								size="small"
								select
								value={filters.status}
								onChange={(e) =>
									handleFilterChange("status", e.target.value)
								}
								SelectProps={{
									native: true,
								}}
							>
								<option value=""></option>
								<option value="available">Available</option>
								<option value="working">Working</option>
								<option value="sold-out">Sold Out</option>
								<option value="expire">Expire</option>
								<option value="not-active">Not Active</option>
							</TextField>

							{/* Dropdown for Type */}
							<TextField
								label="Filter by Type"
								variant="outlined"
								size="small"
								select
								value={filters.type}
								onChange={(e) =>
									handleFilterChange("type", e.target.value)
								}
								SelectProps={{
									native: true,
								}}
							>
								<option value=""></option>
								<option value="B">B</option>
								<option value="NV">NV</option>
								<option value="TS">TS</option>
								<option value="HW">HW</option>
							</TextField>

							{/* Number Input for Size */}
							<TextField
								label="Filter by Size"
								variant="outlined"
								size="small"
								type="number"
								value={filters.size}
								onChange={(e) =>
									handleFilterChange("size", e.target.value)
								}
							/>
						</Box>
						<Button
							variant="outlined"
							color="secondary"
							style={{ marginLeft: "3vw" }}
							onClick={() => {
								setSelectedRows([]);
							}}
						>
							Clear Selection
						</Button>
						<Button
							variant="outlined"
							color="secondary"
							style={{ marginLeft: "1vw" }}
							onClick={handleDownloadQRs} // Trigger download for selected QR codes
						>
							Download selected QR
						</Button>
					</Box>

					<Table aria-label="table with data">
						<TableHead>
							<TableRow>
								<TableCell>Select</TableCell>
								<TableCell>SKU</TableCell>
								<TableCell>Image</TableCell>
								<TableCell>Status</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{rows.map((row) => (
								<TableRow key={row.sku}>
									<TableCell padding="checkbox">
										<Checkbox
											checked={selectedRows.includes(
												row.sku
											)} // Check if the row is selected
											onChange={() =>
												handleCheckboxChange(row.sku)
											} // Handle selection change
										/>
									</TableCell>
									<TableCell>{row.sku}</TableCell>
									<TableCell>
										<Box
											sx={{
												width: 100,
												height: 100,
												backgroundImage: `url(${row.image_url})`,
												backgroundRepeat: "no-repeat",
												backgroundSize: "cover",
												backgroundPosition: "center",
											}}
										/>
									</TableCell>
									<TableCell>{row.status}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>

					<TablePagination
						rowsPerPageOptions={[rowsPerPage]}
						component="div"
						count={rows.length} // Count rows from the API response
						rowsPerPage={rowsPerPage}
						page={page}
						onPageChange={handleChangePage}
					/>

					{/* Popup Box */}
					{popupVisible && (
						<Box
							sx={{
								position: "fixed",
								right: 20,
								top: "20%",
								transform: "translateY(-50%)",
								width: 200,
								padding: 2,
								backgroundColor: "#B8B8B8",
								boxShadow: 3,
								borderRadius: 1,
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
								gap: 2,
							}}
						>
							<Select
								value={newStatus}
								onChange={(e) =>
									setNewStatus(
										e.target.value as RowData["status"]
									)
								}
								fullWidth
							>
								<MenuItem value="available">Available</MenuItem>
								<MenuItem value="working">Working</MenuItem>
								<MenuItem value="sold-out">Sold Out</MenuItem>
								<MenuItem value="expire">Expire</MenuItem>
								<MenuItem value="not-active">
									Not Active
								</MenuItem>
							</Select>
							<Button
								variant="contained"
								color="secondary"
								onClick={handleChangeStatus}
							>
								Update Status
							</Button>
						</Box>
					)}
				</TableContainer>
			)}
		</>
	);
};

export default MyTablePage;
