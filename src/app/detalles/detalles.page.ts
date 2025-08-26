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

  // ✅ Convierte cualquier unidad a metros y kg
normalizarMedidas(peso: number, altura: number, unidadAltura: string, unidadPeso: string) {
  let pesoKg = Number(peso);
  let alturaM = Number(altura);

  // Peso → kg
  if (unidadPeso === 'lb') {
    pesoKg = pesoKg * 0.453592; // libras a kg
  }

  // Altura → metros
  if (unidadAltura === 'cm') {
    alturaM = alturaM / 100; // cm a m
  } else if (unidadAltura === 'ft') {
    alturaM = alturaM * 0.3048; // pies a m
  }

  return { pesoKg, alturaM };
}

// ✅ Fórmula IMC
calcularIMC(peso: number, altura: number, unidadAltura: string, unidadPeso: string) {
  if (!peso || !altura) return '';
  const { pesoKg, alturaM } = this.normalizarMedidas(peso, altura, unidadAltura, unidadPeso);
  if (alturaM <= 0) return '';
  return +(pesoKg / (alturaM * alturaM)).toFixed(1);
}

// ✅ Nivel de peso según IMC
getNivelPeso(peso: number, altura: number, unidadAltura: string, unidadPeso: string) {
  const imc = this.calcularIMC(peso, altura, unidadAltura, unidadPeso);
  if (!imc) return { texto: '', color: '' };

  if (imc < 18.5) return { texto: 'Bajo peso', color: '#f39c12' };
  if (imc >= 18.5 && imc <= 24.9) return { texto: 'Peso saludable', color: '#27ae60' };
  if (imc >= 25.0 && imc <= 29.9) return { texto: 'Sobrepeso', color: '#f1c40f' };
  if (imc >= 30.0) return { texto: 'Obesidad', color: '#e74c3c' };

  return { texto: '', color: '' };
}

// ✅ Fórmula TMB (Harris-Benedict)
calcularTMB(peso: number, altura: number, unidadAltura: string, unidadPeso: string, edad: number, sexo: 'M' | 'F') {
  const { pesoKg, alturaM } = this.normalizarMedidas(peso, altura, unidadAltura, unidadPeso);
  const alturaCm = alturaM * 100;

  if (sexo === 'M') {
    return +(88.36 + (13.4 * pesoKg) + (4.8 * alturaCm) - (5.7 * edad)).toFixed(1);
  } else {
    return +(447.6 + (9.2 * pesoKg) + (3.1 * alturaCm) - (4.3 * edad)).toFixed(1);
  }
}

// ✅ Ejemplo de % grasa corporal (método YMCA simplificado, hombre)
calcularGrasaYMCA(peso: number, cintura: number, unidadAltura: string, unidadPeso: string) {
  const { pesoKg } = this.normalizarMedidas(peso, 170, unidadAltura, unidadPeso);
  // cintura siempre en cm
  return +(((495 / (1.0324 - 0.19077 * (cintura / 2.54) + 0.15456 * (170 / 2.54))) - 450)).toFixed(1);
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

async eliminarCliente(id: number) {
  if (confirm('¿Seguro que deseas eliminar este cliente? Esta acción no se puede deshacer.')) {
    try {
      await this.apiService.eliminarCliente(id).toPromise();

      const toast = await this.toastController.create({
        message: 'Cliente eliminado correctamente',
        duration: 2000,
        color: 'danger'
      });
      toast.present();

      this.router.navigate(['/admin-panel']); // redirige a la lista de clientes
    } catch (error) {
      console.error('Error eliminando cliente:', error);
      const toast = await this.toastController.create({
        message: 'Error al eliminar el cliente',
        duration: 2000,
        color: 'warning'
      });
      toast.present();
    }
  }
}

}
