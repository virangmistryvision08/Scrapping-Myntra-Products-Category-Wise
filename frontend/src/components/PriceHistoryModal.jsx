import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import axios from "axios";
import { useEffect, useState } from "react";

const PriceHistoryModal = ({ open, product, onClose }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!product) return;

    const fetchHistory = async () => {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:${
          import.meta.env.VITE_BACKEND_PORT
        }/api/price-history/${product.productId}`
      );
      setData(res.data.data || []);
      setLoading(false);
    };

    fetchHistory();
  }, [product]);

  const processedData = data.map((item, index) => {
    const prevPrice = index > 0 ? data[index - 1].original_price : null;

    return {
      ...item,
      priceChange: prevPrice !== null ? item.original_price - prevPrice : 0,
    };
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {product?.title}
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {loading ? (
          <Typography align="center">Loading price history...</Typography>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={processedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="scrape_date"
                tickFormatter={(d) =>
                  new Date(d).toLocaleDateString("en-IN", {
                    timeZone: "Asia/Kolkata",
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                }
              />
              <YAxis />
              <Tooltip
                labelFormatter={(label) =>
                  new Date(label).toLocaleString("en-IN", {
                    timeZone: "Asia/Kolkata",
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                }
                content={({ payload, label }) => {
                  if (!payload || !payload.length) return null;

                  const currentPrice = payload[0].value;
                  const change = payload[0].payload.priceChange;

                  return (
                    <div
                      style={{
                        background: "#fff",
                        padding: "10px",
                        border: "1px solid #ddd",
                        borderRadius: "6px",
                      }}
                    >
                      <p>
                        <strong>
                          {new Date(label).toLocaleDateString("en-IN", {
                            timeZone: "Asia/Kolkata",
                          })}
                        </strong>
                      </p>

                      <p>Price: ₹{currentPrice}</p>

                      <p
                        style={{
                          color:
                            change > 0 ? "green" : change < 0 ? "red" : "#555",
                        }}
                      >
                        Change: {change > 0 ? "+" : ""}₹{change}
                      </p>
                    </div>
                  );
                }}
              />
              <Line
                type="monotone"
                dataKey="original_price"
                stroke="#2563eb"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PriceHistoryModal;
