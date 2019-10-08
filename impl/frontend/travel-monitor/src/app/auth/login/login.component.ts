import { Component, OnInit, HostListener } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { select } from '@angular-redux/store';
import { IAppState } from 'src/app/store';
import { Observable } from 'rxjs';
import { ROUTES } from 'src/app/app-routing.module';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  @select((s: IAppState) => s.user.loggedIn) loggedIn: Observable<boolean>;
  loginForm: FormGroup;
  public hasError = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loggedIn.subscribe((loggedIn) => {
      if (loggedIn) {
        this.router.navigate([ROUTES.travelsList.route]);
      }
    });
    this.loginForm = this.formBuilder.group({
      username: ['', [
        Validators.required,
        Validators.maxLength(100)
      ]],
      password: ['', [
        Validators.required,
        Validators.maxLength(100)
      ]],
    })
  }

  public onSubmit() {
    if (this.loginForm.valid) {
      this.hasError = false;
      this.authService.login(
        this.loginForm.value.username,
        this.loginForm.value.password).subscribe((res) => {

        }, error => {
          this.hasError = true;
        });
    }
  }

}
