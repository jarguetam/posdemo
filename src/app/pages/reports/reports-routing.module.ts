import { ReportCxcSellerComponent } from './report-cxc-seller/report-cxc-seller.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportInventoryComponent } from './report-inventory/report-inventory.component';
import { ReportInventoryWarehouseComponent } from './report-inventory-warehouse/report-inventory-warehouse.component';
import { AuthGuard } from 'src/app/guard/auth.guard';
import { ReportPurchaseComponent } from './report-purchase/report-purchase.component';
import { ReportSalesDateComponent } from './report-sales-date/report-sales-date.component';

const routes: Routes = [
    {
      path: '',
      children: [
        {
          path: 'reporte-inventario',
          component: ReportInventoryComponent
        },
        {
          path: 'reporte-inventario-almacen',
          component: ReportInventoryWarehouseComponent
        },
        {
          path: 'reporte-compras',
          component: ReportPurchaseComponent
        },
        {
          path: 'reporte-ventas',
          component: ReportSalesDateComponent
        },
        {
          path: 'reporte-cxc-vendedores',
          component: ReportCxcSellerComponent
        },
        {
          path: '',
          redirectTo: 'reporte-inventario',
          pathMatch: 'full'
        }
      ]
    }
  ];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ReportsRoutingModule {}
