"use client";

import { useEffect, useRef } from "react";
import type { Locale } from "@/lib/content";

interface VillageCanvasProps {
  locale: Locale;
}

export function VillageCanvas({ locale }: VillageCanvasProps) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    let destroy: (() => void) | undefined;

    // Phaser must never be imported while Next.js is rendering on the server.
    void import("@/game/village").then(({ createVillageGame }) => {
      if (cancelled || !hostRef.current) return;
      const game = createVillageGame(hostRef.current, locale);
      destroy = () => game.destroy(true);
    });

    return () => {
      cancelled = true;
      destroy?.();
    };
  }, [locale]);

  return <div className="village-canvas" ref={hostRef} aria-label="Explorable village prototype" />;
}
