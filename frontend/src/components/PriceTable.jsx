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
  TableHead,
  IconButton,
  useTheme,
} from "@mui/material";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import LastPageIcon from "@mui/icons-material/LastPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { Spin } from "antd";
import PriceHistoryModal from "./PriceHistoryModal";

/* ---------------- SORT CONFIG ---------------- */
const STRING_FIELDS = ["title", "brand"];
const NUMERIC_FIELDS = [
  "oldPrice",
  "latestPrice",
  "priceChange",
  "percentChange",
];

/* ---------------- SORTABLE HEADER ---------------- */
const SortHeader = ({ label, field, sortBy, order, onSort }) => {
  const active = sortBy === field;

  return (
    <TableCell
      onClick={() => onSort(field)}
      sx={{
        cursor: "pointer",
        fontWeight: 600,
        "&:hover .sort-icon": { opacity: 1 },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
        {label}
        <Box
          sx={{
            opacity: active ? 1 : 0,
          }}
          className="sort-icon"
        >
          {order === "asc" ? (
            <ArrowUpwardIcon color="success" fontSize="small" />
          ) : (
            <ArrowDownwardIcon color="error" fontSize="small" />
          )}
        </Box>
      </Box>
    </TableCell>
  );
};

/* ---------------- PAGINATION ACTIONS ---------------- */
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

/* ---------------- MAIN TABLE ---------------- */
const PriceTable = ({ data, loading, sortBy, order, setSortBy, setOrder }) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [open, setOpen] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState(null);

  /* ---------------- SORT HANDLER ---------------- */
  const handleSort = (field) => {
    const allowed = [...STRING_FIELDS, ...NUMERIC_FIELDS];
    if (!allowed.includes(field)) return;

    if (sortBy === field) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setOrder("asc");
    }
  };

  /* ---------------- LOADING ---------------- */
  if (loading)
    return (
      <div className="text-center py-10">
        <Spin tip="Loading" size="large" />
      </div>
    );

  if (!data.length) return <p className="text-center py-10">No data found</p>;

  const rows =
    rowsPerPage > 0
      ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      : data;

  return (
    <>
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <SortHeader
                label="Product"
                field="title"
                {...{ sortBy, order, onSort: handleSort }}
              />
              <SortHeader
                label="Brand"
                field="brand"
                {...{ sortBy, order, onSort: handleSort }}
              />
              <SortHeader
                label="Old Price"
                field="oldPrice"
                {...{ sortBy, order, onSort: handleSort }}
              />
              <SortHeader
                label="Latest Price"
                field="latestPrice"
                {...{ sortBy, order, onSort: handleSort }}
              />
              <SortHeader
                label="Change"
                field="priceChange"
                {...{ sortBy, order, onSort: handleSort }}
              />
              <SortHeader
                label="% Change"
                field="percentChange"
                {...{ sortBy, order, onSort: handleSort }}
              />
              <TableCell align="center">
                <b>Trend</b>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.map((item) => (
              <TableRow
                hover
                key={item.productId}
                className="cursor-pointer"
                onClick={() => {
                  setSelectedProduct(item);
                  setOpen(true);
                }}
              >
                <TableCell><a className="text-blue-700" href={item.productUrl} target="_blank">{item.title}</a></TableCell>
                <TableCell>{item.brand}</TableCell>
                <TableCell>₹{item.oldPrice}</TableCell>
                <TableCell>₹{item.latestPrice}</TableCell>
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
                        item.trend === "INCREASED"
                          ? "#fee2e2"
                          : item.trend === "DECREASED"
                          ? "#dcfce7"
                          : "#e5e7eb",
                      color:
                        item.trend === "INCREASED"
                          ? "#b91c1c"
                          : item.trend === "DECREASED"
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

      <PriceHistoryModal
        open={open}
        product={selectedProduct}
        onClose={() => {
          setOpen(false);
          setSelectedProduct(null);
        }}
      />
    </>
  );
};

export default PriceTable;
