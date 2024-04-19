import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PricelistRoutingModule } from './pricelist-routing.module';
import { PricelistDetailComponent } from './pricelist-detail/pricelist-detail.component';


@NgModule({
  declarations: [  ],
  imports: [
    CommonModule,
    PricelistRoutingModule
  ]
})
export class PricelistModule { }
