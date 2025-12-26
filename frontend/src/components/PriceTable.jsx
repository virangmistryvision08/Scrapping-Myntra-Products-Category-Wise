// import * as React from "react";
// import {
//   Box,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableFooter,
//   TablePagination,
//   TableRow,
//   IconButton,
//   TableHead,
// } from "@mui/material";
// import { useTheme } from "@mui/material/styles";
// import FirstPageIcon from "@mui/icons-material/FirstPage";
// import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
// import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
// import LastPageIcon from "@mui/icons-material/LastPage";
// import PriceHistoryModal from "./PriceHistoryModal";

// /* ---------------- Pagination Actions ---------------- */
// function TablePaginationActions(props) {
//   const theme = useTheme();
//   const { count, page, rowsPerPage, onPageChange } = props;

//   return (
//     <Box sx={{ flexShrink: 0, ml: 2.5 }}>
//       <IconButton onClick={(e) => onPageChange(e, 0)} disabled={page === 0}>
//         {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
//       </IconButton>

//       <IconButton
//         onClick={(e) => onPageChange(e, page - 1)}
//         disabled={page === 0}
//       >
//         {theme.direction === "rtl" ? (
//           <KeyboardArrowRight />
//         ) : (
//           <KeyboardArrowLeft />
//         )}
//       </IconButton>

//       <IconButton
//         onClick={(e) => onPageChange(e, page + 1)}
//         disabled={page >= Math.ceil(count / rowsPerPage) - 1}
//       >
//         {theme.direction === "rtl" ? (
//           <KeyboardArrowLeft />
//         ) : (
//           <KeyboardArrowRight />
//         )}
//       </IconButton>

//       <IconButton
//         onClick={(e) =>
//           onPageChange(e, Math.max(0, Math.ceil(count / rowsPerPage) - 1))
//         }
//         disabled={page >= Math.ceil(count / rowsPerPage) - 1}
//       >
//         {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
//       </IconButton>
//     </Box>
//   );
// }

// /* ---------------- Main Table ---------------- */
// const PriceTable = ({ data, loading }) => {
//   const [page, setPage] = React.useState(0);
//   const [rowsPerPage, setRowsPerPage] = React.useState(10);
//   const [selectedProduct, setSelectedProduct] = React.useState(null);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64 text-lg">
//         Loading price analysis Report...
//       </div>
//     );
//   }

//   if (!data.length) {
//     return (
//       <div className="text-center text-gray-500 py-10">
//         No Product price data available
//       </div>
//     );
//   }

//   const visibleRows =
//     rowsPerPage > 0
//       ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//       : data;

//   return (
//     <>
//       <TableContainer component={Paper} sx={{ mt: 2, maxHeight: "80vh" }}>
//         <Table stickyHeader>
//           {/* 🔹 TABLE HEADER */}
//           <TableHead>
//             <TableRow>
//               <TableCell>
//                 <b>Product</b>
//               </TableCell>
//               <TableCell>
//                 <b>Brand</b>
//               </TableCell>
//               <TableCell>
//                 <b>Old Price</b>
//               </TableCell>
//               <TableCell>
//                 <b>Latest Price</b>
//               </TableCell>
//               <TableCell>
//                 <b>Change</b>
//               </TableCell>
//               <TableCell>
//                 <b>% Change</b>
//               </TableCell>
//               <TableCell align="center">
//                 <b>Trend</b>
//               </TableCell>
//             </TableRow>
//           </TableHead>

//           <TableBody>
//             {visibleRows.map((item) => (
//               <TableRow
//                 key={item.productId}
//                 hover
//                 sx={{ cursor: "pointer" }}
//                 onClick={() => setSelectedProduct(item)}
//               >
//                 <TableCell>
//                   <a
//                     href={item.product_url}
//                     target="_blank"
//                     rel="noreferrer"
//                     style={{ color: "#2563eb", fontWeight: 500 }}
//                   >
//                     {item.title}
//                   </a>
//                 </TableCell>

//                 <TableCell>{item.brand}</TableCell>

