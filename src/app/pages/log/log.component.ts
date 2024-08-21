import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrl: './log.component.css'
})
export class LogComponent {
  isToggled:boolean = false
  message: string = ''

  formDataLogin = {
    email: '',
    password: ''
  };

  formDataRegister = {
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  };
  
  addActiveClass() {
    this.isToggled = true
    this.message = ''
    this.formDataLogin.email = ''
    this.formDataLogin.password = ''
  }
  removeActiveClass() {
    this.isToggled = false
    this.message = ''
    this.formDataRegister.name = ''
    this.formDataRegister.email = ''
    this.formDataRegister.password = ''
    this.formDataRegister.confirmPassword = ''
  }

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    if( !this.formDataLogin.email) {
      this.message = 'Enter your email'
    } else if(!this.formDataLogin.password) {
      this.message = 'Enter your password'
    } else if (this.authService.login(this.formDataLogin.email, this.formDataLogin.password)) {
      this.router.navigate(['/home']); // Navigate to home or protected route after login
      this.message = ''
      // alert('login ok')
    } else {
      this.message = 'Invalid credentials'
    }
  }

  register(): void {
    if(!this.formDataRegister.name) {
      this.message = 'Enter your name'
    } else if( !this.formDataRegister.email) {
      this.message = 'Enter your email'
    } else if(!this.isValidEmail(this.formDataRegister.email)) {
      this.message = 'Enter a valid email'
    }else if(!this.formDataRegister.password) {
      this.message = 'Enter your password'
    } else if(!this.formDataRegister.confirmPassword) {
      this.message = 'Confirm your password'
    } else if (this.formDataRegister.password !== this.formDataRegister.confirmPassword) {
      this.message = 'Passwords do not match'
      return
    } else if (this.authService.register(this.formDataRegister.name, this.formDataRegister.email, this.formDataRegister.password)) {
      this.router.navigate(['/login']) // Navigate to home or protected route after registration
      this.isToggled = false
      this.message = ''
      
    } else {
      this.message = 'Email already exists'
    }
  }

  isValidEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  }
}
