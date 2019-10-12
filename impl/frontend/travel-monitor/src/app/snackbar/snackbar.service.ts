import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarInfoComponent } from './snackbar-info/snackbar-info.component';
import { environment } from 'src/environments/environment';
import { SnackbarErrorComponent } from './snackbar-error/snackbar-error.component';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(
    private snackBar: MatSnackBar
  ) { }

  private open(type: string, message: string) {
    let component: any;
    switch (type) {
      case 'info':
        component = SnackbarInfoComponent;
        break;
      case 'error':
        component = SnackbarErrorComponent;
        break;
    }
    this.snackBar.openFromComponent(component, {
      duration: environment.snackBarDuration,
      data: {
        message: message,
      }
    });
  }

  public info(message: string) {
    this.open('info', message);
  }

  public error(message: string) {
    this.open('error', message);
  }
}
