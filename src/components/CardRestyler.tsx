"use client";

import { useEffect, useRef, useState } from "react";
import { heroCards } from "@/lib/cards";
import { DesignCard } from "./DesignCard";

/**
 * The hero's one moving part. A Wallet-style stack where the front card
 * changes artwork: it cycles on its own until the visitor picks a design,
 * then it belongs to them.
 */
export function CardRestyler() {
  const [index, setIndex] = useState(0);
  const [auto, setAuto] = useState(true);
  const [tick, setTick] = useState(0);
  const prefersReduced = useRef(false);

  useEffect(() => {
    prefersReduced.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
  }, []);

  useEffect(() => {
    if (!auto || prefersReduced.current) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % heroCards.length);
      setTick((t) => t + 1);
    }, 2600);
    return () => window.clearInterval(id);
  }, [auto]);

  const current = heroCards[index];

  function choose(i: number) {
    setAuto(false);
    if (i === index) return;
    setIndex(i);
    setTick((t) => t + 1);
  }

  return (
    <div className="relative mx-auto w-full max-w-[460px]">
      {/* Back cards, static, give the Wallet stack its depth. */}
      <div className="relative pt-[22%]">
        <div
          className="wcard absolute left-[6%] right-[6%] top-0 opacity-90"
          style={{ aspectRatio: "1.586/1", background: "#d9dce3" }}
          aria-hidden
        />
        <div
          className="wcard absolute left-[3%] right-[3%] top-[11%]"
          style={{ aspectRatio: "1.586/1", background: "#2b2d35" }}
          aria-hidden
        />
        <div key={tick} className="swap-enter relative z-10">
          <DesignCard design={current} priority />
        </div>
      </div>

      {/* Swatches: a row of real card thumbnails. */}
      <div className="mt-7 flex items-center justify-between gap-4">
        <div
          role="radiogroup"
          aria-label="Choose a card design"
          className="flex items-center gap-2.5"
        >
          {heroCards.map((d, i) => {
            const selected = i === index;
            return (
              <button
                key={d.id}
                type="button"
                role="radio"
                aria-checked={selected}
                aria-label={d.name}
                onClick={() => choose(i)}
                className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-cover bg-center transition-transform duration-300 ease-out-soft hover:scale-105"
                style={{
                  backgroundImage: `url(${d.img})`,
                  boxShadow: selected
                    ? "0 0 0 2px var(--paper), 0 0 0 4px var(--ink)"
                    : "inset 0 0 0 1px rgba(21,22,26,.14)",
                }}
              />
            );
          })}
        </div>
        <p
          className="min-w-0 truncate text-right text-sm text-mute"
          aria-live="polite"
        >
          {current.name}
        </p>
      </div>
    </div>
  );
}
