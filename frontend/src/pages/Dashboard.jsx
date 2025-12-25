import { useEffect, useState } from "react";
import Header from "../components/Header";
import PriceTable from "../components/PriceTable";
import axios from "axios";
import PriceChangeChart from "../components/PriceChangeChart";

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWeeklyReport = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:${import.meta.env.VITE_BACKEND_PORT}/api/weekly-report`
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
  }, []);

  return (
    <>
      <Header />

      <main className="p-6 pt-24">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-base md:text-lg font-semibold text-black">
            Weekly Price Analysis Report
          </h2>

          <button
            onClick={fetchWeeklyReport}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 cursor-pointer"
          >
            Refresh
          </button>
        </div>

        {/* Chart */}
        <PriceChangeChart data={data} loading={loading} />

        {/* Table */}
        <PriceTable data={data} loading={loading} />
      </main>
    </>
  );
};

export default Dashboard;
