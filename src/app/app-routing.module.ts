import { WizardConfigurationComponent } from './components/wizard-configuration/wizard-configuration.component';
import { PreloadAllModules, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AppMainComponent } from './app.main.component';
import { ErrorComponent } from './components/error/error.component';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { AuthGuard } from './guard/auth.guard';


@NgModule({
    imports: [
        RouterModule.forRoot(
            [
                {
                    path: '',
                    component: AppMainComponent,
                    children: [

                        {
                            path: '',
                            component: DashboardComponent,
                            canActivate: [AuthGuard],
                        },
                        {
                            path: 'usuarios',
                            loadChildren: () =>
                                import('./pages/users/users.module').then(
                                    (m) => m.UsersModule
                                ),
                            canActivate: [AuthGuard],
                        },
                        {
                            path: 'roles',
                            loadChildren: () =>
                                import('./pages/roles/roles.module').then(
                                    (m) => m.RolesModule
                                ),
                            canActivate: [AuthGuard],
                        },
                        {
                            path: 'permisos',
                            loadChildren: () =>
                                import(
                                    './pages/permissions/permissions.module'
                                ).then((m) => m.PermissionsModule),
                            canActivate: [AuthGuard],
                        },
                        {
                            path: 'empresa',
                            loadChildren: () =>
                                import(
                                    './pages/company-info/company-info.module'
                                ).then((m) => m.CompanyInfoModule),
                            canActivate: [AuthGuard],
                        },
                        {
                            path: 'region-vendedores',
                            loadChildren: () =>
                                import(
                                    './pages/seller/seller-region-list/seller-region-list.module'
                                ).then((m) => m.SellerRegionListModule),
                            canActivate: [AuthGuard],
                        },
                        {
                            path: 'listado-vendedores',
                            loadChildren: () =>
                                import(
                                    './pages/seller/seller-list/seller-list.module'
                                ).then((m) => m.SellerListModule),
                            canActivate: [AuthGuard],
                        },
                        {
                            path: 'almacenes',
                            loadChildren: () =>
                                import(
                                    './pages/items/warehouse/warehouse.module'
                                ).then((m) => m.WarehouseModule),
                            canActivate: [AuthGuard],
                        },
                        {
                            path: 'categoria-clientes',
                            loadChildren: () =>
                                import(
                                    './pages/customers/category/category.module'
                                ).then((m) => m.CategoryModule),
                            canActivate: [AuthGuard],
                        },
                        {
                            path: 'condiciones-pago',
                            loadChildren: () =>
                                import(
                                    './pages/payconditon/payconditon.module'
                                ).then((m) => m.PayconditonModule),
                            canActivate: [AuthGuard],
                        },
                        {
                            path: 'listado-precios',
                            loadChildren: () =>
                                import(
                                    './pages/customers/pricelist/pricelist.module'
                                ).then((m) => m.PricelistModule),
                            canActivate: [AuthGuard],
                        },
                        {
                            path: 'clientes',
                            loadChildren: () =>
                                import(
                                    './pages/customers/customers/customers.module'
                                ).then((m) => m.CustomersModule),
                            canActivate: [AuthGuard],
                        },
                        {
                            path: 'categoria-proveedor',
                            loadChildren: () =>
                                import(
                                    './pages/suppliers/category-supplier/category-supplier.module'
                                ).then((m) => m.CategorySupplierModule),
                            canActivate: [AuthGuard],
                        },
                        {
                            path: 'proveedores',
                            loadChildren: () =>
                                import(
                                    './pages/suppliers/supplier/supplier.module'
                                ).then((m) => m.SupplierModule),
                            canActivate: [AuthGuard],
                        },
                        {
                            path: 'categoria-articulos',
                            loadChildren: () =>
                                import(
                                    './pages/items/category-items/category-items.module'
                                ).then((m) => m.CategoryItemsModule),
                            canActivate: [AuthGuard],
                        },
                        {
                            path: 'unidades-medidas',
                            loadChildren: () =>
                                import(
                                    './pages/items/unitOfmeasure/unit-ofmeasure.module'
                                ).then((m) => m.UnitOfmeasureModule),
                            canActivate: [AuthGuard],
                        },
                        {
                            path: 'articulos',
                            loadChildren: () =>
                                import('./pages/items/items/items.module').then(
                                    (m) => m.ItemsModule
                                ),
                            canActivate: [AuthGuard],
                        },
                        {
                            path: 'listado-entradas',
                            loadChildren: () =>
                                import(
                                    './pages/inventory-transaction/inventory-entry/inventory-entry.module'
                                ).then((m) => m.InventoryEntryModule),
                            canActivate: [AuthGuard],
                        },
                        {
                            path: 'listado-salidas',
                            loadChildren: () =>
                                import(
                                    './pages/inventory-transaction/inventory-output/inventory-output.module'
                                ).then((m) => m.InventoryOutputModule),
                            canActivate: [AuthGuard],
                        },
                        {
                            path: 'listado-transferencias',
                            loadChildren: () =>
                                import(
                                    './pages/inventory-transaction/inventory-transfer/inventory-transfer.module'
                                ).then((m) => m.InventoryTransferModule),
                            canActivate: [AuthGuard],
                        },
                        {
                            path: 'listado-pedidos-compra',
                            loadChildren: () =>
                                import(
                                    './pages/purchase/orders/orders.module'
                                ).then((m) => m.OrdersPurchaseModule),
                            canActivate: [AuthGuard],
                        },
                        {
                            path: 'listado-facturas-compras',
                            loadChildren: () =>
                                import(
                                    './pages/purchase/invoice/invoice.module'
                                ).then((m) => m.InvoiceModule),
                            canActivate: [AuthGuard],
                        },
                        {
                            path: 'listado-pagos-proveedores',
                            loadChildren: () =>
                                import(
                                    './pages/purchase-payment/purchase-payment.module'
                                ).then((m) => m.PurchasePaymentModule),
                            canActivate: [AuthGuard],
                        },
                        {
                            path: 'sar',
                            loadChildren: () =>
                                import(
                                    './pages/correlative/correlative.module'
                                ).then((m) => m.CorrelativeModule),
                            canActivate: [AuthGuard],
                        },
                        {
                            path: 'listado-pedidos',
                            loadChildren: () =>
                                import(
                                    './pages/sale/orders/orders.module'
                                ).then((m) => m.OrdersModule),
                            canActivate: [AuthGuard],
                        },
                        {
                            path: 'listado-facturas-venta',
                            loadChildren: () =>
                                import(
                                    './pages/sale/invoice/invoice.module'
                                ).then((m) => m.InvoiceModule),
                            canActivate: [AuthGuard],
                        },
                        {
                            path: 'listado-cobros-clientes',
                            loadChildren: () =>
                                import(
                                    './pages/sales-payment/sales-payment.module'
                                ).then((m) => m.SalesPaymentModule),
                            canActivate: [AuthGuard],
                        },
                        {
                            path: 'sub-familia',
                            loadChildren: () =>
                                import(
                                    './pages/items/sub-category-items/sub-category-items.module'
                                ).then((m) => m.SubCategoryItemsModule),
                            canActivate: [AuthGuard],
                        },
                        {
                            path: 'tipo-ajustes-inventario',
                            loadChildren: () =>
                                import(
                                    './pages/inventory-transaction/inventory-transaction-type/inventory-transaction-type.module'
                                ).then((m) => m.InventoryTransactionTypeModule),
                            canActivate: [AuthGuard],
                        },
                        {
                            path: 'revalorizacion-inventario',
                            loadChildren: () =>
                                import(
                                    './pages/inventory-transaction/cost-revaluation/cost-revaluation.module'
                                ).then((m) => m.CostRevaluationModule),
                            canActivate: [AuthGuard],
                        },
                        {
                            path: 'cuentas-por-pagar',
                            loadChildren: () =>
                                import(
                                    './pages/purchase/supplier-account/supplier-account.module'
                                ).then((m) => m.SupplierAccountModule),
                            canActivate: [AuthGuard],
                        },
                        {
                            path: 'solicitud-transferencia',
                            loadChildren: () =>
                                import(
                                    './pages/inventory-transaction/inventory-transfer-request/inventory-transfer-request.module'
                                ).then((m) => m.InventoryTransferRequestModule),
                            canActivate: [AuthGuard],
                        },
                        {
                            path: 'listado-cuentas-cobrar',
                            loadChildren: () =>
                                import(
                                    './pages/sale/customer-account/customer-account.module'
                                ).then((m) => m.CustomerAccountModule),
                            canActivate: [AuthGuard],
                        },
                        {
                            path: 'bluetooth-device-selector',
                            loadChildren: () =>
                                import(
                                    './pages/bluetooth-device-selector/bluetooth-device-selector.module'
                                ).then((m) => m.BluetoothDeviceSelectorModule),
                            canActivate: [AuthGuard],
                        },
                        {
                            path: 'reportes',
                            children: [
                              {
                                path: '',
                                loadChildren: () => import('./pages/reports/reports.module').then(m => m.ReportsModule),
                                canActivate: [AuthGuard]
                              }
                            ]
                        },
                        {
                            path: 'liquidaciones',
                            children: [
                              {
                                path: '',
                                loadChildren: () => import('./pages/expense/expense.module').then(m => m.ExpenseModule),
                                canActivate: [AuthGuard]
                              }
                            ]
                        },
                        {
                            path: 'devoluciones',
                            children: [
                              {
                                path: '',
                                loadChildren: () => import('./pages/inventory-transaction/inventory-return/inventory-return.module').then(m => m.InventoryReturnModule),
                                canActivate: [AuthGuard]
                              }
                            ]
                        },
                    ],
                },
                {
                    path: 'wizar-configuracion',
                    component: WizardConfigurationComponent,
                    canActivate: [AuthGuard],
                },
                {
                    path: 'login',
                    loadChildren: () =>
                        import('./pages/login/login.module').then(
                            (m) => m.LoginModule
                        ),
                },
                { path: 'pages/error', component: ErrorComponent },
                { path: 'pages/notfound', component: NotfoundComponent },
                { path: '**', redirectTo: 'pages/notfound' },
            ],
            {
                scrollPositionRestoration: 'enabled',
                anchorScrolling: 'enabled',
                enableTracing: true,
                preloadingStrategy: PreloadAllModules,
            }
        ),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}
