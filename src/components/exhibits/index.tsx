"use client";

/*
  The exhibits, by id.

  Chapters in lib/approach.ts and deep-dive pages in lib/capabilities.ts both
  name exhibits from here. They are plain components with no props, so a page
  can be re-pointed at a different exhibit by changing one string. Each builds
  itself in on mount, which is what makes a chapter feel like it is loading as
  the reader arrives at it.

  Some exist only for a deep-dive page — the stack, speed to lead, the message
  grid, attribution in depth, the readiness matrix — because they are real work
  and a real argument, but they are not the plot of the approach.
*/

import type { ComponentType } from "react";
import AiPath from "./AiPath";
import AiReadiness from "./AiReadiness";
import Allocate from "./Allocate";
import Attribution from "./Attribution";
import Icp from "./Icp";
import Journey from "./Journey";
import Motion from "./Motion";
import Prove from "./Prove";
import Reach from "./Reach";
import RecordGate from "./Record";
import Route from "./Route";
import Sell from "./Sell";
import Stack from "./Stack";
import Touchpoints from "./Touchpoints";
import Website from "./Website";

export type ExhibitId =
  | "icp"
  | "record"
  | "journey"
  | "website"
  | "touchpoints"
  | "sell"
  | "motion"
  | "allocate"
  | "prove"
  | "aipath"
  | "stack"
  | "route"
  | "reach"
  | "attribution"
  | "readiness";

export const EXHIBITS: Record<ExhibitId, ComponentType> = {
  icp: Icp,
  record: RecordGate,
  journey: Journey,
  website: Website,
  touchpoints: Touchpoints,
  sell: Sell,
  motion: Motion,
  allocate: Allocate,
  prove: Prove,
  aipath: AiPath,
  stack: Stack,
  route: Route,
  reach: Reach,
  attribution: Attribution,
  readiness: AiReadiness,
};
