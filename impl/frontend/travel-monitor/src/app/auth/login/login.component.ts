import { Component, OnInit, HostListener } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  public hasError: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.authService.listenToLoginStatus().subscribe((loggedIn) => {
      if (loggedIn) {
        this.router.navigate(['travels']);
      }
    })
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
