"use client";

import { useEffect, useRef } from "react";
import type { Locale } from "@/lib/content";

interface PaperOfficeCanvasProps {
  locale: Locale;
  onComplete: () => void;
}

/** Isolated Phaser minigame. Parent retains the global quit/exit controls. */
export function PaperOfficeCanvas({ locale, onComplete }: PaperOfficeCanvasProps) {
  const host = useRef<HTMLDivElement>(null);
  const completeRef = useRef(onComplete);
  completeRef.current = onComplete;

  useEffect(() => {
    let cancelled = false;
    let destroy: (() => void) | undefined;
    void import("@/game/paper-office").then(({ createPaperOfficeGame }) => {
      if (cancelled || !host.current) return;
      const game = createPaperOfficeGame(host.current, locale, () => completeRef.current());
      destroy = () => game.destroy(true);
    });
    return () => { cancelled = true; destroy?.(); };
  }, [locale]);

  return <div ref={host} className="village-canvas" aria-label="Paper stabilization playable office" />;
}
