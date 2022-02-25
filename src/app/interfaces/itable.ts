export interface IPlayer {
  id: number;
  player: string;
  result: IPlayerResult[];
}
export interface IPlayerResult {
  eventName: string;
  score?: number;
}
