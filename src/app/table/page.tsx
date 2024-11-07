"use client";

import React, { useState } from "react";
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
} from "@mui/material";

interface RowData {
  sku: string;
  // name: string;
  // type: string;
  // size: number;
  status: "available" | "working" | "sold-out" | "expire" | "not-active";
  image_url: string;
}

// Sample data for the table
const initialRows: RowData[] = Array.from({ length: 100 }, (_, index) => ({
  sku: `SKU${String(index + 1).padStart(3, "0")}`,
  // name: `Product ${index + 1}`,
  // type: ["B", "NV", "TS", "HW"][index % 4
  // ] as RowData["type"],
  // size: Math.floor(Math.random() * 100) + 1, // Random size between 1 and 100
  status: ["available", "working", "sold-out", "expire", "not-active"][
    index % 5
  ] as RowData["status"],
  image_url: `https://via.placeholder.com/50?text=Prod+${index + 1}`, // Placeholder image URL with text
}));

const MyTablePage: React.FC = () => {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    sku: "",
    name: "",
    type: "",
    status: "",
  });
  const [page, setPage] = useState(0);
  const rowsPerPage = 50;

  // Handle Checkbox Changes
  const handleCheckboxChange = (id: number) => {
    setSelectedRows((prevSelected) => {
      const isSelected = prevSelected.includes(id);
      const updatedSelection = isSelected
        ? prevSelected.filter((rowId) => rowId !== id)
        : [...prevSelected, id];

      // Log the selected row data
      const selectedRow = initialRows.find((row) => row.id === id);
      console.log("Selected Row:", selectedRow);

      return updatedSelection;
    });
  };

  // Handle Download Selected Images
  const handleDownloadImages = () => {
    const selectedImages = initialRows
      .filter((row) => selectedRows.includes(row.sku))
      .map((row) => row.image_url);

    selectedImages.forEach((imageUrl, index) => {
      const link = document.createElement("a");
      link.href = imageUrl;
      link.download = `image-${index + 1}.jpg`;
      link.click();
    });
  };

  // Update filters for each column
  const handleFilterChange = (column: keyof typeof filters, value: string) => {
    setFilters({ ...filters, [column]: value });
  };

  // Filter rows based on the filter criteria
  const filteredRows = initialRows.filter((row) =>
    Object.entries(filters).every(([key, value]) => {
      return (
        value === "" ||
        (row[key as keyof RowData] as string)
          .toLowerCase()
          .includes(value.toLowerCase())
      );
    })
  );

  // Pagination handling
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Paginated rows
  const paginatedRows = filteredRows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
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
        <Button
          variant="contained"
          color="primary"
          onClick={handleDownloadImages}
          disabled={selectedRows.length === 0}
        >
          Download Selected Images
        </Button>

        <Box display="flex" gap={2}>
          {/* Dropdown for Status */}
          <TextField
            label="Filter by Status"
            variant="outlined"
            size="small"
            select
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            SelectProps={{
              native: true,
            }}
          >
            <option value="">All</option>
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
            onChange={(e) => handleFilterChange("type", e.target.value)}
            SelectProps={{
              native: true,
            }}
          >
            <option value="">All</option>
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
            onChange={(e) => handleFilterChange("size", e.target.value)}
          />
        </Box>
      </Box>

      <Table aria-label="filterable table">
        <TableHead>
          <TableRow>
            <TableCell>Select</TableCell>
            <TableCell>SKU</TableCell>
            {/* <TableCell>Name</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Size</TableCell> */}
            <TableCell>Image</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedRows.map((row) => (
            <TableRow key={row.sku}>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedRows.includes(row.sku)}
                  onChange={() => handleCheckboxChange(row.sku)}
                />
              </TableCell>
              <TableCell>{row.sku}</TableCell>
              {/* <TableCell>{row.name}</TableCell>
              <TableCell>{row.type}</TableCell>
              <TableCell>{row.size}</TableCell> */}
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
        count={filteredRows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
      />
    </TableContainer>
  );
};

export default MyTablePage;
