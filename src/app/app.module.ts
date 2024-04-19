import { CopyOrderListComponent } from './pages/purchase/invoice/copy-order-list/copy-order-list.component';
import { AppComponent } from './app.component';
import { AppConfigComponent } from './config/app.config.component';
import { AppFooterComponent } from './app.footer.component';
import { AppMainComponent } from './app.main.component';
import { AppMenuComponent } from './menu/app.menu.component';
import { AppMenuitemComponent } from './app.menuitem.component';
import { AppTopBarComponent } from './app.topbar.component';
import { CameraPickerComponent } from './components/camera-picker/camera-picker.component';
import { CategorydialogComponent } from './pages/customers/category/categorydialog/categorydialog.component';
import { CategoryItemsDialogComponent } from './pages/items/category-items/category-items-dialog/category-items-dialog.component';
import { CategoryItemsListComponent } from './pages/items/category-items/category-items-list/category-items-list.component';
import { CategorySupplierDialogComponent } from './pages/suppliers/category-supplier/category-supplier-dialog/category-supplier-dialog.component';
import { CategorySupplierListComponent } from './pages/suppliers/category-supplier/category-supplier-list/category-supplier-list.component';
import { CommonService } from './service/common.service';
import { CompanyInfoDialogComponent } from './pages/company-info/components/company-info.dialog.component';
import { ComponentsAppModule } from './components.modules';
import { ConfigService } from './service/app.config.service';
import { CustomersDialogComponent } from './pages/customers/customers/customers-dialog/customers-dialog.component';
import { CustomersListComponent } from './pages/customers/customers/customers-list/customers-list.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { EmptyComponent } from './components/empty/empty.component';
import { ErrorComponent } from './components/error/error.component';
import { FilePickerPropioComponent } from './components/file-picker/file.picker.propio.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InventoryEntryDialogComponent } from './pages/inventory-transaction/inventory-entry/inventory-entry-dialog/inventory-entry-dialog.component';
import { InventoryEntryListComponent } from './pages/inventory-transaction/inventory-entry/inventory-entry-list/inventory-entry-list.component';
import { ItemsBrowserComponent } from './pages/browser/items/items-browser/items-browser.component';
import { ItemsDialogComponent } from './pages/items/items/items-dialog/items-dialog.component';
import { ItemsListComponent } from './pages/items/items/items-list/items-list.component';
import { JwtInterceptor } from './helpers/jwt.interceptor';
import { LandingComponent } from './components/landing/landing.component';
import { ListcategoryComponent } from './pages/customers/category/listcategory/listcategory.component';
import { ListCompanyInfoComponent } from './pages/company-info/list.company-info/list.company-info.component';
import { ListPermissionComponent } from './pages/permissions/list.permission.component';
import { ListRolesComponent } from './pages/roles/list.roles.component';
import { ListUsersComponent } from './pages/users/list.users.component';
import { ListWareHouseComponent } from './pages/items/warehouse/list-ware-house/list-ware-house.component';
import { LoadingComponent } from './components/loading/loading.component';
import { LocationStrategy, HashLocationStrategy, DatePipe } from '@angular/common';
import { LoginComponent } from './pages/login/login.component';
import { MenuService } from './service/app.menu.service';
import { NgModule } from '@angular/core';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { PayconditiondialogComponent } from './pages/payconditon/payconditiondialog/payconditiondialog.component';
import { PayconditionlistComponent } from './pages/payconditon/payconditionlist/payconditionlist.component';
import { PermissionDialogComponent } from './pages/permissions/components/permission.dialog.component';
import { PricelistComponent } from './pages/customers/pricelist/pricelist/pricelist.component';
import { PricelistDetailComponent } from './pages/customers/pricelist/pricelist-detail/pricelist-detail.component';
import { PricelistdialogComponent } from './pages/customers/pricelist/pricelistdialog/pricelistdialog.component';
import { RoleDialogComponent } from './pages/roles/components/role.dialog.component';
import { SellerDialogComponent } from './pages/seller/components/seller.dialog/seller.dialog.component';
import { SellerListComponent } from './pages/seller/seller-list/seller-list.component';
import { SellerRegionDialogComponent } from './pages/seller/components/seller-region.dialog/seller-region.dialog.component';
import { SellerRegionListComponent } from './pages/seller/seller-region-list/seller-region-list.component';
import { SellerService } from './pages/seller/service/seller.service';
import { SkeletonTableComponent } from './components/skeleton-table/skeleton.table.component';
import { SupplierDialogComponent } from './pages/suppliers/supplier/supplier-dialog/supplier-dialog.component';
import { SupplierListComponent } from './pages/suppliers/supplier/supplier-list/supplier-list.component';
import { UnitOfMeasureDialogComponent } from './pages/items/unitOfmeasure/unit-of-measure-dialog/unit-of-measure-dialog.component';
import { UnitOfMeasureListComponent } from './pages/items/unitOfmeasure/unit-of-measure-list/unit-of-measure-list.component';
import { UserDialogComponent } from './pages/users/components/user.dialog.component';
import { UserService } from './service/users/user.service';
import { WareHouseDialogComponent } from './pages/items/warehouse/ware-house-dialog/ware-house-dialog.component';
import { WebcamModule } from 'ngx-webcam';
import {ColorPickerModule} from 'primeng/colorpicker';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import { InventoryOutPutListComponent } from './pages/inventory-transaction/inventory-output/inventory-out-put-list/inventory-out-put-list.component';
import { InventoryOutPutDialogComponent } from './pages/inventory-transaction/inventory-output/inventory-out-put-dialog/inventory-out-put-dialog.component';
import { ItemsBrowserWareHouseComponent } from './pages/browser/items/items-browser-ware-house/items-browser-ware-house.component';
import { InventoryTransferListComponent } from './pages/inventory-transaction/inventory-transfer/inventory-transfer-list/inventory-transfer-list.component';
import { InventoryTransferDialogComponent } from './pages/inventory-transaction/inventory-transfer/inventory-transfer-dialog/inventory-transfer-dialog.component';
import { SupplierBrowserComponent } from './pages/browser/supplier/supplier-browser/supplier-browser.component';
import { OrdersPurchaseListComponent } from './pages/purchase/orders/orders-purchase-list/orders-purchase-list.component';
import { OrdersPurchaseDialogComponent } from './pages/purchase/orders/orders-purchase-dialog/orders-purchase-dialog.component';
import { InvoicePurchaseListComponent } from './pages/purchase/invoice/invoice-purchase-list/invoice-purchase-list.component';
import { InvoicePurchaseDialogComponent } from './pages/purchase/invoice/invoice-purchase-dialog/invoice-purchase-dialog.component';
import { PurchasePaymentListComponent } from './pages/purchase-payment/purchase-payment-list/purchase-payment-list.component';
import { PurchasePaymentDialogComponent } from './pages/purchase-payment/purchase-payment-dialog/purchase-payment-dialog.component';
import { PurchaseInvoiceDialogComponent } from './pages/purchase-payment/purchase-invoice-dialog/purchase-invoice-dialog.component';
import { PaymentMetodDialogComponent } from './pages/common/payment-metod-dialog/payment-metod-dialog.component';
import { ListCorrelativeComponent } from './pages/correlative/list.correlative.component';
import { CorrelativeDialogComponent } from './pages/correlative/components/correlative.dialog/correlative.dialog.component';
import { PointSaleDialogComponent } from './pages/correlative/components/point-sale.dialog/point-sale.dialog.component';
import { ListPointSaleComponent } from './pages/correlative/components/list.point-sale/list.point-sale.component';
import { CustomerSpecialPriceDialogComponent } from './pages/customers/customers/customer-special-price-dialog/customer-special-price-dialog.component';
import { ItemsBrowserPriceSalesComponent } from './pages/browser/items/items-browser-price-sales/items-browser-price-sales.component';
import { OrdersSaleListComponent } from './pages/sale/orders/orders-sale-list/orders-sale-list.component';
import { OrdersSaleDialogComponent } from './pages/sale/orders/orders-sale-dialog/orders-sale-dialog.component';
import { InvoiceSaleListComponent } from './pages/sale/invoice/invoice-sale-list/invoice-sale-list.component';
import { InvoiceSaleDialogComponent } from './pages/sale/invoice/invoice-sale-dialog/invoice-sale-dialog.component';
import { CustomerBrowserComponent } from './pages/browser/customer/customer-browser/customer-browser.component';
import { CopyOrderSaleListComponent } from './pages/sale/invoice/copy-order-list/copy-order-list.component';
import { ViewJornalBpDialogComponent } from './pages/common/view-jornal-bp-dialog/view-jornal-bp-dialog.component';
import { ViewJornalItemsDialogComponent } from './pages/items/view-jornal-items-dialog/view-jornal-items-dialog.component';
import { SalesPaymentListComponent } from './pages/sales-payment/sales-payment-list/sales-payment-list.component';
import { SalesInvoiceDialogComponent } from './pages/sales-payment/sales-invoice-dialog/sales-invoice-dialog.component';
import { SalesPaymentDialogComponent } from './pages/sales-payment/sales-payment-dialog/sales-payment-dialog.component';
import { SubCategoryItemsListComponent } from './pages/items/sub-category-items/sub-category-items-list/sub-category-items-list.component';
import { SubCategoryItemsDialogComponent } from './pages/items/sub-category-items/sub-category-items-dialog/sub-category-items-dialog.component';
import { InventarioTransactionTypeListComponent } from './pages/inventory-transaction/inventory-transaction-type/inventario-transaction-type-list/inventario-transaction-type-list.component';
import { InventarioTransactionTypeDialogComponent } from './pages/inventory-transaction/inventory-transaction-type/inventario-transaction-type-dialog/inventario-transaction-type-dialog.component';
import { CustomerPriceListAssignmentComponent } from './pages/customers/customers/customer-price-list-assignment/customer-price-list-assignment.component';
import { FocusLastInputDirective } from './directive/focus-last-input.directive';
import { FocusInputDirective } from './directive/focus-input.directive';
import { CostRevaluationListComponent } from './pages/inventory-transaction/cost-revaluation/cost-revaluation-list/cost-revaluation-list.component';
import { CostRevaluationDialogComponent } from './pages/inventory-transaction/cost-revaluation/cost-revaluation-dialog/cost-revaluation-dialog.component';
import { SupplierAccountListComponent } from './pages/purchase/supplier-account/supplier-account-list/supplier-account-list.component';
import { InventoryTransferRequestListComponent } from './pages/inventory-transaction/inventory-transfer-request/inventory-transfer-request-list/inventory-transfer-request-list.component';
import { InventoryTransferRequestDialogComponent } from './pages/inventory-transaction/inventory-transfer-request/inventory-transfer-request-dialog/inventory-transfer-request-dialog.component';
import { InventoryTransferRequestToCompleteComponent } from './pages/inventory-transaction/inventory-transfer-request/inventory-transfer-request-to-complete/inventory-transfer-request-to-complete.component';
import { CustomerAccountListComponent } from './pages/sale/customer-account/customer-account-list/customer-account-list.component';
import { ReportsModule } from './pages/reports/reports.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { InvoiceSaleComponent } from './pages/sale/invoice/invoice-sale/invoice-sale.component';
import { SalesPaymentComponent } from './pages/sales-payment/sales-payment/sales-payment.component';
import { ConnectionServiceModule } from 'ng-connection-service';
import { InactivityModalComponent } from './components/inactivity-modal/inactivity-modal.component';
import { WizardConfigurationComponent } from './components/wizard-configuration/wizard-configuration.component';
import { BrowserModule, HammerModule } from '@angular/platform-browser';
import 'hammerjs';
import { LiquidationDialogComponent } from './pages/expense/liquidation/liquidation-dialog/liquidation-dialog.component';
import { LiquidationListComponent } from './pages/expense/liquidation/liquidation-list/liquidation-list.component';