//                 <TableCell>₹{item.oldPrice}</TableCell>

//                 <TableCell sx={{ fontWeight: 600 }}>
//                   ₹{item.latestPrice}
//                 </TableCell>

//                 <TableCell>₹{item.priceChange}</TableCell>

//                 <TableCell>{item.percentChange}%</TableCell>

//                 <TableCell align="center">
//                   <Box
//                     component="span"
//                     sx={{
//                       px: 2,
//                       py: 0.5,
//                       borderRadius: "999px",
//                       fontSize: 12,
//                       fontWeight: 600,
//                       backgroundColor:
//                         item.trend === "PRICE INCREASED"
//                           ? "#fee2e2"
//                           : item.trend === "PRICE DECREASED"
//                           ? "#dcfce7"
//                           : "#e5e7eb",
//                       color:
//                         item.trend === "PRICE INCREASED"
//                           ? "#b91c1c"
//                           : item.trend === "PRICE DECREASED"
//                           ? "#166534"
//                           : "#374151",
//                     }}
//                   >
//                     {item.trend}
//                   </Box>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>

//           <TableFooter>
//             <TableRow>
//               <TablePagination
//                 rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
//                 count={data.length}
//                 rowsPerPage={rowsPerPage}
//                 page={page}
//                 onPageChange={(e, newPage) => setPage(newPage)}
//                 onRowsPerPageChange={(e) => {
//                   setRowsPerPage(parseInt(e.target.value, 10));
//                   setPage(0);
//                 }}
//                 ActionsComponent={TablePaginationActions}
//               />
//             </TableRow>
//           </TableFooter>
//         </Table>
//       </TableContainer>

//       <PriceHistoryModal
//         open={!!selectedProduct}
//         product={selectedProduct}
//         onClose={() => setSelectedProduct(null)}
//       />
//     </>
//   );
// };

// export default PriceTable;

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

const NUMERIC_FIELDS = [
  "oldPrice",
  "latestPrice",
  "priceChange",
  "percentChange",
];

const SortHeader = ({ label, field, sortBy, order, onSort }) => {
  const active = sortBy === field;

  return (
    <TableCell
      onClick={() => onSort(field)}
      sx={{
        cursor: NUMERIC_FIELDS.includes(field) ? "pointer" : "default",
        fontWeight: 600,
        "&:hover .sort-icon": { opacity: 1 },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
        {label}
        {NUMERIC_FIELDS.includes(field) && (
          <Box
            className="sort-icon"
            sx={{
              opacity: active ? 1 : 0,
              transition: "opacity 0.2s",
            }}
          >
            {order === "asc" ? (
              <ArrowUpwardIcon fontSize="small" />
            ) : (
              <ArrowDownwardIcon fontSize="small" />
            )}
          </Box>
        )}
      </Box>
    </TableCell>
  );
};

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

const PriceTable = ({ data, loading, sortBy, order, setSortBy, setOrder }) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const contentStyle = {
    padding: 50,
    background: "rgba(0, 0, 0, 0.05)",
    borderRadius: 4,
  };
  const content = <div style={contentStyle} />;

  if (loading)
    return (
      <p className="text-center py-10">
        <Spin tip="Loading" size="large">
          {content}
        </Spin>
      </p>
    );
  if (!data.length) return <p className="text-center py-10">No data found</p>;

  const handleSort = (field) => {
    if (!NUMERIC_FIELDS.includes(field)) return;

    if (sortBy === field) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setOrder("asc");
    }
  };

  const rows =
    rowsPerPage > 0
      ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      : data;

  return (
    <TableContainer component={Paper} sx={{ mt: 3 }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>
              <b>Product</b>
            </TableCell>
            <TableCell>
              <b>Brand</b>
            </TableCell>

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
            <TableRow key={item.productId}>
              <TableCell>{item.title}</TableCell>
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
            {/* <TablePagination
              count={data.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(e, p) => setPage(p)}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
              rowsPerPageOptions={[5, 10, 25]}
            /> */}
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
