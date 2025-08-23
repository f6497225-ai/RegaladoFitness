import { Component, Input, input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Location } from '@angular/common';

@Component({
  selector: 'app-detalles',
  templateUrl: './detalles.page.html',
  styleUrls: ['./detalles.page.scss'],
  standalone: false
})
export class DetallesPage  {
  @Input() cliente: any; // Recibimos el cliente desde la página padre

  activeTab: string = 'personal';

  constructor(private location: Location) {}

  volver() {
    this.location.back(); // 👈 vuelve a la página anterior
  }
}