@NgModule({
    imports: [
        ComponentsAppModule,
        BrowserModule,
        InputSwitchModule,
        ColorPickerModule,
        ProgressSpinnerModule,
        HammerModule,
        WebcamModule,
        ReportsModule,
        ConnectionServiceModule,
        ServiceWorkerModule.register('ngsw-worker.js', {
          enabled: environment.production,
          // Register the ServiceWorker as soon as the app is stable
          // or after 30 seconds (whichever comes first).
          registrationStrategy: 'registerWhenStable:30000'
        })

    ],
    declarations: [
        AppComponent,
        AppConfigComponent,
        AppFooterComponent,
        AppMainComponent,
        AppMenuComponent,
        AppMenuitemComponent,
        AppTopBarComponent,
        CameraPickerComponent,
        CompanyInfoDialogComponent,
        DashboardComponent,
        EmptyComponent,
        ErrorComponent,
        FilePickerPropioComponent,
        LandingComponent,
        ListCompanyInfoComponent,
        ListPermissionComponent,
        ListRolesComponent,
        ListUsersComponent,
        LoadingComponent,
        LoginComponent,
        NotfoundComponent,
        PermissionDialogComponent,
        RoleDialogComponent,
        SellerListComponent,
        SellerRegionListComponent,
        SkeletonTableComponent,
        UserDialogComponent,
        SellerRegionDialogComponent,
        SellerDialogComponent,
        ListWareHouseComponent,
        WareHouseDialogComponent,
        ListcategoryComponent,
        CategorydialogComponent,
        PayconditionlistComponent,
        PayconditiondialogComponent,
        PricelistComponent,
        PricelistdialogComponent,
        PricelistDetailComponent,
        CustomersListComponent,
        CustomersDialogComponent,
        CategorySupplierListComponent,
        CategorySupplierDialogComponent,
        SupplierListComponent,
        SupplierDialogComponent,
        UnitOfMeasureListComponent,
        UnitOfMeasureDialogComponent,
        CategoryItemsDialogComponent,
        CategoryItemsListComponent,
        ItemsDialogComponent,
        ItemsListComponent,
        InventoryEntryListComponent,
        InventoryEntryDialogComponent,
        ItemsBrowserComponent,
        InventoryOutPutListComponent,
        InventoryOutPutDialogComponent,
        ItemsBrowserWareHouseComponent,
        InventoryTransferListComponent,
        InventoryTransferDialogComponent,
        SupplierBrowserComponent,
        OrdersPurchaseListComponent,
        OrdersPurchaseListComponent,
        OrdersPurchaseDialogComponent,
        InvoicePurchaseListComponent,
        InvoicePurchaseDialogComponent,
        CopyOrderListComponent,
        PurchasePaymentListComponent,
        PurchasePaymentDialogComponent,
        PurchaseInvoiceDialogComponent,
        PaymentMetodDialogComponent,
        ListCorrelativeComponent,
        CorrelativeDialogComponent,
        PointSaleDialogComponent,
        ListPointSaleComponent,
        CustomerSpecialPriceDialogComponent,
        ItemsBrowserPriceSalesComponent,
        OrdersSaleListComponent,
        OrdersSaleDialogComponent,
        InvoiceSaleListComponent,
        InvoiceSaleDialogComponent,
        CustomerBrowserComponent,
        CopyOrderSaleListComponent,
        ViewJornalBpDialogComponent,
        ViewJornalItemsDialogComponent,
        SalesPaymentListComponent,
        SalesInvoiceDialogComponent,
        SalesPaymentDialogComponent,
        SubCategoryItemsListComponent,
        SubCategoryItemsDialogComponent,
        InventarioTransactionTypeListComponent,
        InventarioTransactionTypeDialogComponent,
        CustomerPriceListAssignmentComponent,
        FocusLastInputDirective,
        FocusInputDirective,
        CostRevaluationListComponent,
        CostRevaluationDialogComponent,
        SupplierAccountListComponent,
        InventoryTransferRequestListComponent,
        InventoryTransferRequestDialogComponent,
        InventoryTransferRequestToCompleteComponent,
        CustomerAccountListComponent,
        InvoiceSaleComponent,
        SalesPaymentComponent,
        InactivityModalComponent,
        WizardConfigurationComponent,
        LiquidationDialogComponent,
        LiquidationListComponent,
               // ReportInventoryComponent,
        // ReportInventoryWarehouseComponent
    ],
    providers: [
        {provide: LocationStrategy, useClass: HashLocationStrategy},
         MenuService, ConfigService,UserService,CommonService,
         SellerService,
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
       // { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
       // { provide: HTTP_INTERCEPTORS, useClass: MonitorInterceptor, multi: true },
        //{ provide: HTTP_INTERCEPTORS, useClass: CachingInterceptor, multi: true },
        DatePipe
        // {provide: LOCALE_ID, useValue: 'es-HN'},
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
