import {
    Component,
    ElementRef,
    EventEmitter,
    OnInit,
    Output,
    Renderer2,
    ViewChild,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Messages } from 'src/app/helpers/messages';
import { User } from 'src/app/models/user';
import { SellerModel } from 'src/app/pages/seller/models/seller';
import { SellerService } from 'src/app/pages/seller/service/seller.service';
import { AuthService } from 'src/app/service/users/auth.service';
import { LiquidationDetailModel } from '../../models/liquidation-detail-model';
import { LiquidationModel } from '../../models/liquidation-model';
import { LiquidationService } from '../../services/liquidation.service';
import { LiquidationViewModel } from '../../models/liquidation-view-model';
import { SalesService } from 'src/app/pages/sale/services/sales.service';
import { InvoiceSaleDialogComponent } from 'src/app/pages/sale/invoice/invoice-sale-dialog/invoice-sale-dialog.component';

@Component({
    selector: 'app-liquidation-dialog',
    templateUrl: './liquidation-dialog.component.html',
    styleUrls: ['./liquidation-dialog.component.scss'],
})
export class LiquidationDialogComponent implements OnInit {
    @Output() LiquidationModify = new EventEmitter<LiquidationModel[]>();
    @ViewChild(InvoiceSaleDialogComponent)
    InvoiceSaleDialog: InvoiceSaleDialogComponent;
    liquidation: LiquidationModel = new LiquidationModel();
    isAdd: boolean;
    disabled: boolean = false;
    formLiquidation: FormGroup;
    loading: boolean = false;
    usuario: User;
    doctotal: number = 0;
    detail: LiquidationDetailModel[] = [];
    index = 1;
    display: boolean;
    sellerList: SellerModel[];
    detailView: LiquidationViewModel[] = [];
    totalCredit: number = 0;
    totalCounted: number = 0;
    totalSales: number = 0;
    totalPaid: number = 0;
    totalExpense: number = 0;
    totalIncome: number = 0;
    totalDeposit: number = 0;
    totalDifference: number = 0;
    displayDialog: boolean = false;

    constructor(
        private formBuilder: FormBuilder,
        private liquidationService: LiquidationService,
        private auth: AuthService,
        private sellerService: SellerService,
        private salesServices: SalesService
    ) {
        this.usuario = this.auth.UserValue;
    }
    ngOnInit(): void {}

