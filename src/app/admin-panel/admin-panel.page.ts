import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DetallesPage } from '../detalles/detalles.page';
import { Router } from '@angular/router';


@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.page.html',
  styleUrls: ['./admin-panel.page.scss'],
  standalone: false
})
export class AdminPanelPage  {

  
  filtros = {
    estado: '',
    modalidad: '',
    nombre: ''
  };

clientes = [
  {
    nombre: "María González",
    email: "maria.gonzalez@email.com",
    edad: 28,
    servicio: "Entrenamiento Personal",
    modalidad: "Presencial",
    imc: 22.5,
    estado: "Pendiente",
    peso: "65 kg",
    altura: "1.70 m",
    condiciones: "Ninguna",
    fotos: [
      "assets/IMG/foto1.jpg",
      "assets/IMG/foto2.jpg",
      "assets/IMG/foto3.jpg",
      "assets/IMG/foto4.jpg"
    ]
  },
  
  {
    nombre: "Pedro Ramírez",
    email: "pedro.ramirez@email.com",
    edad: 35,
    servicio: "Crossfit",
    modalidad: "Online",
    imc: 27.1,
    estado: "Aprobado",
    peso: "80 kg",
    altura: "1.80 m",
    condiciones: "Asma leve",
    fotos: [
      "assets/IMG/foto5.jpg",
      "assets/IMG/foto6.jpg"
    ]
  }
];
clientesFiltrados = [...this.clientes];

constructor(private router: Router) {}

verDetalles(cliente: any) {
  this.router.navigate(['/detalles'], { state: { cliente: cliente } });
}

  getIniciales(nombre: string) {
    return nombre.split(' ').map(n => n[0]).join('').toUpperCase();
  }
aplicarFiltros() {
  this.clientesFiltrados = this.clientes.filter(c => {
    const coincideEstado = this.filtros.estado ? c.estado === this.filtros.estado : true;
    const coincideModalidad = this.filtros.modalidad ? c.modalidad === this.filtros.modalidad : true;
    const coincideNombre = this.filtros.nombre ? c.nombre.toLowerCase().includes(this.filtros.nombre.toLowerCase()) : true;

    return coincideEstado && coincideModalidad && coincideNombre;
  });
}
limpiarFiltros() {
  this.filtros = { estado: '', modalidad: '', nombre: '' };
  this.clientesFiltrados = [...this.clientes];
}

logout() {
  localStorage.removeItem('token');
  this.router.navigate(['/phadmin-gr']);
}

  irADetalles() {
    this.router.navigate(['/detalles']); // ← Ruta de la otra página
  }

}
