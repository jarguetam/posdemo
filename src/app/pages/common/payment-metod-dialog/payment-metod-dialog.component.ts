import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PaymentMetodModel } from '../models/payment-metod-model';

@Component({
    selector: 'app-payment-metod-dialog',
    templateUrl: './payment-metod-dialog.component.html',
    styleUrls: ['./payment-metod-dialog.component.scss'],
})
export class PaymentMetodDialogComponent implements OnInit {
    @Output() PaymentMetod = new EventEmitter<PaymentMetodModel>();
    payments: PaymentMetodModel;
    formPayment: FormGroup;
    isAdd: boolean= true;
    disabled: boolean = false;
    loading: boolean = false;
    display: boolean = false;
    totalPay: number = 0;
    saldo: number = 0;
    constructor(private formBuilder: FormBuilder) {}

    ngOnInit(): void {}

    _createForm(){
        this.formPayment = this.formBuilder.group({
            cashSum: [this.payments.cashSum ?? 0],
            chekSum: [this.payments.chekSum ?? 0],
            transferSum: [this.payments.transferSum ?? 0],
            cardSum: [this.payments.cardSum ?? 0],
        });
    }

    async showDialog(total: number) {
        this.payments = new PaymentMetodModel();
        this.totalPay = total;
        this.display = true;
        this._createForm();
    }

    selectMetod(){
        let newMetods = this.formPayment.value as PaymentMetodModel;
        this.PaymentMetod.emit(newMetods);
        this.display = false;
    }

    updateSaldo = () => {
        setTimeout(() => {
            const { cardSum, cashSum, chekSum, transferSum } = this.formPayment.value as PaymentMetodModel;
            this.saldo = this.calcularDiferenciaPago(cardSum, cashSum, chekSum, transferSum);
        }, 500);
    }

    calcularDiferenciaPago(cardSum, cashSum, chekSum, transferSum) {
        return this.totalPay - cardSum - cashSum - chekSum - transferSum;
    }


}
