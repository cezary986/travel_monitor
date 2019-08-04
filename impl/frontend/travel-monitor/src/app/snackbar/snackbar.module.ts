import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { SnackbarInfoComponent } from './snackbar-info/snackbar-info.component';
import { SnackbarErrorComponent } from './snackbar-error/snackbar-error.component';
import { SnackbarSuccessComponent } from './snackbar-success/snackbar-success.component';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [SnackbarInfoComponent, SnackbarErrorComponent, SnackbarSuccessComponent],
  imports: [
    CommonModule,
    MatSnackBarModule,
    MatIconModule
  ],
  entryComponents: [
    SnackbarInfoComponent
  ]
})
export class SnackbarModule { }
