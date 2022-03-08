import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserInfoComponent } from './components/user-info/user-info.component';
import { GameInfoComponent } from './components/game-info/game-info.component';
import { ListComponent } from './components/list/list.component';


const routes: Routes = [
  {path: '', component: ListComponent},
  {path: 'user-info', component: ListComponent},
  {path: 'user-info/:id', component: UserInfoComponent},
  {path: 'game-info', component: ListComponent},
  {path: 'game-info/:id', component: GameInfoComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
