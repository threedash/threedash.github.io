import { Component, OnInit } from '@angular/core';
import {ICompetition} from '../../interfaces/itable';
import {DataService} from '../../services/data.service';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-live',
  templateUrl: './live.component.html',
  styleUrls: ['./live.component.scss']
})
export class LiveComponent implements OnInit {
  toShow = 3;

  set data(value: ICompetition[]) {
    this._data = value;
  }

  get data() {
    return this._data;
  }

  private _data: ICompetition[] = [{
    e: undefined,
    date: undefined,
    yTitle: undefined,
    yLink: undefined,
    players: [],
    total: undefined,
  }];
  constructor(
    private dataService: DataService,
    private sanitizer: DomSanitizer,
  ) { }

  ngOnInit(): void {
    setTimeout(() => this.setViewVars(), 0);
    this.getData();

  }
  private setViewVars() {
    this.dataService.searchHide = true;
  }

  private getData() {
    this.dataService.getData().subscribe((newData) => {
      this.data = newData.reverse();
      }
    );
  }

  getYoutubeLink(link: string) {
    const tempLink = 'https://www.youtube.com/embed/' + link.split('=')[1].split('&')[0] + '?autoplay=1';
    return  this.sanitizer.bypassSecurityTrustResourceUrl(tempLink || '');
  }
}
