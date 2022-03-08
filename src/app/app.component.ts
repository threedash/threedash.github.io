import {Component, OnDestroy, OnInit} from '@angular/core';
import {DataService} from './services/data.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Observable, Subject} from 'rxjs';
import {map, startWith, takeUntil} from 'rxjs/operators';
import {MatOptionSelectionChange} from '@angular/material/core';
import {Router} from '@angular/router';

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

  constructor(
    private dataService: DataService,
    private fb: FormBuilder,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.initForm();
    this.initSubscription();
    this.getPlayersNames();
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

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  private getPlayersNames() {
    this.dataService.getPlayersNames().subscribe(data => this.options = [...data]);
  }

  getUser($event: MatOptionSelectionChange) {
    console.log($event);
    this.router.navigate(['/user-info', $event.source.value]).then();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
