import { useEffect, useState } from "react";
import Header from "../components/Header";
import PriceTable from "../components/PriceTable";
import PriceChangeChart from "../components/PriceChangeChart";
import axios from "axios";

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState("priceChange");
  const [order, setOrder] = useState("desc");
  const [trend, setTrend] = useState("");

  const fetchWeeklyReport = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:${
          import.meta.env.VITE_BACKEND_PORT
        }/api/weekly-report`,
        {
          params: {
            sortBy,
            order,
            trend: trend || undefined,
          },
        }
      );
      setData(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch weekly report", error);
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
        {/* 🔹 Title + Trend Filter */}
        <div className="flex flex-col md:flex-row md:justify-between gap-4 mb-4">
          <h2 className="text-lg font-semibold">
            Myntra Price Analysis Report
          </h2>

          <div className="flex items-center gap-3">
            <select
              value={trend}
              onChange={(e) => setTrend(e.target.value)}
              className="border px-3 py-2 rounded w-56"
            >
              <option value="">All Trends</option>
              <option value="INCREASED">Trend – Increase</option>
              <option value="DECREASED">Trend – Decrease</option>
              <option value="NO_CHANGE">Trend – No Change</option>
            </select>

            <button
              onClick={fetchWeeklyReport}
              className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 cursor-pointer"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Chart */}
        <PriceChangeChart data={data} loading={loading} />

        {/* Table */}
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
