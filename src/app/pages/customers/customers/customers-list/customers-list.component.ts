import { Component, OnInit, ViewChild } from '@angular/core';
import { Messages } from 'src/app/helpers/messages';
import { AuthService } from 'src/app/service/users/auth.service';
import { CustomerModel } from '../../models/customer';
import { CustomersService } from '../../service/customers.service';
import { CustomerSpecialPriceDialogComponent } from '../customer-special-price-dialog/customer-special-price-dialog.component';
import { CustomersDialogComponent } from '../customers-dialog/customers-dialog.component';
import { CustomerPriceListAssignmentComponent } from '../customer-price-list-assignment/customer-price-list-assignment.component';
import { ViewJornalBpDialogComponent } from 'src/app/pages/common/view-jornal-bp-dialog/view-jornal-bp-dialog.component';
import { User } from 'src/app/models/user';

@Component({
    selector: 'app-customers-list',
    templateUrl: './customers-list.component.html',
    styleUrls: ['./customers-list.component.scss'],
})
export class CustomersListComponent implements OnInit {
    @ViewChild(CustomersDialogComponent)
    CustomersDialog: CustomersDialogComponent;
    @ViewChild(CustomerSpecialPriceDialogComponent)
    CustomerSpecialPriceDialog: CustomerSpecialPriceDialogComponent;
    @ViewChild(CustomerPriceListAssignmentComponent)
    CustomerPriceListAssignment: CustomerPriceListAssignmentComponent;
    @ViewChild(ViewJornalBpDialogComponent)
    ViewJornalBpDialog: ViewJornalBpDialogComponent;
    title: string = 'Listado de clientes';
    customerList: CustomerModel[];
    loading: boolean = false;
    usuario: User;
    constructor(
        private customerService: CustomersService,
        private auth: AuthService
    ) {
        this.usuario = this.auth.UserValue
    }

    ngOnInit(): void {
        this._getCustomer();
    }

    async _getCustomer() {
        try {
            this.loading = true;
            this.customerList = await this.customerService.getCustomer();
            if (this.usuario.role != 'Administrador') {
                this.customerList = this.customerList.filter(
                    (x) => x.sellerId === this.usuario.sellerId
                );
            }
            Messages.closeLoading();
            this.loading = false;
        } catch (ex) {
            this.loading = false;
            Messages.warning('Advertencia', ex.error.message);
        }
    }

    customerModify(customer) {
        this.customerList = customer;
    }

    editCustomer(customer: CustomerModel) {
        if (!this.auth.hasPermission('btn_edit_customer')) {
            Messages.warning(
                'No tiene acceso',
                'No puede editar por favor solicite el acceso'
            );
            return;
        }
        this.CustomersDialog.showDialog(customer, false);
    }

    addCustomer() {
        if (!this.auth.hasPermission('btn_add_customer')) {
            Messages.warning(
                'No tiene acceso',
                'No puede agregar, por favor solicite el acceso'
            );
            return;
        }
        this.CustomersDialog.showDialog(new CustomerModel(), true);
    }

    addPrice(customer: CustomerModel) {
        if (!this.auth.hasPermission('btn_add_price')) {
            Messages.warning(
                'No tiene acceso',
                'No puede agregar precios, por favor solicite el acceso'
            );
            return;
        }
        this.CustomerPriceListAssignment.showDialog(
            customer.listPriceId,
            true,
            customer.customerId,
            customer.customerCode,
            customer.customerName,
            customer.priceListName
        );
    }

    showBpJornal(customerId: number) {
        if (!this.auth.hasPermission('btn_history')) {
            Messages.warning(
                'No tiene acceso',
                'No puede ver historial de transacciones, por favor solicite el acceso.'
            );
            return;
        }
        this.ViewJornalBpDialog.showDialog(customerId, 'C');
    }
}
