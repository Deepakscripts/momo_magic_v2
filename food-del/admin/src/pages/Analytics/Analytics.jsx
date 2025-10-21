import React, { useEffect, useMemo, useState } from "react";
import "./Analytics.css";
import axios from "axios";
import { url } from "../../assets/assets";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from "recharts";

// tiny util
const fmt = (n) => Number(n || 0).toLocaleString();

const KPI = ({ label, value }) => (
  <div className="kpi">
    <div className="kpi-label">{label}</div>
    <div className="kpi-value">{fmt(value)}</div>
  </div>
);

const useFetch = (fn, deps = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let on = true;
    (async () => {
      try { setLoading(true); const res = await fn(); if (on) setData(res); }
      finally { if (on) setLoading(false); }
    })();
    return () => { on = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return { data, loading };
};

const monthIso = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

export default function Analytics() {
  const nc = useFetch(async () => {
    const r = await axios.get(`${url}/api/analytics/new-customers?days=28`);
    return r.data?.data || { series: [], summary: {} };
  }, []);

  const rr = useFetch(async () => {
    const r = await axios.get(`${url}/api/analytics/repeat-rate`);
    return r.data?.data || { totalUsers: 0, repeatUsers: 0, repeatRate: 0 };
  }, []);

  const top = useFetch(async () => {
    const r = await axios.get(`${url}/api/analytics/top-dishes?limit=10`);
    return Array.isArray(r.data?.data) ? r.data.data : [];
  }, []);

  const least = useFetch(async () => {
    const r = await axios.get(`${url}/api/analytics/least-dishes?limit=10`);
    return Array.isArray(r.data?.data) ? r.data.data : [];
  }, []);

  const rev = useFetch(async () => {
    const r = await axios.get(`${url}/api/analytics/revenue-month?month=${monthIso()}`);
    return r.data?.data || { rows: [] };
  }, []);

  const combos = useFetch(async () => {
    const r = await axios.get(`${url}/api/analytics/popular-combos?limit=10`);
    return Array.isArray(r.data?.data) ? r.data.data : [];
  }, []);

  const kpis = useMemo(() => {
    const s = nc.data?.summary || {};
    const revSum = (rev.data?.rows || []).reduce((a, b) => a + Number(b.totalRevenue || 0), 0);
    return [
      { label: "New Today", value: s.today || 0 },
      { label: "Last 7 Days", value: s.d7 || 0 },
      { label: "Repeat Rate %", value: Math.round((rr.data?.repeatRate || 0) * 10) / 10 },
      { label: "Rev (This Month)", value: revSum },
    ];
  }, [nc.data, rr.data, rev.data]);

  const dailyNew = (nc.data?.series || []).map((d) => ({
    date: new Date(d.date).toLocaleDateString(),
    count: d.count,
  }));

  const topData = (top.data || []).map((r) => ({ name: r.name || r.itemId, qty: r.totalQty }));
  const leastData = (least.data || []).map((r) => ({ name: r.name || r.itemId, qty: r.totalQty }));

  const revData = (rev.data?.rows || []).map((r) => ({
    week: `W${r._id.week}`,
    revenue: Number(r.totalRevenue || 0),
  }));

  return (
    <div className="analytics add">
      <h3>Analytics</h3>

      {/* KPIs */}
      <div className="kpi-row">
        {kpis.map((k) => (
          <KPI key={k.label} label={k.label} value={k.value} />
        ))}
      </div>

      {/* Daily new customers */}
      <div className="card">
        <div className="card-title">New customers (last 28 days)</div>
        <div className="chart">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={dailyNew}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="count" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Revenue by week (current month) */}
      <div className="card">
        <div className="card-title">Revenue by week ({monthIso()})</div>
        <div className="chart">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={revData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top / Least dishes */}
      <div className="grid-2">
        <div className="card">
          <div className="card-title">Top 10 dishes (qty)</div>
          <div className="chart">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={topData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" hide />
                <YAxis />
                <Tooltip />
                <Bar dataKey="qty" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="legend-list">
            {topData.map((d) => <span key={d.name}>{d.name}</span>)}
          </div>
        </div>

        <div className="card">
          <div className="card-title">Least 10 dishes (qty)</div>
          <div className="chart">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={leastData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" hide />
                <YAxis />
                <Tooltip />
                <Bar dataKey="qty" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="legend-list">
            {leastData.map((d) => <span key={d.name}>{d.name}</span>)}
          </div>
        </div>
      </div>

      {/* Popular combos (top pairs) */}
      <div className="card">
        <div className="card-title">Popular item pairs</div>
        <div className="chart">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie dataKey="count" data={(combos.data || []).map(p => ({
                name: `${p._id.a} + ${p._id.b}`, count: p.count
              }))} outerRadius={110} label />
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
