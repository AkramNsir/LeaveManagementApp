import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {
  isToggled:boolean = false
  email: string = ''
  newPassword: string = ''
  confirmPassword: string = ''
  message: string = ''
  doneMessage: string = ''
  
  addActiveClass() {
    this.isToggled = true
    this.message = ''
  }
  removeActiveClass() {
    this.isToggled = false
    this.message = ''
    this.newPassword = ''
    this.confirmPassword = ''
  }

  constructor(private authService: AuthService, private router: Router) {}

  continue(): void {
    if( !this.email) {
      this.message = 'Enter your email'
    } else if(!this.isValidEmail(this.email)) {
      this.message = 'Enter a valid email'
    } else if(this.authService.existingEmail(this.email)){
      this.addActiveClass()
      this.message = ''
    } else {
      this.message = "Email dosen't exist"
    }
  }

  change(): void {
    if(!this.newPassword) {
      this.message = 'Enter your new password'
    } else if(!this.confirmPassword) {
      this.message = 'Confirm your password'
    } else if (this.newPassword !== this.confirmPassword) {
      this.message = 'Passwords do not match'
      return
    } else if (this.authService.update(this.email, this.newPassword)) {
      this.message = ''  
      this.doneMessage = 'Password changed successfully !'    
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2500);
    } 
  }

  goBack() {
    this.removeActiveClass()
  }

  goBackLogin() {
    this.router.navigate(['login'])
  }

  isValidEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  }
}
