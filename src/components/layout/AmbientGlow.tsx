/**
 * Purely decorative ambient glow blobs, echoing the floating orbs in the
 * reference design. Fixed, behind all content, and hidden from
 * accessibility tools -- this never affects layout or interaction.
 *
 * Each blob drifts slowly (22-32s per cycle) via CSS keyframes defined
 * in index.css, and that animation is disabled entirely for anyone with
 * `prefers-reduced-motion: reduce` set.
 */
export function AmbientGlow() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div
        className="absolute -top-32 left-1/4 w-[32rem] h-[32rem] rounded-full opacity-25 blur-[120px] animate-drift-a"
        style={{ background: "var(--accent-2)" }}
      />
      <div
        className="absolute top-1/3 -right-32 w-[28rem] h-[28rem] rounded-full opacity-20 blur-[120px] animate-drift-b"
        style={{ background: "var(--accent)" }}
      />
      <div
        className="absolute bottom-0 left-1/3 w-[24rem] h-[24rem] rounded-full opacity-15 blur-[130px] animate-drift-c"
        style={{ background: "#6366f1" }}
      />
    </div>
  );
}
