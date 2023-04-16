import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SlapToggleComponent } from '@shared/components/slap-toggle/slap-toggle.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SlapToggleComponent]
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  signupForm!: FormGroup;
  passwordCriteria = {
    minLength: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false
  };

  isSignup = false;

  toggleSlap() {
    this.isSignup = !this.isSignup;
  }

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.signupForm = this.fb.group({
      signupEmail: ['', [Validators.required, Validators.email]],
      signupPassword: ['', Validators.required]
    });
  }

  login(): void {
    // Handle login logic here
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;
    // Perform login action with email and password
    console.log('Login:', email, password);
  }

  onPasswordInput(): void {
    const password = this.signupForm.get('password')?.value;
    this.passwordCriteria.minLength = password.length >= 8;
    this.passwordCriteria.uppercase = /[A-Z]/.test(password);
    this.passwordCriteria.lowercase = /[a-z]/.test(password);
    this.passwordCriteria.number = /[0-9]/.test(password);
    this.passwordCriteria.specialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  }

  signup(): void {
    // Handle signup logic here
    const signupEmail = this.signupForm.value.signupEmail;
    const signupPassword = this.signupForm.value.signupPassword;
    // Perform signup action with signupEmail and signupPassword
    console.log('Signup:', signupEmail, signupPassword);
  }
}
