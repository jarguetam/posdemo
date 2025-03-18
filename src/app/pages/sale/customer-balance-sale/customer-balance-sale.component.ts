import { Component, HostListener, OnInit } from '@angular/core';
import { DocumentSaleModel } from '../models/document-model';
import { SalesService } from '../services/sales.service';
import { AuthService } from 'src/app/service/users/auth.service';
import { User } from 'src/app/models/user';
import { GroupedCustomer } from './model/grouped-customer';
import { PrintBalancePdfService } from './service/print-balance-pdf.service';
import { PrintBalanceService } from './service/print-balance.service';

@Component({
    selector: 'app-customer-balance-sale',
    templateUrl: './customer-balance-sale.component.html',
    styleUrls: ['./customer-balance-sale.component.scss'],
})
export class CustomerBalanceSaleComponent implements OnInit {
    title: string = 'Estado de cuenta de clientes';
    groupedCustomers: GroupedCustomer[] = [];
    customerList: DocumentSaleModel[] = [];
    filterCustomers: DocumentSaleModel[] = [];
    user: User;
    loading: boolean = false;
    f4Pressed: boolean;

    constructor(
        private salesService: SalesService,
        private userService: AuthService,
        private printPDfService: PrintBalancePdfService,
        private printEscService: PrintBalanceService
    ) {
        this.user = this.userService.UserValue;
    }

    ngOnInit(): void {
        this.search();
    }

    async search() {
        this.loading = true;
        this.filterCustomers = await this.salesService.getInvoiceActiveSeller(
            this.user.userId
        );
        if (this.user.roleId != 1) {
            this.customerList = this.filterCustomers.filter(
                (x) => x.sellerId === this.user.sellerId
            );
        }else{
            this.customerList = this.filterCustomers;
        }
        this.groupCustomers(this.customerList);
        this.loading = false;
    }

    @HostListener('document:keyup', ['$event'])
    handleKeyUpEvent(event: KeyboardEvent): void {
        if (event.key === 'F4' && this.f4Pressed) {
            this.customerList = this.filterCustomers;
            this.f4Pressed = false;
        }
    }

    resetFilter(){
        this.customerList = this.filterCustomers;
    }
    groupCustomers(customerList: DocumentSaleModel[]) {
        const groupedMap = new Map<number, GroupedCustomer>();
        customerList.forEach((sale) => {
            if (!groupedMap.has(sale.customerId)) {
                groupedMap.set(sale.customerId, {
                    customerId: sale.customerId,
                    customerCode: sale.customerCode,
                    customerName: sale.customerName,
                    sellerName: sale.sellerName,
                    total: 0,
                    totalBalance: 0,
                    totalPaidToDate: 0,
                });
            }
            const group = groupedMap.get(sale.customerId)!;
            group.totalBalance += sale.balance || 0;
            group.totalPaidToDate += sale.paidToDate || 0;
            group.total += sale.docTotal || 0;
        });
        this.groupedCustomers = Array.from(groupedMap.values());
    }

    printPDf(groupedCustomers: GroupedCustomer) {
        const detail = this.customerList.filter(
            (c) => c.customerId === groupedCustomers.customerId
        );
        this.printPDfService.printPDF(groupedCustomers, detail);
    }

    printEsc(groupedCustomers: GroupedCustomer) {
        const detail = this.customerList.filter(
            (c) => c.customerId === groupedCustomers.customerId
        );
        this.printEscService.printEsc(groupedCustomers, detail);
    }
}
