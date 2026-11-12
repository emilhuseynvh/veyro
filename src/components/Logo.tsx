export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <svg
        width="26"
        height="26"
        viewBox="38 38 180 180"
        fill="none"
        aria-hidden
        className="shrink-0"
      >
        {/* Veyro "Overlap" mark: two surfaces meeting, a new window between them. */}
        <path
          fillRule="evenodd"
          fill="#9453FF"
          d="M74 46H142A28 28 0 0 1 170 74V142A28 28 0 0 1 142 170H74A28 28 0 0 1 46 142V74A28 28 0 0 1 74 46Z
             M114 86H182A28 28 0 0 1 210 114V182A28 28 0 0 1 182 210H114A28 28 0 0 1 86 182V114A28 28 0 0 1 114 86Z"
        />
      </svg>
      <span
        className="font-display text-[1.125rem] font-bold tracking-[-0.02em]"
        style={{ color: light ? "#fff" : undefined }}
      >
        Veyro
      </span>
    </span>
  );
}
