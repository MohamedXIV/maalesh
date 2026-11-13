"use client";

import { useEffect, useRef, useState } from "react";
import { Story } from "inkjs";
import type { Locale } from "@/lib/content";

type Intent = "jobs" | "village";
type Choice = { index: number; text: string };
type Frame = { lines: string[]; choices: Choice[]; intent: Intent | null };

function nextFrame(story: Story): Frame {
  const lines: string[] = [];
  let intent: Intent | null = null;
  while (story.canContinue) {
    const text = story.Continue().trim();
    if (text) lines.push(text);
    for (const tag of story.currentTags) {
      if (tag === "intent:jobs") intent = "jobs";
      if (tag === "intent:village") intent = "village";
    }
  }
  const choices = story.currentChoices.map((choice, index) => ({
    index, text: choice.text,
  }));
  return { lines, choices, intent };
}

export function InkHrDialog({
  locale, onIntent, onClose,
}: {
  locale: Locale;
  onIntent: (intent: Intent) => void;
  onClose: () => void;
}) {
  const storyRef = useRef<Story | null>(null);
  const [frame, setFrame] = useState<Frame>({ lines: [], choices: [], intent: null });
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void fetch("/ink/hr." + locale + ".json")
      .then(response => {
        if (!response.ok) throw new Error("Compiled Ink asset missing");
        return response.text();
      })
      .then(source => {
        if (cancelled) return;
        const story = new Story(source);
        story.ChoosePathString("greeting");
        storyRef.current = story;
        setFrame(nextFrame(story));
      })
      .catch(() => { if (!cancelled) setError(true); });
    return () => { cancelled = true; storyRef.current = null; };
  }, [locale]);

  function choose(index: number) {
    if (!storyRef.current) return;
    storyRef.current.ChooseChoiceIndex(index);
    setFrame(nextFrame(storyRef.current));
  }

  return (
    <>
      <div className="modal-top">
        <div>
          <p className="eyebrow">MAALESH HR COUNTER</p>
          <h2>{locale === "ar" ? "أهلًا بيك في معلش" : "Welcome to Maalesh!"}</h2>
        </div>
        <button className="icon-close" aria-label="Close" onClick={onClose}>×</button>
      </div>
      {error ? (
        <p className="muted">
          {locale === "ar" ? "الموظفة خرجت تجيب شاي. ممكن تدخل الوظايف مباشرة." :
            "The HR agent stepped out for tea. You can still browse the jobs."}
        </p>
      ) : (
        <div className="ink-lines">
          {frame.lines.map((line, index) => <p key={index}>{line}</p>)}
          {frame.lines.length === 0 && frame.choices.length === 0 && <p>...</p>}
        </div>
      )}
      <div className="ink-choices">
        {frame.choices.map(choice => (
          <button className="button secondary full" key={choice.index} onClick={() => choose(choice.index)}>
            {choice.text}
          </button>
        ))}
        {frame.intent && (
          <button className="button primary full" onClick={() => onIntent(frame.intent!)}>
            {frame.intent === "jobs"
              ? (locale === "ar" ? "شوف الوظايف" : "View the jobs")
              : (locale === "ar" ? "اتمشى في القرية" : "Enjoy the village")}
          </button>
        )}
        {(error || (!frame.intent && frame.choices.length === 0)) &&
          <button className="button primary full" onClick={() => onIntent("jobs")}>
            {locale === "ar" ? "الوظايف" : "Browse jobs"}
          </button>
        }
      </div>
    </>
  );
}
