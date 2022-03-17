import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserInfoComponent } from './components/user-info/user-info.component';
import { GameInfoComponent } from './components/game-info/game-info.component';
import { ListComponent } from './components/list/list.component';
import {LiveComponent} from './components/live/live.component';


const routes: Routes = [
  {path: '', component: ListComponent},
  {path: 'user-info', component: ListComponent},
  {path: 'user-info/:id', component: UserInfoComponent},
  {path: 'game-info', component: ListComponent},
  {path: 'game-info/:id', component: GameInfoComponent},
  {path: 'live', component: LiveComponent},
  {path: 'live/:id', component: GameInfoComponent},
  {path: '*', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
