"use client";

/*
  The exhibits, by id.

  Each chapter in lib/approach.ts names one of these. They are plain components
  with no props, so a chapter can be re-pointed at a different exhibit by
  changing one string. Each builds itself in on mount, which is what makes a
  chapter feel like it is loading as the reader arrives at it.
*/

import type { ComponentType } from "react";
import AiReadiness from "./AiReadiness";
import Allocate from "./Allocate";
import Prove from "./Prove";
import Reach from "./Reach";
import RecordGate from "./Record";
import Route from "./Route";
import Sell from "./Sell";
import Stack from "./Stack";
import Website from "./Website";

export type ExhibitId =
  | "allocate"
  | "reach"
  | "website"
  | "stack"
  | "record"
  | "route"
  | "sell"
  | "prove"
  | "ai";

export const EXHIBITS: Record<ExhibitId, ComponentType> = {
  allocate: Allocate,
  reach: Reach,
  website: Website,
  stack: Stack,
  record: RecordGate,
  route: Route,
  sell: Sell,
  prove: Prove,
  ai: AiReadiness,
};
