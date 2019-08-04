import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import {MatRippleModule} from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { TravelListComponent } from './travel-list/travel-list.component';
import { TravelAddComponent } from './travel-add/travel-add.component';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatMenuModule} from '@angular/material/menu';
import { TravelListElementComponent } from './travel-list-element/travel-list-element.component';
import { TravelRoutingModule } from './travel-routing.module';
import { MatIconModule } from '@angular/material/icon';
import { ExpandableButtonModule } from '../common/expandable-button/expandable-button.module';

@NgModule({
  declarations: [
    TravelListComponent,
    TravelAddComponent,
    TravelListElementComponent
  ],
  imports: [
    CommonModule,
    TravelRoutingModule,
    ExpandableButtonModule,
    MatCardModule,
    MatRippleModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatMenuModule,
    MatIconModule,
    FormsModule
  ],
  exports: [
    TravelListComponent
  ]
})
export class TravelModule { }
