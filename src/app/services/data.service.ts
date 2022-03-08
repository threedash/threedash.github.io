import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ICompetition, IGame, IUserInfo} from '../interfaces/itable';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  getData(): Observable<ICompetition[]> {
    return this.httpClient.get<ICompetition[]>('/assets/games.json');
  }

  getPlayersNames(): Observable<string[] | []> {
    return this.httpClient.get<ICompetition[]>('/assets/games.json').pipe(map((data) => {
      const players: string[] = [];
      data.forEach((competition) => {
        competition.game.forEach((game) => {
          if (!players.includes(game.player)) {
            players.push(game.player);
          }
        });
      });
      console.log('players ', players);
      return players;
    }));
  }

  getGameInfo(id: string): Observable<ICompetition | null> {
    return this.httpClient.get<ICompetition[]>('/assets/games.json').pipe(map((data) => {
      return data.find(item => item.e === id) || null;
    }));
  }

  getUserInfo(name: string): Observable<any> {
    const response: IUserInfo = {
      games: undefined,
      total: undefined
    };
    return this.httpClient.get<ICompetition[]>('/assets/games.json').pipe(map((data) => {
      const res = data.filter(item => this.isPlayerInGame(item.game, name));
      if (!res) {
        return [];
      }
      response.games = [];
      res.forEach((item, index) => {
        response.games.push({
          e: item.e,
          title: item.yTitle,
          score: +(item.game.find(val => val.player === name).result),
        });
      });
      const total = response.games.reduce((sum, curr) => {
        return sum += +curr.score;
      }, 0);
      response.total = String(total);
      // console.log('!service response = ', JSON.stringify(response));
      return response;
    }));
  }

  isPlayerInGame(game: IGame[], playerName: string) {
    const res = game.find(item => item.player === playerName);
    return !!res;
  }
}
