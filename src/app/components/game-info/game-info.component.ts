import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DataService} from '../../services/data.service';
import {ICompetition, IPlayer} from '../../interfaces/itable';
import {MatTableDataSource} from '@angular/material/table';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';

@Component({
  selector: 'app-game-info',
  templateUrl: './game-info.component.html',
  styleUrls: ['./game-info.component.scss']
})
export class GameInfoComponent implements OnInit {
  displayedColumns: string[] = [];
  dataSource: MatTableDataSource<IPlayer>;
  isActive = {
    topWinning: true,
    notSoWinning: false,
    mostAppearances: false
  };
  sortOption = 'desc';
  youTubeLink: SafeUrl = '';

  set data(value: ICompetition) {
    this._data = value;
  }

  get data() {
    return this._data;
  }

  private _data: ICompetition = {
    e: undefined,
    date: undefined,
    yTitle: undefined,
    yLink: undefined,
    players: [],
    total: undefined,
  };
  iframeHtml: any;


  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private sanitizer: DomSanitizer
  ) {
  }

  ngOnInit(): void {
    setTimeout(() => this.setViewVars(), 0);
    this.route.params.subscribe(paramsId => {
      this.getGameInfo(paramsId.id);
    });
  }
  // tslint:disable-next-line:use-lifecycle-interface
  private setViewVars() {
    this.dataService.searchHide = true;
  }

  private getGameInfo(id: string) {
    this.dataService.getGameInfo(id).subscribe((data) => {
      // console.log(data);
      this.data = data;
      this.drawTable();
      this.getYouTubeLink();
      this.setViewVars();
    });

  }

  private drawTable() {
    const newObj = [];
    this.data.players.forEach((player) => {
      newObj.push({
        player: player.player,
        result: this.dataService.userScoreCalc(String(player.result)),
      });
    });
    this.dataSource = new MatTableDataSource<IPlayer>(newObj);
    this.displayedColumns = ['index', 'player', 'result'];
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
    if (this.sortOption === 'asc') {
      this.data.players.sort((a, b) => this.dataService.userScoreCalc(a.result) - this.dataService.userScoreCalc(b.result));
    } else if (this.sortOption === 'desc') {
      this.data.players.sort((a, b) => this.dataService.userScoreCalc(b.result) - this.dataService.userScoreCalc(a.result));
    }
    this.drawTable();
  }

  private getYouTubeLink() {
    const tempLink = 'https://www.youtube.com/embed/' + this.data.yLink.split('=')[1].split('&')[0] + '?autoplay=1';
    this.youTubeLink = this.sanitizer.bypassSecurityTrustResourceUrl(tempLink || '');
  }
}
