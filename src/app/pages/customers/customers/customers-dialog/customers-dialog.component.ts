import { SellerModel } from './../../../seller/models/seller';
import {
    Component,
    EventEmitter,
    OnInit,
    Output,
    ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Messages } from 'src/app/helpers/messages';
import { User } from 'src/app/models/user';
import { SellerService } from 'src/app/pages/seller/service/seller.service';
import { CommonService } from 'src/app/service/common.service';
import { AuthService } from 'src/app/service/users/auth.service';
import { CustomerModel } from '../../models/customer';
import { CustomersService } from '../../service/customers.service';
import { PayCondition } from 'src/app/models/paycondition';
import { CustomerCategoryModel } from '../../models/category';
import { PriceListModel } from '../../models/pricelist';
import { ViewJornalBpDialogComponent } from 'src/app/pages/common/view-jornal-bp-dialog/view-jornal-bp-dialog.component';
import { ZoneModel } from '../../models/zone-model';
import { FrequencyModel } from '../../models/frequency-model';
import { SellerRegion } from 'src/app/pages/seller/models/seller-region';

@Component({
    selector: 'app-customers-dialog',
    templateUrl: './customers-dialog.component.html',
    styleUrls: ['./customers-dialog.component.scss'],
})
export class CustomersDialogComponent implements OnInit {
    @Output() CustomerModify = new EventEmitter<CustomerModel[]>();
    @ViewChild(ViewJornalBpDialogComponent)
    ViewJornalBpDialog: ViewJornalBpDialogComponent;
    customer: CustomerModel;
    isAdd: boolean;
    formCustomer: FormGroup;
    loading: boolean = false;
    display: boolean = false;
    usuario: User;
    sellerList: SellerModel[];
    payConditionList: PayCondition[];
    categoryList: CustomerCategoryModel[];
    priceList: PriceListModel[];
    zoneList: ZoneModel[];
    frequencyList: FrequencyModel[];
    regionList: SellerRegion[];

    constructor(
        private fb: FormBuilder,
        private customerService: CustomersService,
        private authService: AuthService,
        private sellerService: SellerService,
        private commonService: CommonService
    ) {
        this.usuario = this.authService.UserValue;
    }

    ngOnInit(): void {

    }

    showDialog(customer: CustomerModel, isAdd: boolean) {
        this.new();
        this.isAdd = isAdd;
        this.customer = customer;
        this.customer.rtn ='0101199999999'
        this.customer.email = 'default@pos.com'
        this.customer.phone ='99889988'
        this.customer.address ='Principal'
        this._createFormBuild();
        this.display = true;
        this._getData();
    }

    showBpJornal() {
        if (!this.authService.hasPermission('btn_history')) {
            Messages.warning(
                'No tiene acceso',
                'No puede ver historial de transacciones, por favor solicite el acceso.'
            );
            return;
        }
        this.ViewJornalBpDialog.showDialog(this.customer.customerId, 'C');
    }

    async _getData() {
        try {
            this.loading = true;
            this.sellerList = await this.sellerService.getSeller();
            this.sellerList.unshift({
                sellerId: 0,
                sellerName: 'Seleccione la ruta',
                whsCode: 0,
                whsName: '',
                regionId: 0,
                regionName: '',
                createByName: '',
                createBy: 0,
                createDate: undefined,
                updateBy: 0,
                updateDate: undefined,
                active: true,
            });
            Messages.closeLoading();
            this.loading = false;
        } catch (ex) {
            this.loading = false;
            Messages.warning('Advertencia', ex.error.message);
        }
        try {
            this.loading = true;
            this.payConditionList =
                await this.commonService.getPayConditionActive();
            this.payConditionList.unshift({
                payConditionId: 0,
                payConditionName: 'Seleccione la condicion de pago',
                payConditionDays: 0,
                createBy: 0,
                createByName: '',
                createDate: undefined,
                updateBy: 0,
                updateDate: undefined,
                active: true,
            });
            Messages.closeLoading();
            this.loading = false;
        } catch (ex) {
            this.loading = false;
            Messages.warning('Advertencia', ex.error.message);
        }
        try {
            this.loading = true;
            this.categoryList =
                await this.customerService.getCustomerCategoryActive();
            this.categoryList.unshift({
                customerCategoryId: 0,
                customerCategoryName: 'Seleccione la categoria',
                createBy: 0,
                createByName: '',
                createDate: undefined,
                updateBy: 0,
                updateDate: undefined,
                active: true,
            });
            Messages.closeLoading();
            this.loading = false;
        } catch (ex) {
            this.loading = false;
            Messages.warning('Advertencia', ex.error.message);
        }
        try {
            this.loading = true;
            this.priceList = await this.customerService.getPriceListActive();
            this.priceList.unshift({
                listPriceId: 0,
                listPriceName: 'Seleccione la lista de precio',
                porcentGain: 0,
                createBy: 0,
                createByName: '',
                createDate: undefined,
                updateBy: 0,
                updateDate: undefined,
                active: true,
            });
            Messages.closeLoading();
            this.loading = false;
        } catch (ex) {
            this.loading = false;
            Messages.warning('Advertencia', ex.error.message);
        }
        try {
            this.loading = true;
            this.zoneList = await this.customerService.getZone();
            this.zoneList.unshift({
                id: 0,
                zoneName: 'Seleccione la Zona'
            });
            Messages.closeLoading();
            this.loading = false;
        } catch (ex) {
            this.loading = false;
            Messages.warning('Advertencia', ex.error.message);
        }
        try {
            this.loading = true;
            this.frequencyList = await this.customerService.getFrequency();
            this.frequencyList.unshift({
                id: 0,
                frequencyName: 'Seleccione la frecuencia'
            });
            Messages.closeLoading();
            this.loading = false;
        } catch (ex) {
            this.loading = false;
            Messages.warning('Advertencia', ex.error.message);
        }
        try {
            this.loading = true;
            this.regionList = await this.sellerService.getSellerRegion();
            this.regionList.unshift({
                regionId: 0,
                nameRegion: 'Seleccione Vendedor',
                createBy: 0,
                createByName: '',
                createDate: undefined,
                updateBy: 0,
                updateDate: undefined,
                active: false
            });
            Messages.closeLoading();
            this.loading = false;
        } catch (ex) {
            this.loading = false;
            Messages.warning('Advertencia', ex.error.message);
        }
    }

