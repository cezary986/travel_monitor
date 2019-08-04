import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarInfoComponent } from './snackbar-info/snackbar-info.component';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(
    private _snackBar: MatSnackBar
  ) { }

  public info(message: string) {
    this._snackBar.openFromComponent(SnackbarInfoComponent, {
      // duration: environment.snackBarDuration,
      data: {
        message: message,
      }
    });
  }
}
