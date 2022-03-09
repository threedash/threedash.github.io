import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DataService} from '../../services/data.service';
import {ICompetition, IGame} from '../../interfaces/itable';
import {MatTableDataSource} from '@angular/material/table';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';

@Component({
  selector: 'app-game-info',
  templateUrl: './game-info.component.html',
  styleUrls: ['./game-info.component.scss']
})
export class GameInfoComponent implements OnInit {
  displayedColumns: string[] = [];
  dataSource: MatTableDataSource<IGame>;
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
    game: [],
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
    this.route.params.subscribe(paramsId => {
      this.getGameInfo(paramsId.id);
    });
  }

  private getGameInfo(id: string) {
    this.dataService.getGameInfo(id).subscribe((data) => {
      console.log(data);
      this.data = data;
      this.drawTable();
      this.getYouTubeLink();
    });

  }

  private drawTable() {
    this.dataSource = new MatTableDataSource<IGame>(this.data.game);
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
      this.data.game.sort((a, b) => +a.result - +b.result);
    } else if (this.sortOption === 'desc') {
      this.data.game.sort((a, b) => +b.result - +a.result);
    }
    this.drawTable();
  }

  private getYouTubeLink() {
    const template = '<iframe id="ytplayer" width="100%" height="360" [src]="youTubeLink"></iframe>';
    const tempLink = 'https://www.youtube.com/embed/' + this.data.yLink.split('=')[1].split('&')[0] + '?autoplay=1';
    this.youTubeLink = this.sanitizer.bypassSecurityTrustResourceUrl(tempLink);
    console.log(this.youTubeLink);
  }
}
