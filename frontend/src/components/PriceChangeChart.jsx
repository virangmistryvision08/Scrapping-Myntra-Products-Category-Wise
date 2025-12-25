import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  Paper,
  Typography,
  TablePagination,
  Box,
} from "@mui/material";

const PriceChangeChart = ({ data = [], loading }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  /* ---------------- LOADING STATE ---------------- */
  if (loading) {
    return (
      <Paper sx={{ p: 3, mb: 4, textAlign: "center" }}>
        <Typography variant="body1">
          Loading price analysis chart...
        </Typography>
      </Paper>
    );
  }

  /* ---------------- EMPTY STATE ---------------- */
  if (!data.length) {
    return (
      <Paper sx={{ p: 3, mb: 4, textAlign: "center" }}>
        <Typography variant="body1" color="text.secondary">
          No product price data available
        </Typography>
      </Paper>
    );
  }

  /* ---------------- PAGINATION ---------------- */
  const paginatedData =
    rowsPerPage > 0
      ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      : data;

  const chartData = paginatedData.map((item) => ({
    name:
      item.title.length > 20
        ? item.title.slice(0, 20) + "..."
        : item.title,
    priceChange: item.priceChange,
  }));

  return (
    <Paper sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Myntra Weekly Price Change
      </Typography>

      {/* 📊 Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="priceChange" fill="#2563eb" />
        </BarChart>
      </ResponsiveContainer>

      {/* 📄 Pagination */}
      <Box sx={{ mt: 2 }}>
        <TablePagination
          component="div"
          rowsPerPageOptions={[5, 10, 15, { label: "All", value: -1 }]}
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </Box>
    </Paper>
  );
};

export default PriceChangeChart;
