import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchStatsOverview } from "../api/client.js";
import { useAuth } from "../auth/AuthProvider.js";

const DashboardPage: React.FC = () => {
  const { accessToken } = useAuth();

  const { data, isPending, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["stats", "overview"],
    queryFn: () => {
      if (!accessToken) {
        throw new Error("Missing access token");
      }
      return fetchStatsOverview(accessToken);
    },
    enabled: Boolean(accessToken),
    refetchInterval: 60_000,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-slate-100">Overview</h2>
        <button
          type="button"
          onClick={() => refetch()}
          className="rounded border border-slate-700 px-3 py-1 text-xs uppercase tracking-wide text-slate-300 hover:bg-slate-800"
          disabled={isFetching}>
          {isFetching ? "Refreshing" : "Refresh"}
        </button>
      </div>
      {isPending && <p className="text-slate-400">Loading statistics...</p>}
      {isError && (
        <p className="text-rose-400">
          {error instanceof Error ? error.message : "Failed to load stats"}
        </p>
      )}
      {data && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <StatCard title="Active Sessions" value={data.totalSessions} />
          <StatCard title="Unique Users" value={data.uniqueUsers} />
          <StatCard
            title="Completed Recommendations"
            value={data.completedRecommendations}
          />
        </div>
      )}
      {data && (
        <p className="text-xs text-slate-500">
          Last updated: {new Date(data.updatedAt).toLocaleString()}
        </p>
      )}
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value }) => (
  <div className="rounded-lg border border-slate-800 bg-slate-900 p-4 shadow">
    <p className="text-xs uppercase tracking-wide text-slate-400">{title}</p>
    <p className="mt-2 text-3xl font-bold text-emerald-400">
      {value.toLocaleString()}
    </p>
  </div>
);

export default DashboardPage;
