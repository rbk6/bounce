export interface Player {
  readonly id: string;
  tile: number;
  speed: number;
  ready: boolean;
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
