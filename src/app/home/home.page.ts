import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  menuOpen = false;

  constructor() {}
  
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
  scrollTo(section: string) {
  const el = document.getElementById(section);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
}
