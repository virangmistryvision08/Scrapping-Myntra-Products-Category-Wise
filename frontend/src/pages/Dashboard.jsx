import { useEffect, useState } from "react";
import Header from "../components/Header";
import PriceTable from "../components/PriceTable";
import PriceChangeChart from "../components/PriceChangeChart";
import axios from "axios";

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔹 dropdown sorting (title / brand)
  const [sortMode, setSortMode] = useState("TITLE_AZ");

  // 🔹 numeric toggle sorting
  const [sortBy, setSortBy] = useState("");
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
            sortMode,
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
  }, [sortMode, sortBy, order, trend]);

  return (
    <>
      <Header />

      <main className="p-6 pt-24">
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
          <h2 className="text-lg font-semibold">
            Myntra Price Analysis Report
          </h2>

          <div className="flex gap-3 items-center">
            {/* 🔹 Dropdown: Title / Brand sorting */}
            <div className="flex items-center gap-3">
              <h1 className="text-lg font-semibold text-gray-600">Sorting (Title & Brand) - </h1>
              <select
                value={sortMode}
                onChange={(e) => {
                  setSortMode(e.target.value);

                  // 🔥 reset numeric toggle
                  setSortBy("");
                  setOrder("desc");
                }}
                className="border px-3 py-2 rounded"
              >
                <option value="">Default</option>
                <option value="TITLE_AZ">Title – A → Z</option>
                <option value="TITLE_ZA">Title – Z → A</option>
                <option value="BRAND_AZ">Brand – A → Z</option>
                <option value="BRAND_ZA">Brand – Z → A</option>
              </select>
            </div>

            {/* 🔹 Trend filter */}
            <div className="flex items-center gap-3">
              <h1 className="text-lg font-semibold text-gray-600">Trend Filter -</h1>
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
            </div>
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
