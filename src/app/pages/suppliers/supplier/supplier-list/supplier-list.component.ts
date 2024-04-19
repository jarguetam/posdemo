import { Component, OnInit, ViewChild } from '@angular/core';
import { Messages } from 'src/app/helpers/messages';
import { AuthService } from 'src/app/service/users/auth.service';
import { SupplierModel } from '../../models/supplier';
import { SuppliersService } from '../../service/suppliers.service';
import { SupplierDialogComponent } from '../supplier-dialog/supplier-dialog.component';
import { ViewJornalBpDialogComponent } from 'src/app/pages/common/view-jornal-bp-dialog/view-jornal-bp-dialog.component';

@Component({
    selector: 'app-supplier-list',
    templateUrl: './supplier-list.component.html',
    styleUrls: ['./supplier-list.component.scss'],
})
export class SupplierListComponent implements OnInit {
    @ViewChild(SupplierDialogComponent) SupplierDialog: SupplierDialogComponent;
    @ViewChild(ViewJornalBpDialogComponent)
    ViewJornalBpDialog: ViewJornalBpDialogComponent;
    title: string = 'Listado de proveedores';
    supplierList: SupplierModel[];
    loading: boolean = false;
    constructor(
        private supplierService: SuppliersService,
        private auth: AuthService
    ) {}

    ngOnInit(): void {
        this._getSupplier();
    }

    async _getSupplier() {
        try {
            this.loading = true;
            this.supplierList = await this.supplierService.getSupplier();
            Messages.closeLoading();
            this.loading = false;
        } catch (ex) {
            this.loading = false;
            Messages.warning('Advertencia', ex.error.message);
        }
    }

    supplierModify(supplier) {
        this.supplierList = supplier;
    }

    editSupplier(supplier: SupplierModel) {
        if (!this.auth.hasPermission('btn_edit_supplier')) {
            Messages.warning(
                'No tiene acceso',
                'No puede editar por favor solicite el acceso'
            );
            return;
        }
        this.SupplierDialog.showDialog(supplier, false);
    }

    addSupplier() {
        if (!this.auth.hasPermission('btn_add_supplier')) {
            Messages.warning(
                'No tiene acceso',
                'No puede agregar, por favor solicite el acceso'
            );
            return;
        }
        this.SupplierDialog.showDialog(new SupplierModel(), true);
    }

    showBpJornal(supplierId: number) {
        if (!this.auth.hasPermission('btn_history')) {
            Messages.warning(
                'No tiene acceso',
                'No puede ver historial de transacciones, por favor solicite el acceso.'
            );
            return;
        }
        this.ViewJornalBpDialog.showDialog(supplierId,'P');
    }
}
