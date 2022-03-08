import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {DataService} from '../../services/data.service';
import {BehaviorSubject} from 'rxjs';
import {IGame, IUserGame, IUserInfo} from '../../interfaces/itable';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent implements OnInit {
  user: any = {};
  userId: string;
  userData: IUserInfo = {
    games: undefined,
    total: undefined
  };
  displayedColumns: string[] = [];
  dataSource: MatTableDataSource<IGame>;
  asyncData$: BehaviorSubject<any> = new BehaviorSubject('');
  total = 0;
  sortOption = 'desc';
  isActive = {
    topWinning: true,
    notSoWinning: false,
    mostAppearances: false
  };

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
  ) {
    this.asyncData$.subscribe(val => val ? this.onData(val) : '');
  }

  ngOnInit(): void {
    this.route.params.subscribe(paramsId => {
      this.userId = paramsId.id;
      this.getUser(this.userId);
    });
  }

  private getUser(name: string): void {
    this.dataService.getUserInfo(name).subscribe((data) => {
      this.asyncData$.next(data);
    });
  }

  // private initSubscriptions() {
  //   this.subscribtions$.add({
  //     // this.route.params.subscribe(paramsId => {
  //     //   this.userId = paramsId.id;
  //     //   this.getUser(this.userId);
  //     // })
  //   });
  // }
  private onData(val: IUserInfo) {
    this.userData = val;
    this.total = +this.userData.total;
    if (this.userData.games) {
      this.sortTable('win');
    }
  }

  private getTable(data: IUserGame[]) {
    data.push({
      title: 'Total',
      score: this.total,
    });
    // @ts-ignore
    this.dataSource = new MatTableDataSource<IUserGame[]>(data);
    this.displayedColumns = ['index', 'title', 'score'];
  }

  sortTable(name: string) {
    switch (name) {
      case 'win':
        this.isActive.topWinning = true;
        this.isActive.notSoWinning = false;
        this.sortOption = 'desc';
        this.sortData();
        break;
      case 'loose':
        this.isActive.topWinning = false;
        this.isActive.notSoWinning = true;
        this.sortOption = 'asc';
        this.sortData();
        break;
      default:
        break;
    }
  }

  private sortData() {
    console.log('this.userData', this.userData);
    const pure = this.userData.games.filter(item => item.title !== 'Total');
    console.log('pure', pure);
    if (this.sortOption === 'asc') {
      pure.sort((a, b) => +a.score - +b.score);
    } else if (this.sortOption === 'desc') {
      pure.sort((a, b) => +b.score - +a.score);
    }
    // pure
    console.log('this.userData.games ', this.userData.games);
    this.getTable(pure);
  }
}
