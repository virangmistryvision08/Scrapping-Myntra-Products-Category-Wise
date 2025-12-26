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
  IconButton,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import LastPageIcon from "@mui/icons-material/LastPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";

/* ---------------- Pagination Actions ---------------- */
function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(
      event,
      Math.max(0, Math.ceil(count / rowsPerPage) - 1)
    );
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>

      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>

      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>

      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

/* ---------------- Main Chart ---------------- */
const PriceChangeChart = ({ data = [], loading }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  /* ---------------- LOADING STATE ---------------- */
  if (loading) {
    return (
      <Paper sx={{ p: 3, mb: 4, textAlign: "center" }}>
        <Typography>Loading price analysis chart...</Typography>
      </Paper>
    );
  }

  /* ---------------- EMPTY STATE ---------------- */
  if (!data.length) {
    return (
      <Paper sx={{ p: 3, mb: 4, textAlign: "center" }}>
        <Typography color="text.secondary">
          No product price data available
        </Typography>
      </Paper>
    );
  }

  /* ---------------- PAGINATION LOGIC ---------------- */
  const paginatedData =
    rowsPerPage > 0
      ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      : data;

  const chartData = paginatedData.map((item) => ({
    name:
      item.title.length > 12
        ? item.title.slice(0, 12) + "..."
        : item.title,
    priceChange: item.priceChange,
  }));

  return (
    <Paper sx={{ p: 3, mb: 4 }}>

      {/* Bar Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            interval={0}
            tick={{ fontSize: 12 }}
          />
          <YAxis />
          <Tooltip
            formatter={(value) => [`₹${value}`, "Price Change"]}
          />
          <Bar dataKey="priceChange" fill="#2563eb" />
        </BarChart>
      </ResponsiveContainer>

      {/* Pagination */}
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
          ActionsComponent={TablePaginationActions}
        />
      </Box>
    </Paper>
  );
};

export default PriceChangeChart;
