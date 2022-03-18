import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ICompetition, IPlayer, IUserInfo} from '../interfaces/itable';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  public searchHide = false;

  constructor(
    private httpClient: HttpClient,
  ) {
  }

  public userScoreCalc(str: string): number {
    if (!str) { return 0; }
    const data = str.replace('$', '').split(',');
    if (data[1]) {
      return +(data[0] + data[1]);
    } else {
      return +(str.replace('$', '')) ?? 0 ;
    }
  }

  getData(): Observable<ICompetition[]> {
    return this.httpClient.get<ICompetition[]>('/assets/games_new.json');
  }

  getPlayersNames(): Observable<string[] | []> {
    return this.httpClient.get<ICompetition[]>('/assets/games_new.json').pipe(map((data) => {
      const players: string[] = [];
      data.forEach((competition) => {
        competition.players.forEach((game) => {
          if (!players.includes(game.player)) {
            players.push(game.player);
          }
        });
      });
      return players;
    }));
  }

  getGameInfo(id: string): Observable<ICompetition | null> {
    return this.httpClient.get<ICompetition[]>('/assets/games_new.json').pipe(map((data) => {
      return data.find(item => item.e === id) || null;
    }));
  }

  getUserInfo(name: string): Observable<any> {
    const response: IUserInfo = {
      games: undefined,
      total: undefined
    };
    return this.httpClient.get<ICompetition[]>('/assets/games_new.json').pipe(map((data) => {
      const res = data.filter(item => this.isPlayerInGame(item.players, name));
      if (!res) {
        return [];
      }
      response.games = [];
      res.forEach((item, index) => {
        response.games.push({
          e: item.e,
          title: item.yTitle,
          date: item.date,
          score: this.userScoreCalc((item.players.find(val => val.player === name).result)) || 0,
        });
      });
      const total = response.games.reduce((sum, curr) => {
        return sum += +curr.score;
      }, 0);
      response.total = String(total);
      return response;
    }));
  }

  isPlayerInGame(game: IPlayer[], playerName: string) {
    const res = game.find(item => item.player === playerName);
    return !!res;
  }
}
