'use client';

/**
 * Exposure Analytics Component (RISK-03)
 * Charts and analytics for portfolio risk exposure and distribution
 */

import { useState, useEffect } from 'react';
import { useServices } from '@/lib/hooks/useServices';
import { PieChart, Pie, BarChart, Bar, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, AlertTriangle } from 'lucide-react';

const RISK_COLORS = {
  Low: '#059669',
  Medium: '#d97706',
  High: '#dc2626',
  Critical: '#991b1b',
};

interface RiskDistribution {
  totalClients: number;
  riskDistribution: Record<string, number>;
  averageRiskScore: number;
  criticalCount: number;
}

export function ExposureAnalytics() {
  const { risk } = useServices();
  const [analytics, setAnalytics] = useState<RiskDistribution | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const mockInstitutionId = 'inst-001-uuid-placeholder';
      const data = await risk.getPortfolioRisk(mockInstitutionId);
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to load exposure analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-64 bg-slate-200 rounded"></div>
        <div className="h-64 bg-slate-200 rounded"></div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <p className="font-sans text-sm text-slate-500">No analytics data available.</p>
      </div>
    );
  }

  // Prepare data for charts
  const pieData = Object.entries(analytics.riskDistribution).map(([name, value]) => ({
    name,
    value,
  }));

  const barData = Object.entries(analytics.riskDistribution).map(([name, value]) => ({
    category: name,
    clients: value,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-serif text-xl text-slate-900 mb-1">Portfolio Exposure Analytics</h3>
        <p className="font-sans text-sm text-slate-600">
          Risk distribution and exposure metrics across client portfolio
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-gradient-to-br from-white to-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <p className="font-sans text-sm text-slate-600">Total Clients</p>
          </div>
          <p className="text-3xl font-serif text-slate-900">{analytics.totalClients}</p>
        </div>

        <div className="p-4 bg-gradient-to-br from-white to-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-amber-600" />
            </div>
            <p className="font-sans text-sm text-slate-600">Avg Risk Score</p>
          </div>
          <p className="text-3xl font-serif text-slate-900">{analytics.averageRiskScore}</p>
          <p className="text-xs font-sans text-slate-500 mt-1">Out of 100</p>
        </div>

        <div className="p-4 bg-gradient-to-br from-white to-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <p className="font-sans text-sm text-slate-600">Critical Risk</p>
          </div>
          <p className="text-3xl font-serif text-slate-900">{analytics.criticalCount}</p>
          <p className="text-xs font-sans text-slate-500 mt-1">
            {((analytics.criticalCount / analytics.totalClients) * 100).toFixed(1)}% of portfolio
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="p-6 bg-white border border-slate-200 rounded-lg">
          <h4 className="font-sans text-sm font-semibold text-slate-700 mb-4 uppercase tracking-wide">
            Risk Distribution (Pie)
          </h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={RISK_COLORS[entry.name as keyof typeof RISK_COLORS]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="p-6 bg-white border border-slate-200 rounded-lg">
          <h4 className="font-sans text-sm font-semibold text-slate-700 mb-4 uppercase tracking-wide">
            Risk Distribution (Bar)
          </h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="clients" fill="#e11d48">
                {barData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={RISK_COLORS[entry.category as keyof typeof RISK_COLORS]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Insights */}
      <div className="p-4 bg-amber-50 border-l-4 border-amber-400 rounded">
        <h4 className="font-sans text-sm font-semibold text-amber-900 mb-2">Risk Insights</h4>
        <ul className="space-y-1 font-sans text-sm text-amber-800">
          <li>
            • {analytics.criticalCount > 0
              ? `${analytics.criticalCount} client${analytics.criticalCount > 1 ? 's' : ''} require immediate attention (Critical risk)`
              : 'No clients in Critical risk category'}
          </li>
          <li>
            • Portfolio average risk score: {analytics.averageRiskScore}/100
            {analytics.averageRiskScore > 60 ? ' (Above threshold)' : ' (Within acceptable range)'}
          </li>
          <li>
            • {(analytics.riskDistribution.High || 0) + (analytics.riskDistribution.Critical || 0)} clients in High or Critical categories
          </li>
        </ul>
      </div>
    </div>
  );
}
