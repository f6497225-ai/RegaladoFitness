import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('token');

    if (!token) {
      // No logueado → redirigir al login
      this.router.navigate(['/phadmin-gr']);
      return false;
    }

    return true; // Sí logueado → continuar
  }
}
