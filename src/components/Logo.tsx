export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <svg
        width="26"
        height="26"
        viewBox="0 0 96 96"
        fill="none"
        aria-hidden
        className="shrink-0"
      >
        <rect width="96" height="96" rx="24" fill="#161619" />
        <path
          d="M27 30 L48 66 L69 30"
          stroke="#6b6b73"
          strokeWidth="12"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M27 30 L48 66"
          stroke="#ffffff"
          strokeWidth="12"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
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
