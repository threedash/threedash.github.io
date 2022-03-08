import { Component, OnInit } from '@angular/core';
import {DataService} from '../../services/data.service';
import {ICompetition} from '../../interfaces/itable';
import {Observable, Subject} from 'rxjs';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  data: ICompetition[];
  displayedColumns: string[] = [];
  dataSource: MatTableDataSource<IPlayer[]>;

  constructor(
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    this.getData();
  }

  private getData() {
    this.dataService.getData().subscribe((data) => {
      data.forEach((ep) => {
        ep.game.forEach((game) => {
          if (!this.players[game.player]) {
            this.players[game.player] = {
              result: game.result,
              count: 1
            };
          } else {
            this.players[game.player].result += game.result;
            this.players[game.player].count += 1;
          }
        });
      });

      this.sortData();
      this.data = data;
      this.getDisplayedColumns();
    });
  }
  private getDisplayedColumns() {
    if (this.data) {
      this.displayedColumns = ['index', 'name', 'result'];
    }
  }

  sortTable(name: string) {
    switch (name) {
      case 'win':
        this.isActive.topWinning = true;
        this.isActive.notSoWinning = false;
        this.isActive.mostAppearances = false;
        this.sortOption = 'desc';
        this.sortData();
        break;
      case 'loose':
        this.isActive.topWinning = false;
        this.isActive.notSoWinning = true;
        this.isActive.mostAppearances = false;
        this.sortOption = 'asc';
        this.sortData();
        break;
      case 'appearance':
        this.isActive.topWinning = false;
        this.isActive.notSoWinning = false;
        this.isActive.mostAppearances = true;
        this.sortOption = 'count';
        this.sortData();
        break;
      default:
        break;
    }
  }
}
