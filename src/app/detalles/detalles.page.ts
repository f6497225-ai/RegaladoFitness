import { Component, Input, input } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-detalles',
  templateUrl: './detalles.page.html',
  styleUrls: ['./detalles.page.scss'],
  standalone: false
})
export class DetallesPage  {
cliente: any; // Cliente recibido desde la página anterior
  activeTab: string = 'personal';

  // Para zoom
  imagenZoom: string | null = null;

  constructor(private location: Location, private router: Router) {}

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state?.['cliente']) {
      this.cliente = navigation.extras.state['cliente'];

      // Creamos objeto fotos para que el HTML funcione
      this.cliente.fotos = {
        frente: this.cliente.foto_frente || null,
        espalda: this.cliente.foto_espalda || null,
        izquierda: this.cliente.foto_izquierda || null,
        derecha: this.cliente.foto_derecha || null
      };
    }
  }

  volver() {
    this.location.back();
  }

  calcularEdad(fechaNacimiento: string) {
    if (!fechaNacimiento) return '';
    const nacimiento = new Date(fechaNacimiento);
    const ahora = new Date();
    let edad = ahora.getFullYear() - nacimiento.getFullYear();
    const m = ahora.getMonth() - nacimiento.getMonth();
    if (m < 0 || (m === 0 && ahora.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  }

  calcularIMC(peso: number, altura: number, unidadAltura: string, unidadPeso: string) {
    if (!peso || !altura) return '';
    let pesoKg = Number(peso);
    let alturaM = Number(altura);

    // Convertir unidades
    if (unidadPeso === 'lb') pesoKg *= 0.453592;
    if (unidadAltura === 'cm') alturaM /= 100;

    if (alturaM <= 0) return '';
    return +(pesoKg / (alturaM * alturaM)).toFixed(1);
  }
  getNivelPeso(peso: number, altura: number, unidadAltura: string, unidadPeso: string) {
  const imc = this.calcularIMC(peso, altura, unidadAltura, unidadPeso);
  if (!imc) return { texto: '', color: '' };

  if (imc < 18.5) return { texto: 'Bajo peso', color: '#f39c12' }; // naranja
  if (imc >= 18.5 && imc <= 24.9) return { texto: 'Peso saludable', color: '#27ae60' }; // verde
  if (imc >= 25.0 && imc <= 29.9) return { texto: 'Sobrepeso', color: '#f1c40f' }; // amarillo
  if (imc >= 30.0) return { texto: 'Obesidad', color: '#e74c3c' }; // rojo

  return { texto: '', color: '' };
}


  // Zoom en imagen
  abrirZoom(imagenUrl: string) {
    this.imagenZoom = imagenUrl;
  }

  cerrarZoom() {
    this.imagenZoom = null;
  }
}
