import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Messages } from 'src/app/helpers/messages';
import { SupplierModel } from 'src/app/pages/suppliers/models/supplier';
import { SuppliersService } from 'src/app/pages/suppliers/service/suppliers.service';

@Component({
  selector: 'app-supplier-browser',
  templateUrl: './supplier-browser.component.html',
  styleUrls: ['./supplier-browser.component.scss']
})
export class SupplierBrowserComponent implements OnInit {
    @Output() SupplierSelect = new EventEmitter<SupplierModel>();
    loading: boolean = false;
    display: boolean = false;
    index: number = -1;

    constructor(private supplierServices: SuppliersService) {}
    suppliers: SupplierModel[];
    supplier: SupplierModel = new SupplierModel();

    ngOnInit(): void {
      //  this._get();
    }

    async _get() {
        try {
            this.loading = true;
            this.suppliers = await this.supplierServices.getSupplierActive();
            Messages.closeLoading();
            this.loading = false;
        } catch (ex) {
            this.loading = false;
            Messages.warning('Advertencia', ex.error.message);
        }
    }

    showDialog() {
        this._get();
        this.display = true;
    }

    selectSupplier(c: SupplierModel) {
        this.supplier = c;
        this.SupplierSelect.emit(this.supplier);
        this.display = false;
        this.supplier = new SupplierModel();
    }

}
