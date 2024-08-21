import { Component, Input, OnInit, Renderer2 } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Action } from 'rxjs/internal/scheduler/Action';
import { filter } from 'rxjs/operators';
import { text } from 'stream/consumers';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.css'
})
export class NavigationComponent implements OnInit {
  @Input() childComponent: any; 
  @Input() upperLeftChildComponent?: any; 
  @Input() upperRightChildComponent?: any; 


  navigation: any[] = [
    { id: 1, text: "Dashboard", icon: "mediumiconslayout", path: "dashboard" },
    { id: 2, text: "Team", icon: "group", path: "team" },
    { id: 3, text: "All Absences", icon: "box", path: "allAbsences" },
    { id: 4, text: "My Absences", icon: "home", path: "myAbsences" },
    { id: 5, text: "Calendar", icon: "event", path: "calendar" },
    // {id: 6, text: "Close", icon: "chevronleft", path:"dashboard", action: "toggleNavList()"}
  ];

  selectedItemKeys: any[] = [];
  isDrawerOpen: boolean = true;
  theme!: string;

  constructor(private router: Router, private route: ActivatedRoute, private renderer: Renderer2) {}

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateSelectedItem();
    });

    this.updateSelectedItem();
    this.initializeTheme(); 
  }

  initializeTheme() {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      this.theme = storedTheme;
      if(this.theme === 'dark') {
        this.renderer.addClass(document.documentElement, 'dark');
      }
    } else {
      localStorage.setItem('theme', 'light');
    }
    this.changeIcon();
  }

  updateSelectedItem() {
    const currentUrl = this.router.url;
    const selectedItem = this.navigation.find(navItem => currentUrl.includes(navItem.path));
    this.selectedItemKeys = selectedItem ? [selectedItem] : [];
  }

  onSelectionChanged(e: any) {
    this.selectedItemKeys = e.addedItems.map((item: any) => item);
    const selectedPath = e.addedItems[0]?.path;
    if (selectedPath) {
      this.router.navigate([selectedPath]);
    }
  }

  toggleNavList() {
    this.isDrawerOpen= !this.isDrawerOpen;
  }

  navigateToHome(): void {
    this.router.navigate(['/dashboard']); 
  }

    // buttonOptions: any = {
    //     icon: "menu",
    //     onClick: () => {
    //         this.isDrawerOpen = !this.isDrawerOpen;
    //     }
    // }

    changeIcon() {
      this.modeOptions = { ...this.modeOptions, icon: this.theme === "light"? "moon": "sun" }; // Update modeOptions
    }

    modeOptions: any = {
      onClick: () => {
        if(this.theme === 'light') {
          localStorage.setItem('theme', 'dark');
          this.initializeTheme();
          this.renderer.addClass(document.documentElement, 'dark');
          document.body.classList.add('dark');
        } else {
          localStorage.setItem('theme', 'light');
          this.initializeTheme();
          this.renderer.removeClass(document.documentElement, 'dark');
          document.body.classList.remove('dark');
        }
        this.changeIcon();
      }
    }
}