    async _getSellers() {
        try {
            this.loading = true;
            this.sellerList = await this.sellerService.getSeller();
            this.sellerList.unshift({
                sellerId: 0,
                sellerName: 'Seleccione el vendedor',
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
    }

    async search() {
        try {
            this.loading = true;
            this.detailView =
                await this.liquidationService.getLiquidationDetail(
                    this.formLiquidation.value.from,
                    this.formLiquidation.value.to,
                    this.formLiquidation.value.sellerId
                );
            this.liquidation.detail = this.detailView.map((viewModel) => {
                const detailModel: LiquidationDetailModel = {
                    liquidationDetailId: viewModel.id,
                    liquidationId: 0,
                    docNum: viewModel.docNum,
                    docType: viewModel.docType,
                    reference: viewModel.reference,
                    docDate: viewModel.docDate,
                    customerCode: viewModel.customerCode,
                    customerName: viewModel.customerName,
                    docTotal: viewModel.docTotal,
                };
                return detailModel;
            });
            this.calculateTotal();
            Messages.closeLoading();
            this.loading = false;
        } catch (ex) {
            this.loading = false;
            Messages.warning('Advertencia', ex.message);
        }
    }

    calculateTotal() {
        this.calculateTotalByType('Factura Credito', 'totalCredit');
        this.calculateTotalByType('Factura Contado', 'totalCounted');
        this.totalSales = this.roundToTwoDecimals(
            this.totalCredit + this.totalCounted
        );
        this.calculateTotalByType('Pago Recibido', 'totalPaid');
        this.calculateTotalByType('Gasto', 'totalExpense');
        this.totalIncome = this.roundToTwoDecimals(
            this.totalCounted + this.totalPaid - this.totalExpense
        );

        this.updateFormValues();
        // this.depositField.input.nativeElement.focus();
        // this.renderer.selectRootElement('#deposit').focus();
        //  setTimeout(() =>
        //  this.depositField.nativeElement.click(), 1);
    }

    calculateTotalByType(docType: string, totalProp: string) {
        this[totalProp] = this.detailView
            .filter((invoice) => invoice.docType === docType)
            .reduce((total, invoice) => total + invoice.docTotal, 0);
    }

    roundToTwoDecimals(value: number): number {
        return Math.round(value * 100) / 100;
    }

    updateFormValues() {
        this.formLiquidation.patchValue(
            {
                saleCredit: this.roundToTwoDecimals(this.totalCredit),
                saleCash: this.roundToTwoDecimals(this.totalCounted),
                saleTotal: this.totalSales,
                paidTotal: this.roundToTwoDecimals(this.totalPaid),
                expenseTotal: this.roundToTwoDecimals(this.totalExpense),
                total: this.totalIncome,
                totalDifference: this.totalDifference,
            },
            { emitEvent: false }
        );
    }

    showDialog(liquidationNew: LiquidationModel, isAdd: boolean) {
        this.display = true;
        this.new();
        this.isAdd = isAdd;
        this.disabled = false;
        this.liquidation = liquidationNew;
        this.detail = liquidationNew.detail;
        this.detailView =[];
        if (!isAdd) {
            this.index = liquidationNew.detail.length;
            this.detailView = liquidationNew.detail.map((viewModel) => {
                const detailModel: LiquidationViewModel = {
                    docTotal: viewModel.docTotal,
                    customerName: viewModel.customerName,
                    customerCode: viewModel.customerCode,
                    docDate: viewModel.docDate,
                    reference: viewModel.reference,
                    docType: viewModel.docType,
                    docNum: viewModel.docNum,
                    id: 0,
                    sellerId: liquidationNew.sellerId,
                };
                return detailModel;
            });
            this.totalCounted = liquidationNew.saleCash;
            this.totalCredit = liquidationNew.saleCredit;
            this.totalSales = liquidationNew.saleTotal;
            this.totalPaid = liquidationNew.paidTotal;
            this.totalIncome = liquidationNew.total;
            this.totalExpense = liquidationNew.expenseTotal;
            this.totalDeposit = liquidationNew.deposit;
            this.totalDifference = liquidationNew.totalDifference;
        }
        this._getSellers();
        this._createFormBuild();
    }

    _createFormBuild() {
        const currentDate = new Date();
        const localDateString = new Date(currentDate.getTime() - currentDate.getTimezoneOffset() * 60000).toISOString().substring(0, 10);
        this.formLiquidation = this.formBuilder.group({
            idLiquidation: [this.liquidation.idLiquidation ?? 0],
            sellerId: [this.liquidation.sellerId ?? 0],
            from: [
                localDateString,
                Validators.required,
            ],
            to: [
                localDateString,
                Validators.required,
            ],
            saleCredit: [this.liquidation.saleCredit ?? 0],
            saleCash: [this.liquidation.saleCash ?? 0],
            saleTotal: [this.liquidation.saleTotal ?? 0],
            paidTotal: [this.liquidation.paidTotal ?? 0],
            expenseTotal: [this.liquidation.expenseTotal ?? 0],
            total: [this.liquidation.total ?? ''],
            deposit: [this.liquidation.deposit ?? 0],
            totalDifference: [this.liquidation.totalDifference ?? 0],
            active: [this.liquidation.active ?? 0],
            createdBy: [this.liquidation.createdBy ?? this.usuario.userId],
            detail: [[]],
        });
        this.calculateDifferences();
    }

    new() {
        this.liquidation = undefined;
        this.formLiquidation = undefined;
    }

    calculateDifferences() {
        this.formLiquidation
            .get('deposit')
            .valueChanges.subscribe((deposit: number) => {
                if (deposit) {
                    const totalDifference = Number(
                        deposit - this.totalIncome
                    ).toFixed(2);
                    this.formLiquidation.patchValue(
                        { totalDifference },
                        { emitEvent: false }
                    );
                }
            });
        this.updateFormValues();
    }

    async add() {
        if (this.formLiquidation.valid) {
            try {
                Messages.loading('Agregando', 'Agregando liquidacion');

                let newEntry = this.formLiquidation.value as LiquidationModel;
                newEntry.detail = this.liquidation.detail;
                let liquidation = await this.liquidationService.addLiquidation(
                    newEntry
                );
                this.initVariables();
                Messages.closeLoading();
                Messages.Toas('Agregado Correctamente');
                this.LiquidationModify.emit(liquidation);
                this.display = false;
                this.index = 0;
            } catch (ex) {
                Messages.closeLoading();
                Messages.warning('Advertencia', ex.error.message);
            }
        }
    }

    async edit() {
        if (this.formLiquidation.valid) {
            try {
                Messages.loading('Agregando', 'Editando liquidacion');
                let newEntry = this.formLiquidation.value as LiquidationModel;
                let newLine = this.liquidation.detail.filter(
                    (x) => x.liquidationId == 0
                );
                newLine.forEach(
                    (x) => (x.liquidationId = newEntry.idLiquidation)
                );
                newLine.forEach((x) => (x.liquidationDetailId = 0));
                this.detail = this.detail.filter((x) => x.liquidationId != 0);
                //this.detail.push(...newLine);
                newEntry.detail = this.detail;
                //newEntry.total = this.doctotal;

                let liquidation = await this.liquidationService.editLiquidation(
                    newEntry
                );
                this.initVariables();
                Messages.closeLoading();
                Messages.Toas('Editado Correctamente');
                this.LiquidationModify.emit(liquidation);
                this.display = false;
                this.index = 0;
            } catch (ex) {
                Messages.closeLoading();
                Messages.warning('Advertencia', ex.error.message);
            }
        }
    }

    async cancel() {
        if (this.formLiquidation.valid) {
            let cancel = await Messages.question(
                'Cancelacion',
                'Cancelar esta liquidacion es irreversible. ¿Seguro desea continuar?'
            );
            if (cancel) {
                try {
                    Messages.loading('Cancelando', 'Anulando liquidacion');
                    let newEntry = this.formLiquidation
                        .value as LiquidationModel;
                    newEntry.detail = this.detail;
                    let liquidation =
                        await this.liquidationService.cancelLiquidation(
                            newEntry
                        );
                    this.initVariables();
                    Messages.closeLoading();
                    Messages.Toas('Anulado Correctamente');
                    this.LiquidationModify.emit(liquidation);
                    this.display = false;
                    this.index = 0;
                } catch (ex) {
                    Messages.closeLoading();
                    Messages.warning('Advertencia', ex.error.message);
                }
            }
        }
    }

    initVariables() {
        this.detailView = [];
        this.totalCounted = 0;
        this.totalCredit = 0;
        this.totalSales = 0;
        this.totalPaid = 0;
        this.totalIncome = 0;
        this.totalExpense = 0;
        this.totalDeposit = 0;
        this.totalDifference = 0;
    }


    async viewInvoice(docNum: number, docType: string){
        if(docType.includes('Factura')){
            Messages.loading('Factura','Cargando');
            let invoice = await this.salesServices.getInvoiceById(docNum);
            Messages.closeLoading();
            this.InvoiceSaleDialog.showDialog(invoice[0], false);
            this.openDialog();
        }
    }

    openDialog(): void {
        this.displayDialog = true;
      }

      closeDialog(): void {
        this.displayDialog = false;
      }
}
