import { Component, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-solicitud',
  templateUrl: './solicitud.page.html',
  styleUrls: ['./solicitud.page.scss'],
  standalone: false
})
export class SolicitudPage {
currentStep = 1;
  menuOpen = false;
  previews: { [key: string]: string | null } = {
    frente: null,
    espalda: null,
    izquierda: null,
    derecha: null
  };

  // Referencias a los inputs file
  @ViewChild('frenteInput') frenteInput!: ElementRef;
  @ViewChild('espaldaInput') espaldaInput!: ElementRef;
  @ViewChild('izquierdaInput') izquierdaInput!: ElementRef;
  @ViewChild('derechaInput') derechaInput!: ElementRef;

  constructor() { }

  // Función para disparar el input file
  triggerFileInput(type: string) {
    const inputMap: { [key: string]: ElementRef } = {
      frente: this.frenteInput,
      espalda: this.espaldaInput,
      izquierda: this.izquierdaInput,
      derecha: this.derechaInput
    };

    const inputRef = inputMap[type];
    if (inputRef) {
      inputRef.nativeElement.click();
    }
  }

  // Función para previsualizar imagen
  previewImage(event: any, type: string) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previews[type] = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // Función para el menú hamburguesa
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  // Navegación entre pasos
  nextStep() {
    if (this.currentStep < 2) {
      this.currentStep++;
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  // Función para enviar formulario
  onSubmit() {
    console.log('Formulario enviado');
    console.log('Previews:', this.previews);
    // Aquí puedes manejar el envío del formulario
  }

  
  
}

