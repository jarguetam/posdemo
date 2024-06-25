import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InventoryReturnRoutingModule } from './inventory-return-routing.module';
import { InventoryReturnListComponent } from './inventory-return-list/inventory-return-list.component';
import { InventoryReturnDialogComponent } from './inventory-return-dialog/inventory-return-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    InventoryReturnRoutingModule,
    ReactiveFormsModule
  ]
})
export class InventoryReturnModule { }
