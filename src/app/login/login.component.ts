import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.authService.adminlogin(this.loginForm.value).subscribe(
        () => {
          this.snackBar.open('Login successful!', 'Close', { duration: 3000 });
          this.authService.setAdminLogin(true);
          this.router.navigate(['/dashboard']);
        },
        error => {
          console.log(error)
          this.snackBar.open(error?.error?.message || 'Login failed', 'Close', { duration: 3000 });
          this.isLoading = false;
        }
      );
    }
  }
}
