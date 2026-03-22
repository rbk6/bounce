import { writable } from 'svelte/store';

export enum Phase {
  MainMenu,
  Waiting,
  Playing,
  Paused,
  Ended,
}

export const score = writable(0);
export const timeRemaining = writable(120000); // 2 minutes
export const gamePhase = writable(Phase.Waiting);
