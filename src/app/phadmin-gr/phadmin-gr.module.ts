import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PhadminGRPageRoutingModule } from './phadmin-gr-routing.module';

import { PhadminGRPage } from './phadmin-gr.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PhadminGRPageRoutingModule
  ],
  declarations: [PhadminGRPage]
})
export class PhadminGRPageModule {}
