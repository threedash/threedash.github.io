export interface ICompetition {
  e: string;
  date: string;
  yTitle: string;
  yLink: string;
  players: IPlayer[];
  total: string;
}
export interface IPlayer {
  index?: string | number;
  player: string;
  result: string;
}
export interface IUserInfo {
  games: IUserGame[];
  total: string;
}
export interface IUserGame {
  e?: string;
  index?: string | number;
  date?: string;
  title: string;
  score: number | string;
}
