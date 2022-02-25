import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {IPlayer} from '../interfaces/itable';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(
    private httpClient: HttpClient
  ) { }

  getData(): Observable<IPlayer[]> {
    return this.httpClient.get<IPlayer[]>('/assets/data.json');
  }
}
