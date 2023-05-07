import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { DefaultButtonComponent } from '@shared/components/default-button/default-button.component';
import { InputComponent } from '@shared/components/input/input.component';
import { SlapToggleComponent } from '@shared/components/slap-toggle/slap-toggle.component';
import { AuthService } from '@shared/services/auth.service';
import { BehaviorSubject } from 'rxjs';

interface PasswordCriteria {
  minLength: boolean;
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
  specialChar: boolean;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SlapToggleComponent,
    InputComponent,
    DefaultButtonComponent,
  ],
})
export class LoginComponent implements OnInit {
  private toggleOption = new BehaviorSubject<string>('login');
  private passwordCriteria = new BehaviorSubject<PasswordCriteria>({
    minLength: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });

  passwordCriteriaObs$ = this.passwordCriteria.asObservable();
  toggleOptionObs$ = this.toggleOption.asObservable();

  loginForm!: FormGroup;
  signupForm!: FormGroup;

  isSignup = false;

  toggleSlap() {
    this.isSignup = !this.isSignup;
  }

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private toastService: HotToastService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      signupEmail: ['', [Validators.required, Validators.email]],
      signupPassword: ['', Validators.required],
    });
  }

  login(): void {
    // Handle login logic here
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;
    // Perform login action with email and password
    console.log('Login:', email, password);
    this.authService.login(email, password).subscribe(res => {
      // this.toastService.success('Login Successful!')
      this.router.navigate(['dashboard']);
    });
  }

  onPasswordInput(): void {
    const password = this.signupForm.get('signupPassword')?.value;
    const passwordCriteria = {
      minLength: false,
      uppercase: false,
      lowercase: false,
      number: false,
      specialChar: false,
    };
    passwordCriteria.minLength = password.length >= 8;
    passwordCriteria.uppercase = /[A-Z]/.test(password);
    passwordCriteria.lowercase = /[a-z]/.test(password);
    passwordCriteria.number = /[0-9]/.test(password);
    passwordCriteria.specialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    this.passwordCriteria.next(passwordCriteria);
  }

  signup(): void {
    // Handle signup logic here
    const name = this.signupForm.value.name;
    const signupEmail = this.signupForm.value.signupEmail;
    const signupPassword = this.signupForm.value.signupPassword;
    // Perform signup action with signupEmail and signupPassword
    console.log('Signup:', signupEmail, signupPassword);
    this.authService.register(name, signupEmail, signupPassword).subscribe(res => {
      // this.toastService.success('Signup Successful!')
      this.router.navigate(['dashboard']);
    });
  }

  updateToggleOption(option: string): void {
    this.toggleOption.next(option);
  }
}
