import React, { useEffect, useState } from 'react';
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChartLine, faBoxOpen, faCheckCircle,
  faBoxesPacking, faChartPie, faClock
} from '@fortawesome/free-solid-svg-icons';

import { Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
);

const AdminAnalytics = () => {
  const api = import.meta.env.VITE_API_BASE_URL;
  const [stats, setStats] = useState({});
  const [chart, setChart] = useState({ labels: [], data: [] });
  const [workload, setWorkload] = useState({});
  const [range, setRange] = useState("24h");

  useEffect(() => {
    fetchStats();
    fetchChart();
    fetchWorkload();
  }, [range]);

  const fetchStats = async () => {
    const res = await axios.get(`${api}/analytics/stats`);
    setStats(res.data);
  };

  const fetchChart = async () => {
    const res = await axios.get(`${api}/analytics/picking-efficiency?range=${range}`);
    setChart(res.data);
  };

  const fetchWorkload = async () => {
    const res = await axios.get(`${api}/analytics/workload`);
    setWorkload(res.data);
  };

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false, 
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: { boxWidth: 12, font: { size: 10 } }
      }
    }
  };

  const lineData = {
    labels: chart.labels,
    datasets: [{
      label: "Orders Picked",
      data: chart.data,
      borderColor: "#81181C",
      backgroundColor: "rgba(129,24,28,0.1)",
      fill: true,
      tension: 0.4
    }]
  };

  const pieData = {
    labels: ["Picking", "Verifying", "Billed (Pending)"],
    datasets: [{
      data: [workload.picking || 0, workload.verifying || 0, workload.billed || 0],
      backgroundColor: ["#81181C", "#d38818dc", "#4853649c"],
      borderWidth: 0
    }]
  };

  const statsCards = [
    { title: 'Total Bills Today', value: stats.totalBillsToday || 0, icon: faBoxOpen },
    { title: 'Billed Today', value: stats.billedToday || 0, icon: faClock },
    { title: 'Picked Today', value: stats.pickedToday || 0, icon: faBoxesPacking },
    { title: 'Verified Today', value: stats.verifiedToday || 0, icon: faCheckCircle }
  ];

  return (
    <div className="p-3 md:p-4 max-w-7xl mx-auto animate-in fade-in duration-700">
      <div className="mb-3">
        <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">
          Operational <span className="text-[#81181C]">Analytics</span>
        </h2>
        <p className="text-slate-500 font-medium text-sm">Real-time performance tracking.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {statsCards.map((item, idx) => (
          <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm group">
            <div className="flex justify-between items-center mb-2">
              <div className="p-2 bg-red-50 text-[#81181C] rounded-lg group-hover:bg-[#81181C] group-hover:text-white transition-colors">
                <FontAwesomeIcon icon={item.icon} />
              </div>
            </div>
            <h4 className="text-slate-400 text-[10px] font-black uppercase tracking-wider">{item.title}</h4>
            <div className="text-2xl font-black text-slate-800 tracking-tight">{item.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <FontAwesomeIcon icon={faChartLine} className="text-[#81181C]" /> Picking Efficiency
            </h3>
            <select 
              value={range} 
              onChange={(e) => setRange(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-[10px] font-black p-1.5 rounded-lg outline-none uppercase tracking-widest"
            >
              <option value="24h">24H</option>
              <option value="7d">7D</option>
            </select>
          </div>
          <div className="h-68 w-full">
            <Line data={lineData} options={commonOptions} />
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-4 shadow-sm">
          <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-3">
            <FontAwesomeIcon icon={faChartPie} className="text-[#81181C]" /> Today Live Workload
          </h3>
          <div className="h-68 w-full">
            <Doughnut data={pieData} options={commonOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;