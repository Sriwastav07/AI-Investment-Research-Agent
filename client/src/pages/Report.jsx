import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import {
  Download,
  TrendingUp,
  ShieldAlert,
  PieChart,
  CheckCircle2,
  XCircle,
  Share2,
  BarChart3,
} from "lucide-react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import Navbar from "../components/Navbar";
import GlassCard from "../components/GlassCard";

const recommendationStyle = {
  INVEST: {
    border: "border-emerald",
    badge: "bg-emerald/20 text-emerald",
  },
  HOLD: {
    border: "border-yellow-400",
    badge: "bg-yellow-400/20 text-yellow-400",
  },
  PASS: {
    border: "border-red-400",
    badge: "bg-red-400/20 text-red-400",
  },
};

const Report = () => {
  const { id } = useParams();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await api.get(
          `/api/research/report/${id}`,
          {
            headers: {
              "x-auth-token": token,
            },
          }
        );

        console.log(res.data);

        setReport(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id]);

  const handleDownload = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get(
        `/api/research/report/${id}/pdf`,
        {
          headers: {
            "x-auth-token": token,
          },
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(
        new Blob([response.data])
      );

      const link = document.createElement("a");

      link.href = url;

      link.download = `${report.companyName}_Report.pdf`;

      link.click();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading Report...
      </div>
    );

  if (!report)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Report Not Found
      </div>
    );

  const style =
    recommendationStyle[report.recommendation] ||
    recommendationStyle.HOLD;

  const chartData = [
    {
      name: "Revenue",
      value: Number(
        report.details?.financials?.revenue || 0
      ),
    },
    {
      name: "Net Income",
      value: Number(
        report.details?.financials?.netIncome || 0
      ),
    },
    {
      name: "Cash Flow",
      value: Number(
        report.details?.financials?.cashFlow || 0
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <Navbar />

      <main className="pt-28 px-6 max-w-7xl mx-auto">

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">

          <div>

            <div className="flex items-center gap-3">

              <h1 className="text-5xl font-black">
                {report.companyName}
              </h1>

              <span className="px-4 py-1 rounded-full bg-white/10 border border-white/10">

                {report.details?.companyProfile?.symbol ||
                  "N/A"}

              </span>

            </div>

            <p className="text-gray-400 mt-2">

              {report.details?.companyProfile?.industry ||
                "Industry Not Available"}

              {" • "}

              {report.details?.companyProfile
                ?.headquarters ||
                "Headquarters Not Available"}

            </p>

          </div>

          <div className="flex gap-4">

            <button
              onClick={handleDownload}
              className="btn-primary flex items-center gap-2"
            >
              <Download size={18} />
              Download PDF
            </button>

            <button className="p-3 rounded-full bg-white/10">

              <Share2 size={18} />

            </button>

          </div>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <div className="lg:col-span-2 space-y-8">

            <GlassCard className={`border-l-8 ${style.border}`}>

              <div className="flex justify-between">

                <div>

                  <h2 className="text-2xl font-bold">

                    AI Recommendation

                  </h2>

                  <p className="text-gray-400">

                    Final investment decision

                  </p>

                </div>

                <div
                  className={`px-6 py-2 rounded-xl font-black text-xl ${style.badge}`}
                >
                  {report.recommendation}
                </div>

              </div>

              <p className="mt-6 text-lg">

                {report.summary}

              </p>

              <div className="mt-6">

                <div className="w-full h-3 rounded-full bg-gray-800">

                  <div
                    className="bg-sky h-full rounded-full"
                    style={{
                      width: `${report.confidenceScore || 0}%`,
                    }}
                  />

                </div>

                <p className="mt-2 font-bold text-sky">

                  {report.confidenceScore || 0}% Confidence

                </p>

              </div>

              <div className="grid grid-cols-2 gap-6 mt-8">

                <div>

                  <p className="text-gray-400">

                    Risk Level

                  </p>

                  <p className="font-bold">

                    {report.riskLevel || "Unknown"}

                  </p>

                </div>

                <div>

                  <p className="text-gray-400">

                    Investment Horizon

                  </p>

                  <p className="font-bold">

                    {report.investmentHorizon || "Unknown"}

                  </p>

                </div>

              </div>

            </GlassCard>
            {/* Financial Chart */}

            <GlassCard>

              <div className="flex items-center gap-2 mb-6">

                <BarChart3 className="text-sky" />

                <h2 className="text-xl font-bold">

                  Financial Overview

                </h2>

              </div>

              <div className="h-80">

                <ResponsiveContainer width="100%" height="100%">

                  <BarChart data={chartData}>

                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#374151"
                    />

                    <XAxis dataKey="name" />

                    <YAxis />

                    <Tooltip />

                    <Bar
                      dataKey="value"
                      fill="#38BDF8"
                      radius={[5, 5, 0, 0]}
                    />

                  </BarChart>

                </ResponsiveContainer>

              </div>

            </GlassCard>

            {/* SWOT */}

            <div className="grid md:grid-cols-2 gap-6">

              <SWOTCard
                title="Strengths"
                type="strength"
                items={report.details?.swot?.strengths || []}
              />

              <SWOTCard
                title="Weaknesses"
                type="weakness"
                items={report.details?.swot?.weaknesses || []}
              />

              <SWOTCard
                title="Opportunities"
                type="opportunity"
                items={report.details?.swot?.opportunities || []}
              />

              <SWOTCard
                title="Threats"
                type="threat"
                items={report.details?.swot?.threats || []}
              />

            </div>

            {/* Pros & Cons */}

            <div className="grid md:grid-cols-2 gap-6">

              <GlassCard>

                <h2 className="text-xl font-bold text-emerald mb-5">

                  Pros

                </h2>

                {(report.pros || []).length === 0 ? (

                  <p className="text-gray-400">

                    No information available.

                  </p>

                ) : (

                  <ul className="space-y-3">

                    {report.pros.map((pro, index) => (

                      <li
                        key={index}
                        className="flex gap-3 text-gray-300"
                      >

                        <CheckCircle2
                          className="text-emerald mt-1"
                          size={18}
                        />

                        {pro}

                      </li>

                    ))}

                  </ul>

                )}

              </GlassCard>

              <GlassCard>

                <h2 className="text-xl font-bold text-red-400 mb-5">

                  Cons

                </h2>

                {(report.cons || []).length === 0 ? (

                  <p className="text-gray-400">

                    No information available.

                  </p>

                ) : (

                  <ul className="space-y-3">

                    {report.cons.map((con, index) => (

                      <li
                        key={index}
                        className="flex gap-3 text-gray-300"
                      >

                        <XCircle
                          className="text-red-400 mt-1"
                          size={18}
                        />

                        {con}

                      </li>

                    ))}

                  </ul>

                )}

              </GlassCard>

            </div>

          </div>

          {/* Sidebar */}

          <div className="space-y-8">
            {/* Quick Metrics */}
                        <GlassCard>

              <div className="flex items-center gap-2 mb-6">

                <PieChart className="text-sky" />

                <h2 className="text-xl font-bold">

                  Company Information

                </h2>

              </div>

              <div className="space-y-4">

                <MetricItem
                  label="CEO"
                  value={
                    report.details?.companyProfile?.ceo ||
                    "Not Available"
                  }
                />

                <MetricItem
                  label="Sector"
                  value={
                    report.details?.companyProfile?.sector ||
                    "Not Available"
                  }
                />

                <MetricItem
                  label="Industry"
                  value={
                    report.details?.companyProfile?.industry ||
                    "Not Available"
                  }
                />

                <MetricItem
                  label="Country"
                  value={
                    report.details?.companyProfile?.country ||
                    "Not Available"
                  }
                />

                <MetricItem
                  label="Exchange"
                  value={
                    report.details?.companyProfile?.exchange ||
                    "Not Available"
                  }
                />

                <MetricItem
                  label="Website"
                  value={
                    report.details?.companyProfile?.website ||
                    "Not Available"
                  }
                />

              </div>

            </GlassCard>

            <GlassCard>

              <h2 className="text-xl font-bold mb-6">

                Key Financials

              </h2>

              <div className="space-y-4">

                <MetricItem
                  label="Market Cap"
                  value={
                    report.details?.financials?.marketCap ??
                    "Not Available"
                  }
                />

                <MetricItem
                  label="P/E Ratio"
                  value={
                    report.details?.financials?.peRatio ??
                    "Not Available"
                  }
                />

                <MetricItem
                  label="EPS"
                  value={
                    report.details?.financials?.eps ??
                    "Not Available"
                  }
                />

                <MetricItem
                  label="Revenue"
                  value={
                    report.details?.financials?.revenue ??
                    "Not Available"
                  }
                />

                <MetricItem
                  label="Net Income"
                  value={
                    report.details?.financials?.netIncome ??
                    "Not Available"
                  }
                />

                <MetricItem
                  label="Cash Flow"
                  value={
                    report.details?.financials?.cashFlow ??
                    "Not Available"
                  }
                />

              </div>

            </GlassCard>

            <GlassCard>

              <div className="flex items-center gap-2 mb-6">

                <ShieldAlert className="text-red-400" />

                <h2 className="text-xl font-bold">

                  Risk Assessment

                </h2>

              </div>

              {(report.details?.risks || []).length === 0 ? (

                <p className="text-gray-400">

                  No major risks identified.

                </p>

              ) : (

                report.details.risks.map((risk, index) => (

                  <div
                    key={index}
                    className="mb-4 p-4 rounded-xl bg-white/5"
                  >

                    <h4 className="font-bold">

                      {risk.category}

                    </h4>

                    <p className="text-sm text-gray-400">

                      {risk.description}

                    </p>

                  </div>

                ))

              )}

            </GlassCard>

            <GlassCard>

              <div className="flex items-center gap-2 mb-5">

                <TrendingUp className="text-emerald" />

                <h2 className="text-xl font-bold">

                  Market Sentiment

                </h2>

              </div>

              <h3 className="text-3xl font-black text-emerald mb-4">

                {report.details?.sentiment?.sentiment ||
                  "Neutral"}

              </h3>

              <p className="text-gray-400">

                {report.details?.sentiment?.summary ||
                  "No sentiment analysis available."}

              </p>

            </GlassCard>

          </div>

        </div>

      </main>

    </div>

  );

};

const MetricItem = ({ label, value }) => (

  <div className="flex justify-between items-center">

    <span className="text-gray-400">

      {label}

    </span>

    <span className="font-semibold text-right">

      {value}

    </span>

  </div>

);

const SWOTCard = ({ title, items, type }) => {

  const icons = {

    strength: <CheckCircle2 className="text-emerald" size={18} />,

    weakness: <XCircle className="text-red-400" size={18} />,

    opportunity: <TrendingUp className="text-sky" size={18} />,

    threat: <ShieldAlert className="text-yellow-400" size={18} />,

  };

  return (

    <GlassCard>

      <div className="flex items-center gap-2 mb-4">

        {icons[type]}

        <h2 className="font-bold">

          {title}

        </h2>

      </div>

      {items.length === 0 ? (

        <p className="text-gray-400">

          No data available.

        </p>

      ) : (

        <ul className="space-y-3">

          {items.map((item, index) => (

            <li
              key={index}
              className="text-gray-300 flex gap-2"
            >

              • {item}

            </li>

          ))}

        </ul>

      )}

    </GlassCard>

  );

};

export default Report;