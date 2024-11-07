"use client";

import React, { useState } from 'react';
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
} from '@mui/material';

interface RowData {
  sku: string;
  name: string;
  type: string;
  size: number;
  status: "available", "working", "sold-out", "expire", "not-active"
  image_url : string;
}

// Sample data for the table
const initialRows: RowData[] = [
  { id: 1, name: 'John Doe', age: 25, role: 'Developer', image: 'https://via.placeholder.com/50' },
  { id: 2, name: 'Jane Smith', age: 30, role: 'Designer', image: 'https://via.placeholder.com/50' },
  { id: 3, name: 'Alice Johnson', age: 35, role: 'Product Manager', image: 'https://via.placeholder.com/50' },
  { id: 4, name: 'Bob Brown', age: 40, role: 'Tester', image: 'https://via.placeholder.com/50' },
  { id: 1, name: 'John Doe', age: 25, role: 'Developer', image: 'https://via.placeholder.com/50' },
  { id: 2, name: 'Jane Smith', age: 30, role: 'Designer', image: 'https://via.placeholder.com/50' },
  { id: 3, name: 'Alice Johnson', age: 35, role: 'Product Manager', image: 'https://via.placeholder.com/50' },
  { id: 4, name: 'Bob Brown', age: 40, role: 'Tester', image: 'https://via.placeholder.com/50' },
  { id: 1, name: 'John Doe', age: 25, role: 'Developer', image: 'https://via.placeholder.com/50' },
  { id: 2, name: 'Jane Smith', age: 30, role: 'Designer', image: 'https://via.placeholder.com/50' },
  { id: 3, name: 'Alice Johnson', age: 35, role: 'Product Manager', image: 'https://via.placeholder.com/50' },
  { id: 4, name: 'Bob Brown', age: 40, role: 'Tester', image: 'https://via.placeholder.com/50' },
  { id: 1, name: 'John Doe', age: 25, role: 'Developer', image: 'https://via.placeholder.com/50' },
  { id: 2, name: 'Jane Smith', age: 30, role: 'Designer', image: 'https://via.placeholder.com/50' },
  { id: 3, name: 'Alice Johnson', age: 35, role: 'Product Manager', image: 'https://via.placeholder.com/50' },
  { id: 4, name: 'Bob Brown', age: 40, role: 'Tester', image: 'https://via.placeholder.com/50' },
  { id: 1, name: 'John Doe', age: 25, role: 'Developer', image: 'https://via.placeholder.com/50' },
  { id: 2, name: 'Jane Smith', age: 30, role: 'Designer', image: 'https://via.placeholder.com/50' },
  { id: 3, name: 'Alice Johnson', age: 35, role: 'Product Manager', image: 'https://via.placeholder.com/50' },
  { id: 4, name: 'Bob Brown', age: 40, role: 'Tester', image: 'https://via.placeholder.com/50' },
  { id: 1, name: 'John Doe', age: 25, role: 'Developer', image: 'https://via.placeholder.com/50' },
  { id: 2, name: 'Jane Smith', age: 30, role: 'Designer', image: 'https://via.placeholder.com/50' },
  { id: 3, name: 'Alice Johnson', age: 35, role: 'Product Manager', image: 'https://via.placeholder.com/50' },
  { id: 4, name: 'Bob Brown', age: 40, role: 'Tester', image: 'https://via.placeholder.com/50' },
  { id: 1, name: 'John Doe', age: 25, role: 'Developer', image: 'https://via.placeholder.com/50' },
  { id: 2, name: 'Jane Smith', age: 30, role: 'Designer', image: 'https://via.placeholder.com/50' },
  { id: 3, name: 'Alice Johnson', age: 35, role: 'Product Manager', image: 'https://via.placeholder.com/50' },
  { id: 4, name: 'Bob Brown', age: 40, role: 'Tester', image: 'https://via.placeholder.com/50' },
  { id: 1, name: 'John Doe', age: 25, role: 'Developer', image: 'https://via.placeholder.com/50' },
  { id: 2, name: 'Jane Smith', age: 30, role: 'Designer', image: 'https://via.placeholder.com/50' },
  { id: 3, name: 'Alice Johnson', age: 35, role: 'Product Manager', image: 'https://via.placeholder.com/50' },
  { id: 4, name: 'Bob Brown', age: 40, role: 'Tester', image: 'https://via.placeholder.com/50' },
];

const MyTablePage: React.FC = () => {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [filters, setFilters] = useState({ id: '', name: '', age: '', role: '' });
  const [page, setPage] = useState(0);
  const rowsPerPage = 20;

  // Handle Checkbox Changes
  const handleCheckboxChange = (id: number) => {
    setSelectedRows((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((rowId) => rowId !== id)
        : [...prevSelected, id]
    );
  };

  // Handle Download Selected Images
  const handleDownloadImages = () => {
    const selectedImages = initialRows
      .filter((row) => selectedRows.includes(row.id))
      .map((row) => row.image);

    selectedImages.forEach((imageUrl, index) => {
      const link = document.createElement('a');
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
      if (key === 'age') {
        return value === '' || row[key as keyof RowData].toString().includes(value);
      }
      return value === '' || (row[key as keyof RowData] as string).toLowerCase().includes(value.toLowerCase());
    })
  );

  // Pagination handling
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Paginated rows
  const paginatedRows = filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <TableContainer component={Paper} sx={{ maxWidth: 800, margin: 'auto', mt: 5 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" px={2} pt={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleDownloadImages}
          disabled={selectedRows.length === 0}
        >
          Download Selected Images
        </Button>
        
        <Box display="flex" gap={2}>
          <TextField
            label="Filter by ID"
            variant="outlined"
            size="small"
            value={filters.id}
            onChange={(e) => handleFilterChange('id', e.target.value)}
          />
          <TextField
            label="Filter by Name"
            variant="outlined"
            size="small"
            value={filters.name}
            onChange={(e) => handleFilterChange('name', e.target.value)}
          />
          <TextField
            label="Filter by Age"
            variant="outlined"
            size="small"
            value={filters.age}
            onChange={(e) => handleFilterChange('age', e.target.value)}
          />
          <TextField
            label="Filter by Role"
            variant="outlined"
            size="small"
            value={filters.role}
            onChange={(e) => handleFilterChange('role', e.target.value)}
          />
        </Box>
      </Box>

      <Table aria-label="filterable table">
        <TableHead>
          <TableRow>
            <TableCell>Select</TableCell>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Age</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Image</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedRows.map((row) => (
            <TableRow key={row.id}>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedRows.includes(row.id)}
                  onChange={() => handleCheckboxChange(row.id)}
                />
              </TableCell>
              <TableCell>{row.id}</TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.age}</TableCell>
              <TableCell>{row.role}</TableCell>
              <TableCell>
                <img src={row.image} alt={row.name} width={50} height={50} />
              </TableCell>
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
