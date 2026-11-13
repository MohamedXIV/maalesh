"use client";

import { useEffect, useRef } from "react";
import type { Locale } from "@/lib/content";
import type { ApartmentInteraction } from "@/game/apartment";

export function ApartmentCanvas({
  locale, hasLamp, onInteract,
}: {
  locale: Locale;
  hasLamp: boolean;
  onInteract: (action: ApartmentInteraction) => void;
}) {
  const host = useRef<HTMLDivElement>(null);
  const onInteractRef = useRef(onInteract);
  onInteractRef.current = onInteract;
  useEffect(() => {
    let cancelled = false;
    let dispose: (() => void) | undefined;
    void import("@/game/apartment").then(({ createApartmentGame }) => {
      if (cancelled || !host.current) return;
      const game = createApartmentGame(host.current, locale, hasLamp,
        (interaction) => onInteractRef.current(interaction));
      dispose = () => game.destroy(true);
    });
    return () => { cancelled = true; dispose?.(); };
  }, [locale, hasLamp]);
  return <div ref={host} className="village-canvas" aria-label="Interactive apartment" />;
}
