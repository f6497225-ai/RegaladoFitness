import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DetallesPage } from '../detalles/detalles.page';


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

  constructor(private modalCtrl: ModalController) {}

  // Modal detalles
  async verDetalles(cliente: any) {
    const modal = await this.modalCtrl.create({
      component: DetallesPage,
      componentProps: { cliente }
    });
    await modal.present();
  }

  // Aprobar cliente
  aprobarCliente(index: number) {
    this.clientes[index].estado = "aprobado";
  }

  // Rechazar cliente
  rechazarCliente(index: number) {
    this.clientes[index].estado = "rechazado";
  }

  // Devuelve color según estado
  getColorEstado(estado: string) {
    switch(estado) {
      case 'pendiente': return 'warning';
      case 'aprobado': return 'success';
      case 'rechazado': return 'danger';
      default: return 'medium';
    }
  }

  // Iniciales para avatar
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
}
