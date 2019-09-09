import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';
import { UserService } from 'src/app/common/services/user.service';
import { User } from 'src/app/common/models/user';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss']
})
export class UserSettingsComponent implements OnInit {

  public userSettingsForm: FormGroup;
  private user: Observable<User>;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService) {
      this.user = this.userService.getProfile();
      this.user.subscribe((res)=>{console.log(res);
      })
  }

  ngOnInit() {
  }

  private createForm() {
    this.userSettingsForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(200)]],
      first_name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      last_name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    })
  }
}
