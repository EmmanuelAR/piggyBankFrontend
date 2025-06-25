import { atom } from "jotai";

export const savingsSummaryAtom = atom<{
  amount?: string;
  days?: string;
  minutes?: string;
  targetDate?: string;
} | null>(null);
