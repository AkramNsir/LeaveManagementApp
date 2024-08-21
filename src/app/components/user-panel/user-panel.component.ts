import { Component, HostListener, Input, Renderer2 } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-panel',
  templateUrl: './user-panel.component.html',
  styleUrls: ['./user-panel.component.css']
})
export class UserPanelComponent {
  user: { username: string } = { username: `${this.authService.getUsername()}` }; 
  menuVisible: boolean = false;

  constructor(private authService: AuthService, private router: Router, private renderer: Renderer2){}

  logoutItems = [
    {  icon: 'runner', text: ' Logout', onClick: () => this.authService.logout() }
  ];

  toggleMenu() {
    this.menuVisible = !this.menuVisible;
  }

  handleLogout(event: any) {
    this.authService.logout();
    this.renderer.removeClass(document.documentElement, 'dark');
    this.router.navigate(['/login'])
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-panel-container')) {
      this.menuVisible = false;
    }
  }
  
}
