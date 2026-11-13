"use client";

import { useEffect, useRef } from "react";
import type { Locale } from "@/lib/content";
import type { VillageCallbacks, VillagePosition } from "@/game/village";

interface VillageCanvasProps extends VillageCallbacks {
  locale: Locale;
  startPosition: VillagePosition;
}

export function VillageCanvas({ locale, startPosition, onVisit, onPosition }: VillageCanvasProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const callbacksRef = useRef({ onVisit, onPosition });
  useEffect(() => { callbacksRef.current = { onVisit, onPosition }; }, [onVisit, onPosition]);
  const positionRef = useRef(startPosition);

  useEffect(() => {
    let cancelled = false;
    let destroy: (() => void) | undefined;
    void import("@/game/village").then(({ createVillageGame }) => {
      if (cancelled || !hostRef.current) return;
      const game = createVillageGame(hostRef.current, locale, positionRef.current, {
        onVisit: place => callbacksRef.current.onVisit(place),
        onPosition: position => {
          positionRef.current = position;
          callbacksRef.current.onPosition(position);
        },
      });
      destroy = () => game.destroy(true);
    });

    return () => { cancelled = true; destroy?.(); };
  }, [locale]);

  return <div className="village-canvas" ref={hostRef} aria-label="Walkable oblique village" />;
}
