import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpandableButtonComponent } from './expandable-button.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  declarations: [
    ExpandableButtonComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule
  ],
  exports: [
    ExpandableButtonComponent
  ]
})
export class ExpandableButtonModule { }
