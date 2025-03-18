import {
    Component,
    EventEmitter,
    HostListener,
    OnInit,
    Output,
    Renderer2,
    ViewChild,
} from '@angular/core';
import { Table } from 'primeng/table';
import { InputText } from 'primeng/inputtext';
import { Messages } from 'src/app/helpers/messages';
import { CustomerModel } from 'src/app/pages/customers/models/customer';
import { CustomersService } from 'src/app/pages/customers/service/customers.service';
import { AuthService } from 'src/app/service/users/auth.service';
import { CustomersDialogComponent } from 'src/app/pages/customers/customers/customers-dialog/customers-dialog.component';

@Component({
    selector: 'app-customer-browser',
    templateUrl: './customer-browser.component.html',
    styleUrls: ['./customer-browser.component.scss'],
})
export class CustomerBrowserComponent implements OnInit {
    @Output() CustomerSelect = new EventEmitter<CustomerModel>();
    @ViewChild(CustomersDialogComponent)
    CustomersDialog: CustomersDialogComponent;
    loading: boolean = false;
    display: boolean = false;
    index: number = -1;
    @ViewChild('dt') dataTable: Table;
    @ViewChild('searchCustomer') pInputText: InputText;
    firstMatchingItem: any;
    f4Pressed: boolean;
    isMobile: boolean=false;
    title: string = 'Listado de clientes';

    constructor(
        private customerServices: CustomersService,
        private renderer: Renderer2,
        private auth: AuthService
    ) {
        this.isMobile = this.detectMobile();
    }
    customers: CustomerModel[];
    filterCustomers: CustomerModel[];
    customer: CustomerModel = new CustomerModel();

    ngOnInit() {}

    async _get(sellerId: number) {
        try {
            this.loading = true;
            this.filterCustomers =
                await this.customerServices.getCustomerActive();
            if (sellerId != 0) {
                this.customers = this.filterCustomers.filter(
                    (x) => x.sellerId === sellerId
                );
            }
            Messages.closeLoading();
            this.loading = false;
        } catch (ex) {
            this.loading = false;
            Messages.warning('Advertencia', ex.error.message);
        }
    }


    showDialog(sellerId: number) {
        this._get(sellerId);
        this.display = true;
        if(!this.isMobile){
            setTimeout(
                () => this.renderer.selectRootElement('#searchCustomer').focus(),
                500
            );
        }
    }

    selectCustomer(c: CustomerModel) {
        this.customer = c;
        this.CustomerSelect.emit(this.customer);
        this.display = false;
        this.customer = new CustomerModel();
    }

    selectCustomerEnter(item: any) {
        if (this.firstMatchingItem) {
            this.selectCustomer(this.firstMatchingItem);
        }
    }


    @HostListener('document:keydown', ['$event'])
    handleKeyDownEvent(event: KeyboardEvent): void {
        if (event.key === 'F4') {
            event.preventDefault(); // Previene la acción predeterminada de abrir la ventana de configuración del navegador
            this.f4Pressed = true;
        }
    }

    @HostListener('document:keyup', ['$event'])
    handleKeyUpEvent(event: KeyboardEvent): void {
        if (event.key === 'F4' && this.f4Pressed) {
            this.customers = this.filterCustomers;
            this.f4Pressed = false;
        }
    }

    resetFilter(){
        this.customers = this.filterCustomers;
    }

    private detectMobile(): boolean {
        const userAgent = window.navigator.userAgent.toLowerCase();
        return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
            userAgent
        );
    }

    addCustomer() {
        if (!this.auth.hasPermission('btn_add_customer')) {
            Messages.warning(
                'No tiene acceso',
                'No puede agregar, por favor solicite el acceso'
            );
            return;
        }
        //this.display=false;
        this.CustomersDialog.showDialog(new CustomerModel(), true);
    }

    customerModify(customer) {
        this.filterCustomers = customer;
      //  this.display =true;
    }
}
