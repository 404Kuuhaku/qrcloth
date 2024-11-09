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
  Select,
  MenuItem,
} from "@mui/material";

interface RowData {
  sku: string;
  type: string;
  status: "available" | "working" | "sold-out" | "expire" | "not-active";
  image_url: string;
}

// Sample data for the table
const initialRows: RowData[] = Array.from({ length: 100 }, (_, index) => ({
  sku: `SKU${String(index + 1).padStart(3, "0")}`,
  type: ["B", "NV", "TS", "HW"][index % 4] as RowData["type"],
  status: ["available", "working", "sold-out", "expire", "not-active"][
    index % 5
  ] as RowData["status"],
  image_url: `https://via.placeholder.com/50?text=Prod+${index + 1}`,
}));

const MyTablePage: React.FC = () => {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    status: "",
    type: "",
    size: "",
  });
  const [page, setPage] = useState(0);
  const [popupVisible, setPopupVisible] = useState(true);
  const [newStatus, setNewStatus] = useState<RowData["status"]>("available");
  const rowsPerPage = 50;

  // Handle Checkbox Changes
  const handleCheckboxChange = (sku: string) => {
    setSelectedRows((prevSelected) => {
      const isSelected = prevSelected.includes(sku);
      const updatedSelection = isSelected
        ? prevSelected.filter((rowId) => rowId !== sku)
        : [...prevSelected, sku];

      setPopupVisible(updatedSelection.length > 0);
      console.log(updatedSelection);
      return updatedSelection;
    });
  };

  // Change the status of selected rows to the selected status
  const handleChangeStatus = () => {
    initialRows.forEach((row) => {
      if (selectedRows.includes(row.sku)) {
        row.status = newStatus;
      }
    });
    setPopupVisible(true);
    setSelectedRows([]);
  };

  // Update filters for each column
  const handleFilterChange = (column: keyof typeof filters, value: string) => {
    setFilters({ ...filters, [column]: value });
  };

  // Filter rows based on the filter criteria
  const filteredRows = initialRows.filter((row) =>
    Object.entries(filters).every(([key, value]) => {
      if (key === "size" && value !== "") {
        return row.size === parseInt(value);
      } else if (key === "type" || key === "status") {
        return (
          value === "" ||
          (row[key as keyof RowData]?.toString().toLowerCase() ?? "") ===
            value.toLowerCase()
        );
      }
      return (
        value === "" ||
        (row[key as keyof RowData]?.toString().toLowerCase() ?? "").includes(
          value.toLowerCase()
        )
      );
    })
  );

  // Pagination handling
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

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
            onChange={(e) => handleFilterChange("type", e.target.value)}
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
          {/* <TextField
            label="Filter by Size"
            variant="outlined"
            size="small"
            type="number"
            value={filters.size}
            onChange={(e) => handleFilterChange("size", e.target.value)}
          /> */}
        </Box>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => setSelectedRows([])}
          style={{ marginLeft: "3vw" }}
        >
          Clear Selection
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          // onClick={() => }
          style={{ marginLeft: "1vw" }}
        >
          Download selected QR
        </Button>
      </Box>

      <Table aria-label="filterable table">
        <TableHead>
          <TableRow>
            <TableCell>Select</TableCell>
            <TableCell>SKU</TableCell>
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
            onChange={(e) => setNewStatus(e.target.value as RowData["status"])}
            fullWidth
          >
            <MenuItem value="available">Available</MenuItem>
            <MenuItem value="working">Working</MenuItem>
            <MenuItem value="sold-out">Sold Out</MenuItem>
            <MenuItem value="expire">Expire</MenuItem>
            <MenuItem value="not-active">Not Active</MenuItem>
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
  );
};

export default MyTablePage;
