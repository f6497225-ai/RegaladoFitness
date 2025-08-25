import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../service/api';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';


@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.page.html',
  styleUrls: ['./admin-panel.page.scss'],
  standalone: false
})
export class AdminPanelPage  {
pageSize: number = 10; // registros por página
currentPage: number = 1;
totalPages: number = 1;
clientesPaginados: any[] = [];
clientes: any[] = [];
  clientesFiltrados: any[] = [];
  filtros = { nombre: '' };

  solicitudesNuevas: number = 0;
  totalSolicitudes: number = 0;

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit() {
    this.cargarClientes();
  }

cargarClientes() {
  this.api.obtenerClientes().subscribe({
    next: (res: any[]) => {
      const ahora = new Date().getTime();

      this.clientes = res.map(c => {
        // --- IMC ---
        let alturaM = Number(c.altura);
        if (c.alturaUnidad === 'cm') alturaM = alturaM / 100;

        let pesoKg = Number(c.peso);
        if (c.pesoUnidad === 'lb') pesoKg = pesoKg * 0.453592;

        const imc = alturaM > 0 ? +(pesoKg / (alturaM * alturaM)).toFixed(1) : null;

        // --- Edad ---
        const fechaNacimiento = new Date(c.fecha_nacimiento);
        const edad = !isNaN(fechaNacimiento.getTime())
          ? new Date().getFullYear() - fechaNacimiento.getFullYear()
          : null;

        // --- Fecha de registro ---
        const fechaRegistro = new Date(c.fecha_registro);
        const horasDesdeRegistro = !isNaN(fechaRegistro.getTime())
          ? (ahora - fechaRegistro.getTime()) / 1000 / 60 / 60
          : 9999;
        const esNueva = horasDesdeRegistro <= 2;

        return { ...c, imc, edad, fechaRegistro, esNueva };
      });

      // Ordenar de más nueva a más vieja
      this.clientes.sort((a, b) => b.fechaRegistro.getTime() - a.fechaRegistro.getTime());

      this.clientesFiltrados = [...this.clientes];

      // --- Estadísticas ---
      this.totalSolicitudes = this.clientes.length;
      this.solicitudesNuevas = this.clientes.filter(c => c.esNueva).length;

      // --- Paginación ---
      this.totalPages = Math.ceil(this.clientesFiltrados.length / this.pageSize);
      this.currentPage = 1;
      this.actualizarPaginacion();
    },
    error: err => console.error('Error al cargar clientes', err)
  });
}
actualizarPaginacion() {
  const start = (this.currentPage - 1) * this.pageSize;
  const end = start + this.pageSize;
  this.clientesPaginados = this.clientesFiltrados.slice(start, end);
}

// Navegar a página anterior
paginaAnterior() {
  if (this.currentPage > 1) {
    this.currentPage--;
    this.actualizarPaginacion();
  }
}

// Navegar a página siguiente
paginaSiguiente() {
  if (this.currentPage < this.totalPages) {
    this.currentPage++;
    this.actualizarPaginacion();
  }
}


  // Navegar a la página de detalles
  verDetalles(cliente: any) {
    this.router.navigate(['/detalles'], { state: { cliente } });
  }

  // Iniciales del nombre
  getIniciales(nombre: string) {
    return nombre.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  // Filtros
aplicarFiltros() {
  this.clientesFiltrados = this.clientes.filter(c => {
    const coincideNombre = this.filtros.nombre
      ? c.nombre.toLowerCase().includes(this.filtros.nombre.toLowerCase())
      : true;
    return coincideNombre;
  });

  // Reiniciar la paginación al aplicar filtro
  this.currentPage = 1;
  this.totalPages = Math.ceil(this.clientesFiltrados.length / this.pageSize);
  this.actualizarPaginacion();
}
limpiarFiltros() {
  this.filtros = { nombre: '' };
  this.clientesFiltrados = [...this.clientes];

  // Reiniciar paginación
  this.currentPage = 1;
  this.totalPages = Math.ceil(this.clientesFiltrados.length / this.pageSize);
  this.actualizarPaginacion();
}

  // Logout
  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/phadmin-gr']);
  }

exportarExcel() {
  // Usamos todos los clientes filtrados
  const datos = this.clientesFiltrados.map(c => ({
    ID: c.id,
    Nombre: c.nombre,
    Correo: c.correo,
    Teléfono: c.telefono,
    'Fecha de Nacimiento': c.fecha_nacimiento,
    Altura: c.altura,
    'Unidad de Altura': c.altura_unidad,
    Peso: c.peso,
    'Unidad de Peso': c.peso_unidad,
    Enfermedades: c.enfermedades,
    Incapacidades: c.incapacidades,
    Modalidad: c.modalidad
  }));

  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(datos);
  const workbook: XLSX.WorkBook = { Sheets: { 'Clientes': worksheet }, SheetNames: ['Clientes'] };
  const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const data: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
  saveAs(data, 'clientesRGFitnes.xlsx');
}

}
