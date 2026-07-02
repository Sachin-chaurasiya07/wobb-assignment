/**
 * Single source of truth for follower/count formatting. The starter
 * project had three near-duplicate copies of this (in ProfileCard,
 * ProfileDetailPage, and here) that each rounded slightly differently.
 * Every screen should use this one.
 */
export function formatCount(count: number): string {
  if (count >= 1_000_000_000) return (count / 1_000_000_000).toFixed(1) + "B";
  if (count >= 1_000_000) return (count / 1_000_000).toFixed(1) + "M";
  if (count >= 1_000) return (count / 1_000).toFixed(1) + "K";
  return count.toString();
}

/**
 * engagement_rate in the source data is already a fraction (e.g. 0.0142
 * means 1.42%). The original ProfileDetailPage multiplied by 10,000 for
 * one card and used this correct `*100` version for a different,
 * mislabeled card. This is the only correct conversion -- use it
 * everywhere engagement rate is displayed.
 */
export function formatEngagementRate(rate: number | undefined): string {
  if (rate === undefined || Number.isNaN(rate)) return "N/A";
  return (rate * 100).toFixed(2) + "%";
}

export function formatFullNumber(count: number): string {
  return new Intl.NumberFormat("en-US").format(count);
}
