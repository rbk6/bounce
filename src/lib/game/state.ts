export interface Player {
  readonly id: string;
  speed: number;
  ready: boolean;
  currentTile: number;
  tileGroup: 0 | 1;
  motion?: {
    destinationTile: number;
    progress: number;
    bufferedDirection?: 'Left' | 'Right';
  };
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
  players: [0, 1].map((tileGroup) => ({
    id: crypto.randomUUID(),
    speed: 5,
    ready: false,
    currentTile: tileGroup,
    tileGroup: tileGroup as 0 | 1,
  })),
  balls: [],
  ballSpeed: 0.01, // progress per second
};

export let state: State = { ...initialState };
