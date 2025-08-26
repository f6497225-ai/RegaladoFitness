import { Component, ViewChild, ElementRef } from '@angular/core';
import { ApiService } from 'src/service/api';
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
  errorMessage = '';
  successMessage = '';
  loading = false;

  constructor(private api: ApiService, private router: Router) {}


  login() {
    if (!this.username || !this.password) return;

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.api.loginAdmin({ usernameOrEmail: this.username, password: this.password })
      .subscribe({
        next: (res) => {
          this.loading = false;
          this.successMessage = 'Inicio de sesión exitoso';
          localStorage.setItem('token', res.token);
          this.router.navigate(['/admin-panel']);
        },
        error: (err) => {
          this.loading = false;
          if (err.status === 401) {
            this.errorMessage = 'Usuario o contraseña incorrecta';
          } else if (err.status === 0) {
            this.errorMessage = 'No se pudo conectar con el servidor';
          } else {
            this.errorMessage = 'Ocurrió un error, intenta nuevamente';
          }
        }
      });
  }

  
}
