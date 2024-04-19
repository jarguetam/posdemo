import { CategoryItemsDialogComponent } from './category-items-dialog/category-items-dialog.component';
import { CategoryItemsListComponent } from './category-items-list/category-items-list.component';
import { CategoryItemsRoutingModule } from './category-items-routing.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsAppModule } from 'src/app/components.modules';


@NgModule({
  declarations: [  ],
  imports: [
    CommonModule,
    CategoryItemsRoutingModule,
  ]
})
export class CategoryItemsModule { }
