import { Component, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ApiService } from '../../service/api';

@Component({
  selector: 'app-solicitud',
  templateUrl: './solicitud.page.html',
  styleUrls: ['./solicitud.page.scss'],
  standalone: false
})
export class SolicitudPage {
  menuOpen = false;
  @ViewChild('solForm') solForm!: NgForm;

  // Inputs de fotos
  @ViewChild('frenteInput') frenteInput!: ElementRef;
  @ViewChild('espaldaInput') espaldaInput!: ElementRef;
  @ViewChild('izquierdaInput') izquierdaInput!: ElementRef;
  @ViewChild('derechaInput') derechaInput!: ElementRef;

  currentStep = 1;
  isLoading = false;

  cliente: any = {
    nombre: '',
    correo: '',
    telefono: '',
    fechaNacimiento: '',
    altura: null,
    alturaUnidad: 'cm',
    peso: null,
    pesoUnidad: 'kg',
    enfermedades: '',
    incapacidades: '',
    modalidad: '',
    precio: 0,
    estado: 'Pendiente',
    dias: null,
    foto_frente: '',
    foto_espalda: '',
    foto_izquierda: '',
    foto_derecha: ''
  };

  previews: any = {
    frente: '',
    espalda: '',
    izquierda: '',
    derecha: ''
  };

  // Plan y días
  planSeleccionado: string = '';
  diasSeleccionados: number | null = null;
  precio: number = 0;
  isComplete!: boolean;

  constructor(private api: ApiService) {}

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }


nextStep() {
  // Validación paso 1
  if (this.currentStep === 1) {
    if (!this.cliente.nombre || !this.cliente.correo || !this.cliente.telefono ||
        !this.cliente.fechaNacimiento || !this.cliente.altura || !this.cliente.peso) {
      this.errorMessage = 'Por favor completa todos los campos obligatorios';
      return;
    }
    this.errorMessage = '';
    this.currentStep++;
    return;
  }

  // Validación paso 2
  if (this.currentStep === 2) {
    if (!this.planSeleccionado) {
      this.errorMessage = 'Por favor selecciona la modalidad de servicio';
      return;
    }

    if ((this.planSeleccionado === 'Presencial' || this.planSeleccionado === 'Hibrido') && !this.diasSeleccionados) {
      this.errorMessage = 'Por favor selecciona la cantidad de días';
      return;
    }

    this.errorMessage = '';
    this.currentStep++;
    return;
  }

  // Puedes agregar validaciones para paso 3 aquí si quieres
}


  prevStep() {
    if (this.currentStep > 1) this.currentStep--;
  }

  triggerFileInput(campo: string) {
    switch (campo) {
      case 'frente': this.frenteInput.nativeElement.click(); break;
      case 'espalda': this.espaldaInput.nativeElement.click(); break;
      case 'izquierda': this.izquierdaInput.nativeElement.click(); break;
      case 'derecha': this.derechaInput.nativeElement.click(); break;
    }
  }

  previewImage(event: any, campo: string) {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 2_000_000) {
      alert('La imagen es demasiado grande. Intenta con una más pequeña.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      this.previews[campo] = base64;
      this.cliente[`foto_${campo}`] = base64;
    };
    reader.readAsDataURL(file);
  }

  // Modalidad seleccionada
  onModalidadChange() {
    this.diasSeleccionados = null;
    if (this.planSeleccionado === 'Online') {
      this.precio = 3500;
    } else {
      this.precio = 0;
    }
  }

  // Días seleccionados
  onDiasChange() {
    if (this.planSeleccionado === 'ppresencial' || this.planSeleccionado === 'Hibrido') {
      switch (Number(this.diasSeleccionados)) {
        case 3: this.precio = 3000; break;
        case 4: this.precio = 3500; break;
        case 5: this.precio = 4000; break;
        default: this.precio = 0; break;
      }
    }
  }

  resetFormData() {
    this.solForm.resetForm();
    this.cliente = {
      nombre: '', correo: '', telefono: '', fechaNacimiento: '',
      altura: null, alturaUnidad: 'cm', peso: null, pesoUnidad: 'kg',
      enfermedades: '', incapacidades: '', modalidad: '',
      foto_frente: '', foto_espalda: '', foto_izquierda: '', foto_derecha: ''
    };
    this.previews = { frente: '', espalda: '', izquierda: '', derecha: '' };
    this.currentStep = 1;
    this.planSeleccionado = '';
    this.diasSeleccionados = null;
    this.precio = 0;
  }

  errorMessage: string = '';

onSubmit() {
  if (!this.cliente.nombre || !this.cliente.correo || !this.cliente.telefono ||
      !this.cliente.fechaNacimiento || !this.cliente.altura || !this.cliente.peso) {
    this.errorMessage = 'Por favor completa todos los campos obligatorios del paso 1';
    return;
  }

  if (!this.planSeleccionado) {
    this.errorMessage = 'Por favor selecciona la modalidad de servicio';
    return;
  }

  if ((this.planSeleccionado === 'presencial' || this.planSeleccionado === 'hibrido') && !this.diasSeleccionados) {
    this.errorMessage = 'Por favor selecciona la cantidad de días';
    return;
  }

  // Limpiar mensaje antes de enviar
  this.errorMessage = '';

  // Lógica de envío...



    this.isLoading = true;

    const formData = new FormData();
    formData.append('nombre', this.cliente.nombre);
    formData.append('correo', this.cliente.correo);
    formData.append('telefono', this.cliente.telefono);
    formData.append('fecha_nacimiento', this.cliente.fechaNacimiento);
    formData.append('altura', String(this.cliente.altura));
    formData.append('altura_unidad', this.cliente.alturaUnidad);
    formData.append('peso', String(this.cliente.peso));
    formData.append('peso_unidad', this.cliente.pesoUnidad);
    formData.append('enfermedades', this.cliente.enfermedades);
    formData.append('incapacidades', this.cliente.incapacidades);
    formData.append('modalidad', this.planSeleccionado);
    formData.append('precio', String(this.precio));
    formData.append('estado', 'Pendiente');
    formData.append('dias', this.diasSeleccionados ? String(this.diasSeleccionados) : '');

    if (this.frenteInput.nativeElement.files[0]) formData.append('foto_frente', this.frenteInput.nativeElement.files[0]);
    if (this.espaldaInput.nativeElement.files[0]) formData.append('foto_espalda', this.espaldaInput.nativeElement.files[0]);
    if (this.izquierdaInput.nativeElement.files[0]) formData.append('foto_izquierda', this.izquierdaInput.nativeElement.files[0]);
    if (this.derechaInput.nativeElement.files[0]) formData.append('foto_derecha', this.derechaInput.nativeElement.files[0]);

    
this.isLoading = true;
this.isComplete = false;

this.api.registrarClienteFormData(formData).subscribe({
  next: res => {
    // Mostrar mensaje de listo
    this.isComplete = true;

    // Quitar overlay después de 2 segundos
    setTimeout(() => {
      this.isLoading = false;
      this.resetFormData();
    }, 2000);
  },
  error: err => {
    this.isLoading = false;
    this.isComplete = false;
    console.error('Error al registrar cliente:', err);
    // Podrías mostrar un overlay de error o mantener el alert
    alert('Error al registrar cliente');
  }
});
  }}
