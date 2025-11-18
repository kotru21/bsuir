import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchDemographics, fetchOverview, fetchTimeline } from "../api/stats";
import {
  mapRecordWithTranslation,
  translateGenderPlural,
  translateGoal,
  translateTrainingFormat,
  GENDER_ORDER,
} from "../localization";
import type {
  DemographicStats,
  OverviewStats,
  TimelinePoint,
} from "../types/stats";

export function useOverviewStats(rangeDays: number) {
  const overviewQuery = useQuery({
    queryKey: ["overview"],
    queryFn: fetchOverview,
  });

  const demographicsQuery = useQuery({
    queryKey: ["demographics"],
    queryFn: fetchDemographics,
  });

  const timelineQuery = useQuery({
    queryKey: ["timeline", rangeDays],
    queryFn: () => fetchTimeline(rangeDays),
  });

  const overview = overviewQuery.data as OverviewStats | undefined;
  const demographics = demographicsQuery.data as DemographicStats | undefined;
  const timeline = timelineQuery.data as
    | { points: TimelinePoint[] }
    | undefined;

  const timelinePoints = timeline?.points ?? [];

  const genderDistribution = useMemo(() => {
    const source = overview?.genderDistribution ?? {};
    return mapRecordWithTranslation(
      source,
      translateGenderPlural,
      GENDER_ORDER
    );
  }, [overview]);

  const topFormats = useMemo(() => {
    const leaders = overview?.formatLeaders ?? [];
    return leaders
      .filter((entry) => Boolean(entry?.format))
      .map(({ format, count }) => ({
        key: format,
        label: translateTrainingFormat(format),
        count,
      }));
  }, [overview]);

  const topGoals = useMemo(() => {
    const leaders = overview?.goalLeaders ?? [];
    return leaders
      .filter((entry) => Boolean(entry?.goal))
      .map(({ goal, count }) => ({
        key: goal,
        label: translateGoal(goal),
        count,
      }));
  }, [overview]);

  const loading =
    overviewQuery.isLoading ||
    demographicsQuery.isLoading ||
    timelineQuery.isLoading;
  const isError =
    overviewQuery.isError || demographicsQuery.isError || timelineQuery.isError;
  const error =
    overviewQuery.error || demographicsQuery.error || timelineQuery.error;

  function refetchAll() {
    return Promise.allSettled([
      overviewQuery.refetch(),
      demographicsQuery.refetch(),
      timelineQuery.refetch(),
    ]);
  }

  return {
    overview,
    demographics,
    timeline,
    timelinePoints,
    genderDistribution,
    topFormats,
    topGoals,

    // queries
    overviewQuery,
    demographicsQuery,
    timelineQuery,

    // state
    loading,
    isError,
    error,
    refetchAll,
  };
}
