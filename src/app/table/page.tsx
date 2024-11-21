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
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import axios from "axios";

interface RowData {
  sku: string;
  type: string;
  size: number;
  status: "available" | "working" | "sold-out" | "expire" | "not-active";
  image_url: string;
  qrcode_url: string;
  repeat: number;
}

const downloadQRCode = (url: string) => {
  const link = document.createElement("a");
  link.href = `${url}`;
  link.download = url.split("/").pop() || "qrcode.png";
  link.click();
};

const MyTablePage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<RowData[]>([]);
  const [filters, setFilters] = useState({
    status: "",
    type: "",
    size: "",
  });
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [page, setPage] = useState(0);
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(
    null
  );
  const [popupVisible, setPopupVisible] = useState(true);
  const [newStatus, setNewStatus] = useState<RowData["status"]>("available");
  const rowsPerPage = 50;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:3000/api/product/table?page=${page + 1}&status=${
            filters.status
          }&type=${filters.type}&size=${filters.size}`
        );
        setRows(response.data.products);
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };

    fetchData();
  }, [filters, page]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:3000/api/product/table?page=${page + 1}&status=${
            filters.status
          }&type=${filters.type}&size=${filters.size}`
        );
        setRows(response.data.products);
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };

    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    setDebounceTimeout(setTimeout(fetchData, 500));

    return () => {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }
    };
  }, [filters, page]);

  const handleCheckboxChange = (sku: string) => {
    setSelectedRows((prevSelected) => {
      const isSelected = prevSelected.includes(sku);
      if (isSelected) {
        return prevSelected.filter((row) => row !== sku);
      } else {
        return [...prevSelected, sku];
      }
    });

    const updatedSelection = selectedRows;
    setPopupVisible(updatedSelection.length > 0);
  };

  useEffect(() => {
    console.log("selectedRows", selectedRows);
  }, [selectedRows]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleFilterChange = (column: keyof typeof filters, value: string) => {
    setFilters({ ...filters, [column]: value });
  };

  const handleUpdateStatus = async (status: string) => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/product/table?page=${page + 1}&status=${
            filters.status
          }&type=${filters.type}&size=${filters.size}`
        );
        setRows(response.data.products);
      } catch (error) {
        console.error(error);
      }
    };

    try {
      if (status === "not-active") {
        const response = await axios.put(
          `http://localhost:3000/api/product/clearMany`,
          { skuList: selectedRows, status }
        );
        console.log("Clear Slots:", response.data);

        fetchData();

        setSelectedRows([]);

        return;
      }

      const response = await axios.put(
        "http://localhost:3000/api/product/updateMany",
        { skuList: selectedRows, status }
      );
      console.log("Updated products:", response.data);

      fetchData();

      setSelectedRows([]);
    } catch (error) {
      console.error("Error updating products:", error);
    }
  };

  const handleDownloadQRs = () => {
    selectedRows.forEach((sku) => {
      const selectedRow = rows.find((row) => row.sku === sku);
      if (selectedRow) {
        downloadQRCode(selectedRow.qrcode_url);
      }
    });

    handleUpdateStatus("working");
  };

  const handleChangeStatus = () => {
    setPopupVisible(true);
    console.log("newStatus", newStatus);

    if (selectedRows.length > 0) {
      handleUpdateStatus(newStatus);
    } else {
      console.log("no product selected");
    }
  };

  return (
    <>
      {loading ? (
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

          <Typography
            variant="h5"
            component="h2"
            textAlign="center"
            sx={{ pt: 5 }}
          >
            Loading...
          </Typography>
        </>
      ) : (
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
                <TextField
                  label="Filter by Size"
                  variant="outlined"
                  size="small"
                  type="number"
                  value={filters.size}
                  onChange={(e) => handleFilterChange("size", e.target.value)}
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
                onClick={handleDownloadQRs}
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
                  <TableCell>Reused</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
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
                          backgroundImage: `url(/${row.image_url})`,
                          backgroundRepeat: "no-repeat",
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      />
                    </TableCell>
                    <TableCell>{row.status}</TableCell>
                    <TableCell>{row.repeat}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <TablePagination
              rowsPerPageOptions={[rowsPerPage]}
              component="div"
              count={rows.length}
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
                    setNewStatus(e.target.value as RowData["status"])
                  }
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
        </>
      )}
    </>
  );
};

export default MyTablePage;
