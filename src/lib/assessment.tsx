"use client";

/*
  The visitor's read, kept in localStorage.

  Modelled as an external store rather than component state: localStorage is a
  platform API that exists only on the client, so useSyncExternalStore is the
  primitive that fits — it serves an empty snapshot during SSR and the real one
  once hydrated, without a setState-in-effect round trip.

  Nothing here prompts, gates, or asks permission. Answers are saved as they
  are made and restored silently on return.
*/

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from "react";
import type { Level, Ratings } from "./system";

const KEY = "audaption.read.v1";

interface Stored {
  ratings: Ratings;
  symptom: string | null;
}

const EMPTY: Stored = { ratings: {}, symptom: null };

/* ---- store ---- */

let cache: Stored | null = null;
const listeners = new Set<() => void>();

function read(): Stored {
  if (cache) return cache;
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? (JSON.parse(raw) as Partial<Stored>) : null;
    cache =
      parsed && typeof parsed.ratings === "object" && parsed.ratings !== null
        ? {
            ratings: parsed.ratings,
            symptom: typeof parsed.symptom === "string" ? parsed.symptom : null,
          }
        : EMPTY;
  } catch {
    // Private mode, disabled storage, or corrupt JSON. Not worth interrupting
    // anyone over — the page works identically without it.
    cache = EMPTY;
  }
  return cache;
}

function write(next: Stored) {
  cache = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* quota or storage disabled — keep the in-memory read */
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

const serverSnapshot = () => EMPTY;
const isClient = () => true;
const isServer = () => false;

/* ---- context ---- */

interface Ctx extends Stored {
  setRating: (roomId: string, level: Level) => void;
  clearRating: (roomId: string) => void;
  setSymptom: (id: string | null) => void;
  reset: () => void;
  /** False during SSR and the hydrating render, so both agree on markup. */
  hydrated: boolean;
}

const AssessmentContext = createContext<Ctx | null>(null);

export function AssessmentProvider({ children }: { children: React.ReactNode }) {
  const state = useSyncExternalStore(subscribe, read, serverSnapshot);
  const hydrated = useSyncExternalStore(subscribe, isClient, isServer);

  const setRating = useCallback((roomId: string, level: Level) => {
    const current = read();
    write({ ...current, ratings: { ...current.ratings, [roomId]: level } });
  }, []);

  const clearRating = useCallback((roomId: string) => {
    const current = read();
    const ratings = { ...current.ratings };
    delete ratings[roomId];
    write({ ...current, ratings });
  }, []);

  const setSymptom = useCallback((id: string | null) => {
    write({ ...read(), symptom: id });
  }, []);

  const reset = useCallback(() => write({ ratings: {}, symptom: null }), []);

  const value = useMemo(
    () => ({
      ratings: state.ratings,
      symptom: state.symptom,
      setRating,
      clearRating,
      setSymptom,
      reset,
      hydrated,
    }),
    [state, setRating, clearRating, setSymptom, reset, hydrated],
  );

  return (
    <AssessmentContext.Provider value={value}>
      {children}
    </AssessmentContext.Provider>
  );
}

export function useAssessment() {
  const ctx = useContext(AssessmentContext);
  if (!ctx) {
    throw new Error("useAssessment must be used inside AssessmentProvider");
  }
  return ctx;
}
