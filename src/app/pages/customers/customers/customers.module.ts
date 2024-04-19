import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomersRoutingModule } from './customers-routing.module';
import { CustomerSpecialPriceDialogComponent } from './customer-special-price-dialog/customer-special-price-dialog.component';
import { CustomerPriceListAssignmentComponent } from './customer-price-list-assignment/customer-price-list-assignment.component';


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    CustomersRoutingModule
  ]
})
export class CustomersModule { }
