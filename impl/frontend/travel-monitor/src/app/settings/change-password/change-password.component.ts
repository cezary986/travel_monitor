import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { SnackbarService } from 'src/app/snackbar/snackbar.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  public form: FormGroup = null;

  constructor(
    public dialogRef: MatDialogRef<ChangePasswordComponent>,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private translate: TranslateService,
    private snackBarService: SnackbarService
  ) {
  }

  ngOnInit() {
    this.createForm();
    this.form.valueChanges.subscribe(val => {
      this.validateBothPasswordsAreTheSame();
    });
  }

  private createForm() {
    this.form = this.formBuilder.group({
      oldPassword: [null, [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      newPassword: [null, [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      newPasswordRepeated: [null, [Validators.required, Validators.minLength(5), Validators.maxLength(100)]]
    });
  }

  private validateBothPasswordsAreTheSame() {
    if (this.form.controls.newPassword.valid && this.form.controls.newPasswordRepeated.valid) {
      if (this.form.value.newPassword === this.form.value.newPasswordRepeated) {
        return;
      } else {
        this.form.setErrors({ passwords_not_the_same: true });
      }
    }
  }

  public onSubmit() {
    if (this.form.valid) {
      this.authService.changePassword(this.form.value.oldPassword, this.form.value.newPassword).subscribe((res) => {
        this.snackBarService.info(this.translate.instant('settings.toasts.success.change_password'));
      }, error => {
        switch (error.status) {
          case 401:
            this.snackBarService.error(this.translate.instant('settings.toasts.error.invalid_password'));
            break;
          default:
            this.snackBarService.error(this.translate.instant('settings.toasts.error.change_password'));
            break;
        }
      }).add((res) => {
        this.dialogRef.close();
      });
    }
  }

  public onDismiss() {
    this.dialogRef.close();
  }
}
