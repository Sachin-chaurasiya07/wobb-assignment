import { describe, expect, it } from "vitest";
import { formatCount, formatEngagementRate } from "@/utils/formatters";

describe("formatEngagementRate", () => {
  it("converts a fractional rate to a percentage (regression: was *10000 in one place)", () => {
    // 0.01425 (1.425%) is the kind of value that appears in the sample
    // profile JSON. The original bug multiplied by 10,000 in one of the
    // two places this was rendered, producing "142.50%".
    expect(formatEngagementRate(0.01425)).toBe("1.43%");
  });

  it("returns N/A for undefined", () => {
    expect(formatEngagementRate(undefined)).toBe("N/A");
  });

  it("handles very small rates without rounding to 0 unexpectedly", () => {
    expect(formatEngagementRate(0.0002)).toBe("0.02%");
  });
});

describe("formatCount", () => {
  it("formats thousands", () => {
    expect(formatCount(1500)).toBe("1.5K");
  });

  it("formats millions", () => {
    expect(formatCount(92_690_266)).toBe("92.7M");
  });

  it("formats billions", () => {
    expect(formatCount(1_200_000_000)).toBe("1.2B");
  });

  it("leaves small numbers as-is", () => {
    expect(formatCount(42)).toBe("42");
  });
});
