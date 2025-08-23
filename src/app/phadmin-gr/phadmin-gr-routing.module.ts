import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PhadminGRPage } from './phadmin-gr.page';

const routes: Routes = [
  {
    path: '',
    component: PhadminGRPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PhadminGRPageRoutingModule {}
