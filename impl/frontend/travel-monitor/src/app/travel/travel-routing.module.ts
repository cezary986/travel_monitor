import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TravelListComponent } from './travel-list/travel-list.component';

const routes: Routes = [
  {
    path: '',
    component: TravelListComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TravelRoutingModule { }
