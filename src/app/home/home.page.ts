import { Component, ElementRef, HostListener } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  menuOpen = false;

  constructor(private eRef: ElementRef) {}

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  scrollTo(section: string) {
    const el = document.getElementById(section);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    this.menuOpen = false; // cerrar al hacer clic en un enlace
  }

  // Detecta clic fuera del menú y lo cierra
  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event) {
    if (this.menuOpen && !this.eRef.nativeElement.contains(event.target)) {
      this.menuOpen = false;
    }
  }
}
