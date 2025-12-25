import * as React from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TablePagination,
  TableRow,
  IconButton,
  TableHead,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";

/* ---------------- Pagination Actions ---------------- */
function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton onClick={(e) => onPageChange(e, 0)} disabled={page === 0}>
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>

      <IconButton
        onClick={(e) => onPageChange(e, page - 1)}
        disabled={page === 0}
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>

      <IconButton
        onClick={(e) => onPageChange(e, page + 1)}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>

      <IconButton
        onClick={(e) =>
          onPageChange(e, Math.max(0, Math.ceil(count / rowsPerPage) - 1))
        }
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

/* ---------------- Main Table ---------------- */
const PriceTable = ({ data, loading }) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-lg">
        Loading price analysis Report...
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="text-center text-gray-500 py-10">
        No Product price data available
      </div>
    );
  }

  const visibleRows =
    rowsPerPage > 0
      ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      : data;

  return (
    <TableContainer component={Paper} sx={{ mt: 2, maxHeight: "80vh" }}>
      <Table stickyHeader>
        {/* 🔹 TABLE HEADER */}
        <TableHead>
          <TableRow>
            <TableCell>
              <b>Product</b>
            </TableCell>
            <TableCell>
              <b>Brand</b>
            </TableCell>
            <TableCell>
              <b>Old Price</b>
            </TableCell>
            <TableCell>
              <b>Latest Price</b>
            </TableCell>
            <TableCell>
              <b>Change</b>
            </TableCell>
            <TableCell>
              <b>% Change</b>
            </TableCell>
            <TableCell align="center">
              <b>Trend</b>
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {visibleRows.map((item) => (
            <TableRow key={item.productId} hover>
              <TableCell>
                <a
                  href={item.product_url}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "#2563eb", fontWeight: 500 }}
                >
                  {item.title}
                </a>
              </TableCell>

              <TableCell>{item.brand}</TableCell>

              <TableCell>₹{item.oldPrice}</TableCell>

              <TableCell sx={{ fontWeight: 600 }}>
                ₹{item.latestPrice}
              </TableCell>

              <TableCell>₹{item.priceChange}</TableCell>

              <TableCell>{item.percentChange}%</TableCell>

              <TableCell align="center">
                <Box
                  component="span"
                  sx={{
                    px: 2,
                    py: 0.5,
                    borderRadius: "999px",
                    fontSize: 12,
                    fontWeight: 600,
                    backgroundColor:
                      item.trend === "PRICE INCREASED"
                        ? "#fee2e2"
                        : item.trend === "PRICE DECREASED"
                        ? "#dcfce7"
                        : "#e5e7eb",
                    color:
                      item.trend === "PRICE INCREASED"
                        ? "#b91c1c"
                        : item.trend === "PRICE DECREASED"
                        ? "#166534"
                        : "#374151",
                  }}
                >
                  {item.trend}
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>

        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
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
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
};

export default PriceTable;
