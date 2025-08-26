import { Component, Input, input } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../service/api';
import { Location } from '@angular/common';
import { ToastController } from '@ionic/angular';

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

  constructor(private location: Location, private router: Router, private toastController: ToastController, private apiService: ApiService,) {}

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

actualizarEstado(nuevoEstado: string) {
  if (!this.cliente?.id) return;

  this.apiService.actualizarEstado(this.cliente.id, nuevoEstado).subscribe({
    next: async () => {
      // Actualizar solo si la DB respondió bien
      this.cliente.estado = nuevoEstado;

      const toast = await this.toastController.create({
        message: `Estado actualizado a "${nuevoEstado}"`,
        duration: 2000,
        color: 'success'
      });
      toast.present();

      if (nuevoEstado === 'aceptada') this.enviarWhatsApp(this.cliente);
    },
    error: async (err) => {
      console.error(err);
      const toast = await this.toastController.create({
        message: 'Error al actualizar el estado',
        duration: 2000,
        color: 'danger'
      });
      toast.present();
    }
  });
}


enviarWhatsApp(cliente: any) {
  if (!cliente.telefono) {
    console.error('Teléfono del cliente vacío');
    return;
  }

  const mensaje = `
Estimado/a ${cliente.nombre},

Nos complace informarte que tu solicitud en Regalado Fitness ha sido aceptada.

Costo del servicio: ${cliente.monto || 'ND'}

Para tu comodidad, puedes realizar el depósito utilizando los siguientes datos:
Banco: Banco XYZ
Tipo de cuenta: Cuenta Corriente
Número de cuenta: 1234567890
Titular: Regalado Fitness

Agradecemos tu confianza y esperamos verte pronto.
`;

  const url = `https://wa.me/${cliente.telefono}?text=${encodeURIComponent(mensaje)}`;
  window.open(url, '_blank');
}

}
