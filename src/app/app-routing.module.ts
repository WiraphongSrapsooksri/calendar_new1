import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DayViewComponent } from './day-view/day-view.component';
import { WeekViewComponent } from './week-view/week-view.component';

const routes: Routes = [
  { path: 'week-view', component: WeekViewComponent },
  { path: 'day-view', component: DayViewComponent },
  { path: '', redirectTo: '/week-view', pathMatch: 'full' }, // default route
  { path: '**', redirectTo: '/week-view' } // wildcard route
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
