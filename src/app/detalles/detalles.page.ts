import { Component, Input, input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-detalles',
  templateUrl: './detalles.page.html',
  styleUrls: ['./detalles.page.scss'],
  standalone: false
})
export class DetallesPage  {
  @Input() cliente: any; // Recibimos el cliente desde la página padre

  activeTab: string = 'personal';

  constructor(private modalCtrl: ModalController) {}

  closeModal() {
    this.modalCtrl.dismiss();
  }

  showTab(tab: string) {
    this.activeTab = tab;
  }
}