    _createFormBuild() {
        this.formCustomer = this.fb.group({
            customerId: [this.customer.customerId ?? 0],
            customerName: [
                this.customer.customerName ?? '',
                Validators.required,
            ],
            balance: [this.customer.balance ?? 0],
            rtn: [
                this.customer.rtn ?? '',
                Validators.compose([
                    Validators.required,
                    Validators.minLength(13),
                    Validators.maxLength(14),
                    Validators.pattern('[0-9]*'),
                ]),
            ],
            phone: [
                this.customer.phone ?? '',
                Validators.compose([
                    Validators.required,
                    Validators.minLength(8),
                    Validators.maxLength(8),
                    Validators.pattern('^((\\+91-?)|0)?[0-9]{8}$'),
                ]),
            ],
            email: [this.customer.email ?? '', Validators.required],
            address: [this.customer.address ?? '', Validators.required],
            sellerId: [this.customer.sellerId ?? '', Validators.required],
            customerCategoryId: [
                this.customer.customerCategoryId ?? '',
                Validators.required,
            ],
            payConditionId: [
                this.customer.payConditionId ?? '',
                Validators.required,
            ],
            listPriceId: [this.customer.listPriceId ?? '', Validators.required],
            creditLine: [this.customer.creditLine ?? 0],
            tax: [this.customer.tax ?? true],
            createBy: [this.customer.createBy ?? this.usuario.userId],
            active: [this.customer.active ?? false],
            limitInvoiceCredit: [this.customer.limitInvoiceCredit ?? 0 ],
            contactPerson: [this.customer.contactPerson ?? '', Validators.required],
            purchase: [this.customer.purchase ?? 0],
            frequencyId: [this.customer.frequencyId ?? 0],
            zoneId: [this.customer.zoneId ?? 0 ],
            regionId: [this.customer.regionId ?? 0 ],
        });
        this.formCustomer.controls['balance'].disable({ onlySelf: false });
    }

    new() {
        this.customer = undefined;
        this.formCustomer = undefined;
    }

    async add() {
        if (this.formCustomer.valid) {
            try {
                Messages.loading('Agregando', 'Agregando cliente');
                let request = this.formCustomer.value as CustomerModel;
                let region = await this.customerService.addCustomer(request);
                Messages.closeLoading();
                Messages.Toas('Agregando Correctamente');
                this.CustomerModify.emit(region);
                this.display = false;
            } catch (ex) {
                Messages.closeLoading();
                Messages.warning('Advertencia', ex.error.message);
            }
        }
    }
    async edit() {
        if (this.formCustomer.valid) {
            try {
                Messages.loading('Editando', 'Editando cliente');
                let request = this.formCustomer.value as CustomerModel;
                let users = await this.customerService.editCustomer(request);
                Messages.closeLoading();
                Messages.Toas('Editado Correctamente');
                this.CustomerModify.emit(users);
                this.display = false;
            } catch (ex) {
                Messages.closeLoading();
                Messages.warning('Advertencia', ex.error.message);
            }
        }
    }
}
