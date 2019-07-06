export interface Point {
  x: number;
  y: number;
}

export enum Method {
  NearestNeighbor = 'Nearest Neighbor',
  ExhaustiveNearestNeighbor = 'Exhaustive Nearest Neighbor',
  SimulatedAnnealing = 'Simulated Annealing'
}

export interface Result {
  route: number[];
  bestCost: number;
  stats: {
    [key: string]: any;
  };
}

export type RouteGenerator = (points: Point[]) => IterableIterator<Result>;
