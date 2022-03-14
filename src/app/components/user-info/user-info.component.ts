import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DataService} from '../../services/data.service';
import {BehaviorSubject} from 'rxjs';
import {IPlayer, IUserGame, IUserInfo} from '../../interfaces/itable';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import * as moment from 'moment';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent implements OnInit{
  user: any = {};
  userId: string;
  userData: IUserInfo = {
    games: undefined,
    total: undefined
  };
  displayedColumns: string[] = [];
  dataSource: MatTableDataSource<IPlayer>;
  asyncData$: BehaviorSubject<any> = new BehaviorSubject('');
  total = 0;
  sortOption = 'desc';
  isActive = {
    topWinning: true,
    notSoWinning: false,
    mostAppearances: false
  };
  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
  ) {
    this.asyncData$.subscribe(val => val ? this.onData(val) : '');
  }

  ngOnInit(): void {
    setTimeout(() => this.setViewVars(), 0);
    this.route.params.subscribe(paramsId => {
      this.userId = paramsId.id;
      this.getUser(this.userId);
    });
  }
  private setViewVars() {
    this.dataService.searchHide = false;
    this.dataService.episodeId = null;
    this.dataService.title = 'Live Poker Tracker';
  }

  private getUser(name: string): void {
    this.dataService.getUserInfo(name).subscribe((data) => {
      console.log(data);
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
    this.total = this.dataService.userScoreCalc(this.userData.total);
    console.log(this.total);
    if (this.userData.games) {
      this.sortTable('date');
    }
  }

  private getTable(data: IUserGame[]) {
    // data.push({
    //   title: 'Total',
    //   score: this.total,
    // });
    // @ts-ignore
    this.dataSource = new MatTableDataSource<IUserGame[]>(data);
    this.displayedColumns = ['date', 'e', 'score'];
    this.setPaginator();
  }

  sortTable(name: string) {
    switch (name) {
      case 'win':
        this.isActive.topWinning = true;
        this.isActive.notSoWinning = false;
        this.sortOption = 'desc';
        this.sortData();
        break;
      case 'date':
        this.isActive.topWinning = true;
        this.isActive.notSoWinning = false;
        this.sortOption = 'date';
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
    const pure = this.userData.games.filter(item => item.title !== 'Total');
    if (this.sortOption === 'asc') {
      pure.sort((a, b) => +a.score - +b.score);
    } else if (this.sortOption === 'desc') {
      pure.sort((a, b) => +b.score - +a.score);
    } else if (this.sortOption === 'date') {
      pure.sort((a, b) => (moment(new Date(b.date)).diff(moment( new Date(a.date)))));
    }
    this.getTable(pure);
  }

  private setPaginator() {
    this.dataSource.paginator = this.paginator;
  }
}
