import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DataService} from '../../services/data.service';
import {ICompetition, IGame} from '../../interfaces/itable';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-game-info',
  templateUrl: './game-info.component.html',
  styleUrls: ['./game-info.component.scss']
})
export class GameInfoComponent implements OnInit {
  displayedColumns: string[] = [];
  dataSource: MatTableDataSource<IGame>;
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


  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
  ) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(paramsId => {
      this.getGameInfo(paramsId.id);
    });
  }

  private getGameInfo(id: string) {
    this.dataService.getGameInfo(id).subscribe((data) => {
      this.data = data;
      this.getTable();
    });

  }

  private getTable() {
    this.dataSource = new MatTableDataSource<IGame>(this.data.game);
    this.displayedColumns = ['index', 'player', 'result'];
  }
}
