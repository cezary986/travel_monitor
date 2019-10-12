import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { UserService } from 'src/app/common/services/user.service';
import { User } from 'src/app/common/models/user';
import { Observable } from 'rxjs';
import { select, NgRedux } from '@angular-redux/store';
import { IAppState } from 'src/app/store';
import { MatDialog } from '@angular/material/dialog';
import { ChangePasswordComponent } from '../change-password/change-password.component';
import { SET_USER } from 'src/app/common/store/user/actions';
import { SnackbarService } from 'src/app/snackbar/snackbar.service';
import { TranslateService } from '@ngx-translate/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss']
})
export class UserSettingsComponent implements OnInit {

  public userSettingsForm: FormGroup = null;
  @select((s: IAppState) => s.user.profile) user: Observable<User>;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    public dialog: MatDialog,
    private redux: NgRedux<IAppState>,
    private snackbarService: SnackbarService,
    private translate: TranslateService,
    private location: Location) {
  }

  ngOnInit() {
    this.createForm();
  }

  private createForm() {
    this.user.subscribe((user) => {
      if (user !== null) {
        this.userSettingsForm = this.formBuilder.group({
          username: [user.username, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
          email: [user.email, [Validators.email, Validators.maxLength(200)]],
          first_name: [user.first_name, [Validators.minLength(3), Validators.maxLength(100)]],
          last_name: [user.last_name, [Validators.minLength(3), Validators.maxLength(100)]],
        });
      }
    });
  }

  public openChangePasswordDialog() {
    this.dialog.open(ChangePasswordComponent);
  }

  private prepareUpdatedProfile(): User {
    const currentProfile = this.redux.getState().user.profile;
    return {
      id: currentProfile.id,
      is_superuser: currentProfile.is_superuser,
      username: this.userSettingsForm.value.username,
      first_name: this.userSettingsForm.value.first_name,
      last_name: this.userSettingsForm.value.last_name,
      email: this.userSettingsForm.value.email,
      avatar: currentProfile.avatar
    };
  }

  public onSubmit() {
    this.userService.updateProfile(this.prepareUpdatedProfile()).subscribe(profile => {
      this.redux.dispatch({ type: SET_USER, payload: profile });
      this.snackbarService.info(this.translate.instant('settings.toasts.success.settings_saved'));
    }, error => {
      this.snackbarService.error(this.translate.instant('settings.toasts.error.failed_to_save'));
    });
  }

  public onDismiss() {
    this.location.back();
  }
}
