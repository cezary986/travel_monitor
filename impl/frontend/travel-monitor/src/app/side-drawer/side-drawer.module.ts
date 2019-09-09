import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideDrawerComponent } from './side-drawer.component';
import {MatRippleModule} from '@angular/material/core';
import {BottomNavModule} from 'ngx-bottom-nav';
import {MatIconModule} from '@angular/material/icon';

@NgModule({
  declarations: [
    SideDrawerComponent
  ],
  imports: [
    CommonModule,
    MatRippleModule,
    BottomNavModule,
    MatIconModule,
    
  ],
  exports: [
    SideDrawerComponent
  ]
})
export class SideDrawerModule { }
