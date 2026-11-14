"use client";

import { useEffect, useRef } from "react";
import type { Locale } from "@/lib/content";
import type { GridPosition } from "@/game/town/town-model";
import type { TownCallbacks } from "@/game/town/town-scene";

export interface TownCanvasProps extends TownCallbacks {
  locale: Locale;
  startPosition: GridPosition;
  worldMinute: number;
  paused: boolean;
}

export function TownCanvas({ locale, startPosition, worldMinute, paused, onChat, onVisit, onPosition }: TownCanvasProps) {
  const host = useRef<HTMLDivElement>(null);
  const controller = useRef<{
    scene: { setClock: (minute: number) => void; setInputPaused: (value: boolean) => void };
  } | null>(null);
  const start = useRef(startPosition);
  const callbacks = useRef({ onChat, onVisit, onPosition });

  useEffect(() => { callbacks.current = { onChat, onVisit, onPosition }; }, [onChat, onVisit, onPosition]);
  useEffect(() => { controller.current?.scene.setClock(worldMinute); }, [worldMinute]);
  useEffect(() => { controller.current?.scene.setInputPaused(paused); }, [paused]);

  useEffect(() => {
    let gone = false;
    let dispose: (() => void) | undefined;
    void import("@/game/town/town-scene").then(({ createTownGame }) => {
      if (gone || !host.current) return;
      const current = createTownGame(host.current, locale, start.current, {
        onChat: message => callbacks.current.onChat(message),
        onVisit: place => callbacks.current.onVisit(place),
        onPosition: position => {
          start.current = position;
          callbacks.current.onPosition(position);
        },
      }, worldMinute);
      controller.current = current;
      current.scene.setInputPaused(paused);
      const observer = new ResizeObserver(() => {
        if (!host.current) return;
        current.game.scale.resize(host.current.clientWidth, host.current.clientHeight);
      });
      observer.observe(host.current);
      dispose = () => { observer.disconnect(); current.game.destroy(true); controller.current = null; };
    });
    return () => { gone = true; dispose?.(); };
    // Only locale rebuilds the Phaser instance; callbacks and clock are forwarded separately.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);

  return <div className="town-canvas" ref={host} aria-label="Full-screen isometric town" />;
}
