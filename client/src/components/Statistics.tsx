// src/components/Statistics.tsx
import { useEffect, useState } from "react";
import Spinner from "./Spinner";

type Stats = {
  totalLoans: number;
  totalActiveLoans: number;
  totalLoanAmount: number;
  totalRepayments: number;
  totalRepaymentAmount: number;
  totalCustomers: number;
  totalCollaterals: number;
  totalEstimatedCollateralValue: number;
  totalStaff: number;
  totalComplaints: number;
};

export default function Statistics() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStatistics();
  }, []);

  async function fetchStatistics() {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/statistics");
      const data = await res.json();
      if (data.success) {
        setStats({
          totalLoans: Number(data.totalLoans) || 0,
          totalActiveLoans: Number(data.totalActiveLoans) || 0,
          totalLoanAmount: Number(data.totalLoanAmount) || 0,
          totalRepayments: Number(data.totalRepayments) || 0,
          totalRepaymentAmount: Number(data.totalRepaymentAmount) || 0,
          totalCustomers: Number(data.totalCustomers) || 0,
          totalCollaterals: Number(data.totalCollaterals) || 0,
          totalEstimatedCollateralValue: Number(data.totalEstimatedCollateralValue) || 0,
          totalStaff: Number(data.totalStaff) || 0,
          totalComplaints: Number(data.totalComplaints) || 0,
        });
      } else {
        setError("Failed to fetch statistics");
      }
    } catch {
      setError("Network error while fetching statistics");
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <Spinner />;
  if (error) return <div className="text-red-600 px-6">{error}</div>;
  if (!stats) return null;

  const statCards = [
    { title: "Total Loans", value: stats.totalLoans, color: "bg-blue-100", border: "border-blue-600", text: "text-blue-700" },
    { title: "Active Loans", value: stats.totalActiveLoans, color: "bg-green-100", border: "border-green-600", text: "text-green-700" },
    { title: "Total Loan Amount", value: stats.totalLoanAmount, color: "bg-yellow-100", border: "border-yellow-600", text: "text-yellow-700", isCurrency: true },
    { title: "Total Repayments", value: stats.totalRepayments, color: "bg-purple-100", border: "border-purple-600", text: "text-purple-700" },
    { title: "Total Repaid Amount", value: stats.totalRepaymentAmount, color: "bg-indigo-100", border: "border-indigo-600", text: "text-indigo-700", isCurrency: true },
    { title: "Customers", value: stats.totalCustomers, color: "bg-pink-100", border: "border-pink-600", text: "text-pink-700" },
    { title: "Collaterals", value: stats.totalCollaterals, color: "bg-teal-100", border: "border-teal-600", text: "text-teal-700" },
    { title: "Estimated Collateral Value", value: stats.totalEstimatedCollateralValue, color: "bg-orange-100", border: "border-orange-600", text: "text-orange-700", isCurrency: true },
    { title: "Staff", value: stats.totalStaff, color: "bg-gray-100", border: "border-gray-600", text: "text-gray-700" },
    { title: "Complaints", value: stats.totalComplaints, color: "bg-red-100", border: "border-red-600", text: "text-red-700" },
  ];

  return (
    <div className="px-6 py-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {statCards.map((s, idx) => (
        <div
          key={idx}
          className={`${s.color} border-l-4 ${s.border} p-4 rounded-lg shadow-md`}
        >
          <h3 className={`text-lg font-semibold ${s.text}`}>{s.title}</h3>
          <p className="text-3xl font-bold">
            {s.isCurrency
              ? (s.value || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
              : s.value}
          </p>
        </div>
      ))}
    </div>
  );
}
