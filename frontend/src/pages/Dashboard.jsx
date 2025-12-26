import { useEffect, useState } from "react";
import Header from "../components/Header";
import PriceTable from "../components/PriceTable";
import PriceChangeChart from "../components/PriceChangeChart";
import axios from "axios";

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [sortBy, setSortBy] = useState("priceChange");
  const [order, setOrder] = useState("asc");
  const [trend, setTrend] = useState("");

  const fetchWeeklyReport = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:${import.meta.env.VITE_BACKEND_PORT}/api/weekly-report`,
        {
          params: {
            sortBy,
            order,
            trend: trend || undefined,
          },
        }
      );
      setData(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch report", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeeklyReport();
  }, [sortBy, order, trend]);

  return (
    <>
      <Header />

      <main className="p-6 pt-24">
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
          <h2 className="text-lg font-semibold">
            Myntra Price Analysis Report
          </h2>

          {/* Trend Filter */}
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-semibold text-gray-600">
              Trend Filters -
            </h1>
            <select
              value={trend}
              onChange={(e) => setTrend(e.target.value)}
              className="border px-3 py-2 rounded w-56"
            >
              <option value="">All Trends</option>
              <option value="INCREASED">Trend - Increase Price</option>
              <option value="DECREASED">Trend - Decrease Price</option>
              <option value="NO_CHANGE">Trend - No Change</option>
            </select>
          </div>
        </div>

        <PriceChangeChart data={data} loading={loading} />

        <PriceTable
          data={data}
          loading={loading}
          sortBy={sortBy}
          order={order}
          setSortBy={setSortBy}
          setOrder={setOrder}
        />
      </main>
    </>
  );
};

export default Dashboard;
