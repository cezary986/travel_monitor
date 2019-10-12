import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserListComponent } from './user-list/user-list.component';
import { MatListModule } from '@angular/material/list';

@NgModule({
  declarations: [UserListComponent],
  imports: [
    CommonModule,
    MatListModule
  ],
  exports: [
    UserListComponent
  ]
})
export class UsersModule { }
