import {Component, OnDestroy, OnInit} from '@angular/core';
import {DataService} from './services/data.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Observable, Subject} from 'rxjs';
import {map, startWith, takeUntil} from 'rxjs/operators';
import {MatOptionSelectionChange} from '@angular/material/core';
import {ActivatedRoute, Router} from '@angular/router';
import { Location } from '@angular/common';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'poker-hustler';
  form: FormGroup = new FormGroup({});
  options: string[] = [];
  filteredOptions: Observable<string[]>;
  private destroy$ = new Subject();
  mode = 'dark mode';

  constructor(
    public dataService: DataService,
    private fb: FormBuilder,
    public router: Router,
  ) {
  }

  ngOnInit() {
    this.getUrl();
    this.initForm();
    this.initSubscription();
    this.getPlayersNames();
    this.setDarkMode(localStorage.darkMode);
  }

  private initForm() {
    this.form = this.fb.group({
      search: undefined
    });
  }

  private initSubscription() {
    this.filteredOptions = this.form.get('search').valueChanges.pipe(
      takeUntil(this.destroy$),
      startWith(''),
      map(val => this._filter(val)),
    );
  }
  private getUrl() {
    const button = document.getElementById('#liveLink');
    this.router.events.subscribe((val) => {
      if (!this.router.url.includes('/live')){
        button.className = 'title';
        this.dataService.searchHide = false;
      } else {
        button.className = 'active';
        this.dataService.searchHide = true;
      }
    });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  private getPlayersNames() {
    this.dataService.getPlayersNames().subscribe(data => this.options = [...data]);
  }

  getUser($event: MatOptionSelectionChange) {
    // console.log($event);
    this.router.navigate(['/user-info', $event.source.value]).then();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }


  setDarkMode(mode?: string) {
    // const container = document.getElementsByTagName('mat-card')[0];
    const container = document.body;
    if (!mode) {
      mode = localStorage.darkMode === 'true' ? 'false' : 'true';
    }
    localStorage.darkMode = mode;
    if (mode === 'true') {
      container.className += ' dark';
      this.mode = 'bright mode';
    } else {
      container.className = container.className.replace('dark', '');
      this.mode = 'dark mode';

    }
  }

  routerLive(url: string) {
    if (url.includes('/live')){
      this.router.navigate(['/']).then();
    } else {
      this.router.navigate(['/live']).then();
    }
  }


}
