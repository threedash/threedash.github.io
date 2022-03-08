export interface ICompetition {
  e: string;
  date: string;
  yTitle: string;
  yLink: string;
  game: IGame[];
  total: number;
}
export interface IGame {
  index?: string | number;
  player: string;
  result: number;
}
export interface IUserInfo {
  games: IUserGame[];
  total: string;
}
export interface IUserGame {
  e?: string;
  index?: string | number;
  title: string;
  score: number | string;
}
