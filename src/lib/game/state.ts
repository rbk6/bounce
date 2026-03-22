export interface Player {
  readonly id: string;
  speed: number;
  ready: boolean;
  currentTile: number;
  tileGroup: 0 | 1;
}

export interface Ball {
  fromTile: number;
  toTile: number;
  hitCount: number;
  progress: number;
}

export interface State {
  players: Player[];
  balls: Ball[];
  ballSpeed: number;
}

export const initialState: State = {
  players: [],
  balls: [],
  ballSpeed: 0.01, // progress per frame
};

export let state: State = { ...initialState };
