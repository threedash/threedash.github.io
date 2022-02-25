import { Component, OnInit } from '@angular/core';
import {DataService} from '../../services/data.service';
import {IPlayer} from '../../interfaces/itable';
import {Observable, Subject} from 'rxjs';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  data$: IPlayer[];
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
     this.dataSource = new MatTableDataSource<any>(data);
     this.data$ = data;
     this.getDisplayedColumns();
   });
  }
  private getDisplayedColumns() {
    if (this.data$) {
      this.displayedColumns = ['id', 'player'];
      this.data$.forEach((item) => {
        item.result.forEach((res) => {
          if (!this.displayedColumns.includes(res.eventName)) {
            this.displayedColumns.push(res.eventName);
          }
        });
      });
    }
  }

  getScores(row: IPlayer, i, item) {
    if (row[item]){
      return row[item];
    } else {
      const res =  row.result.find((search) => {
        return search.eventName === item;
      });
      return res?.score;
    }


  }
}
