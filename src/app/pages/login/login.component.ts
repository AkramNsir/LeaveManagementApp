import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  isToggled:boolean = false
  isLoading:boolean = false
  isDisabled:boolean = false
  name: string = ''
  username: string = ''
  password: string = ''
  confirmPassword: string = ''
  message: string = ''
  errorMessage: string = ''
  doneMessage: string = ''
  passwordFieldType: string = 'password';
  confirmPasswordFieldType: string = 'password';

  togglePasswordVisibility() {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  toggleConfirmPasswordVisibility() {
    this.confirmPasswordFieldType = this.confirmPasswordFieldType === 'password' ? 'text' : 'password';
  }
  
  addActiveClass() {
    this.isToggled = true
    this.resetFields()
  }
  removeActiveClass() {
    this.isToggled = false
    this.resetFields()
  }

  resetFields() {
    this.message = ''
    this.doneMessage = ''
    this.errorMessage = ''
    this.name = ''
    this.username = ''
    this.password = ''
    this.confirmPassword = ''
    this.passwordFieldType = 'password';
    this.confirmPasswordFieldType = 'password';
  }

  constructor(private authService: AuthService, private router: Router) {}

  // ngOnInit(): void {
  //   this.authService.logout();
  // }

  login() {
    if( !this.username) {
      this.errorMessage = 'Enter your username'
    } else if(!this.password) {
      this.errorMessage = 'Enter your password'
    } 
    // else if(!this.isValidusername(this.username)) {
    //   this.message = 'Enter a valid username'
    // } 
    else if(this.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters long'
    } else {
      this.errorMessage = ''
      this.isLoading = true
      this.message = 'Logging in ...'
      this.isDisabled = true
      this.authService.login(this.username, this.password)
      .subscribe({
        next: (data) => {
          this.isLoading = false
          this.isDisabled = false
          this.doneMessage = 'Login successful, redirecting...'
          setTimeout(() => {
            this.router.navigate(['/allAbsences']);
          }, 2000); 
        },
        error: (error) => {
          this.isLoading = false; 
          this.isDisabled = false
          this.errorMessage = 'Invalid credentials. Try again'
          console.error('Login failed', error);
          // alert('Login failed');
        },
        complete: () => {
          this.isLoading = false; 
          this.isDisabled = false
          console.log('Login request completed.');
        }
      });
    }
    
  }
  

  registerr() {
    this.isLoading = true;
    this.message = 'Registering...';
    this.authService.registerr(this.username, this.password)
      .subscribe({
        next: (data) => {
          this.isLoading = false; 
          this.message = 'Registration successful, redirecting to login...';
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1500); 
        },
        error: (error) => {
          this.isLoading = false; 
          this.message = 'Registration failed. Please try again.';
        },
        complete: () => {
          this.isLoading = false; 
          console.log('Registration request completed.');
        }
      });
  }

  register(): void {
    if(!this.name) {
      this.errorMessage = 'Enter your name'
    } else if( !this.username) {
      this.errorMessage = 'Enter your username'
    }
    //  else if(!this.isValidusername(this.username)) {
    //   this.errorMessage = 'Enter a valid username'
    // }
    else if(!this.password) {
      this.errorMessage = 'Enter your password'
    } else if(!this.confirmPassword) {
      this.errorMessage = 'Confirm your password'
    } else if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match'
      return
    } else if (this.authService.register(this.name, this.username, this.password)) {
      this.errorMessage = ''
      this.doneMessage = 'Account created successfully !'    
      setTimeout(() => {
        this.isToggled = false
        this.doneMessage = ''
      }, 2500);
      
    } else {
      this.errorMessage = 'username already exists'
    }
  }

  goResetPassword() {
    this.router.navigate(['resetPassword'])
    this.resetFields();
  }

  // isValidusername(username: string): boolean {
  //   const usernamePattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  //   return usernamePattern.test(username);
  // }
}
