import { Component, OnInit } from '@angular/core';
import { CustomerBalanceModel } from '../../models/customer-balance-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomersService } from '../../service/customers.service';
import { Messages } from 'src/app/helpers/messages';
import { PdfBalanceService } from '../service/pdf-balance.service';

@Component({
  selector: 'app-customer-balance',
  templateUrl: './customer-balance.component.html',
  styleUrls: ['./customer-balance.component.scss']
})
export class CustomerBalanceComponent implements OnInit {
    loading: boolean;
    journalList: CustomerBalanceModel[]=[];
    display: boolean;
    formFilter: FormGroup;
    bpId: number;

    constructor(
        private commonService: CustomersService,
        private formBuilder: FormBuilder,
        private pdfGeneratorService: PdfBalanceService
    ) {}

    ngOnInit(): void {
        this._createFormBuild();
    }

    getBackgroundColor(transValue: number): string {
        if (transValue < 0) {
            return '#FFE4B5';
        } else if (transValue > 0) {
            return '#E6F3FF';
        } else {
            return '#FFFFFF';
        }
    }

    _createFormBuild() {
        this.formFilter = this.formBuilder.group({
            from: [
                new Date().toISOString().substring(0, 10),
                Validators.required,
            ],
            to: [
                new Date().toISOString().substring(0, 10),
                Validators.required,
            ]
        });
    }

    async _getData() {
        try {

            this.loading = true;
            this.journalList = await this.commonService.getCustomerBalance(
                this.bpId,
                this.formFilter.value.from,
                this.formFilter.value.to
            );
            Messages.closeLoading();
            this.loading = false;
        } catch (ex) {
            this.loading = false;
            Messages.warning('Advertencia', ex.error.message);
        }
    }

    async showDialog(bpId: number) {
        //   this._getData(bpId);
        this.journalList =[];
        this.bpId = bpId;
        this.display = true;
    }

    downloadPDF() {
        this.pdfGeneratorService.generatePDF(this.journalList,this.formFilter.value.from,
            this.formFilter.value.to);
      }

}
