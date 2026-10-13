"use client";

/*
  The exhibits, by id.

  Each chapter in lib/approach.ts names one of these. They are plain components
  with no props, so a chapter can be re-pointed at a different exhibit by
  changing one string.
*/

import type { ComponentType } from "react";
import AiReadiness from "./AiReadiness";
import Funnel from "./Funnel";
import Message from "./Message";
import Plays from "./Plays";
import Scoreboard from "./Scoreboard";
import Segments from "./Segments";
import Signals from "./Signals";
import Website from "./Website";

export type ExhibitId =
  | "scoreboard"
  | "segments"
  | "message"
  | "funnel"
  | "website"
  | "signals"
  | "ai"
  | "plays";

export const EXHIBITS: Record<ExhibitId, ComponentType> = {
  scoreboard: Scoreboard,
  segments: Segments,
  message: Message,
  funnel: Funnel,
  website: Website,
  signals: Signals,
  ai: AiReadiness,
  plays: Plays,
};
