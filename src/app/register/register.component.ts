import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      role: ['admin'],
      auth_provider: ['manual'],
      is_verified: [true]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.authService.register(this.registerForm.value).subscribe(
        () => {
          this.snackBar.open('Registration successful! Welcome aboard!', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          this.authService.setAdminLogin(true);
          this.router.navigate(['/dashboard']);
        },
        error => {
          this.snackBar.open(error.error.message || 'Registration failed. Please try again.', 'Close', { 
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          this.isLoading = false;
        }
      );
    } else {
      this.markFormGroupTouched(this.registerForm);
      this.snackBar.open('Please fill in all required fields correctly', 'Close', { 
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }
}