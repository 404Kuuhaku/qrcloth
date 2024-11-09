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
	Select,
	MenuItem,
	Typography,
} from "@mui/material";
import axios from "axios";

interface RowData {
	sku: string;
	type: string;
	size: number;
	status: "available" | "working" | "sold-out" | "expire" | "not-active";
	image_url: string;
}

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
	const rowsPerPage = 50;

	// Fetch data with filters
	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			try {
				// Send filters to the backend in the API request
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
	}, []); // Fetch data when filters or page change

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

	return (
		<>
			{loading ? (
				<Typography
					variant="h6"
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
						>
							Clear Selection
						</Button>
						<Button
							variant="outlined"
							color="secondary"
							style={{ marginLeft: "1vw" }}
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
				</TableContainer>
			)}
		</>
	);
};

export default MyTablePage;
