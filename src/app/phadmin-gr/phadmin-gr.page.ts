import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-phadmin-gr',
  templateUrl: './phadmin-gr.page.html',
  styleUrls: ['./phadmin-gr.page.scss'],
  standalone: false
})
export class PhadminGRPage  {
  username = '';
  password = '';

  constructor(private router: Router) {}

  login() {
    // Simulación: validar usuario
    if (this.username === 'admin' && this.password === '1234') {
      // Guardamos un token en localStorage
      localStorage.setItem('token', 'fake-jwt-token-1234');
      this.router.navigate(['/admin-panel']);
    } else {
      alert('Credenciales incorrectas');
    }
  }
}
