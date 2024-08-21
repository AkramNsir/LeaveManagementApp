import { Component, Renderer2, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.css'
})
export class NotFoundComponent implements OnInit {


  constructor(private router: Router, private renderer: Renderer2){}

  ngOnInit(): void {
    this.initializeTheme();
  }

  goHome() {
    this.router.navigate(['/dashboard']);
  }

  initializeTheme() {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      if(storedTheme === 'dark') {
        this.renderer.addClass(document.documentElement, 'dark');
      }
    }
  }
}
