import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Messages } from 'src/app/helpers/messages';
import { AuthService } from 'src/app/service/users/auth.service';
import { DocumentModel } from '../../purchase/models/document';
import { ReportsService } from '../service/reports.service';
import * as XLSX from 'xlsx';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-report-purchase',
    templateUrl: './report-purchase.component.html',
    styleUrls: ['./report-purchase.component.scss'],
})
export class ReportPurchaseComponent implements OnInit {
    loading: boolean = false;
    title: string = 'Reporte de compras por fecha';
    invoiceList: DocumentModel[];
    formFilter: FormGroup;
    constructor(
        private reportService: ReportsService,
        private auth: AuthService,
        private formBuilder: FormBuilder,
        private datePipe: DatePipe,
    ) {}

    ngOnInit() {
        this._createFormBuild();
    }

    _createFormBuild() {
        this.formFilter = this.formBuilder.group({
            from: [
                new Date(),
                Validators.required,
            ],
            to: [
                new Date(),
                Validators.required,
            ],
        });
    }

    async search() {
        try {
            this.loading = true;
            this.invoiceList = await this.reportService.getPurchaseByDate(
                this.datePipe.transform(this.formFilter.value.from, 'yyyy-MM-dd'),
                this.datePipe.transform(this.formFilter.value.to, 'yyyy-MM-dd')
            );
            Messages.closeLoading();
            this.loading = false;
        } catch (ex) {
            this.loading = false;
            Messages.warning('Advertencia', ex.message);
        }
    }

    exportToExcel() {
        Messages.loading('Exportando', 'Espere un momento...');

        const title = 'Reporte de compras';
        const subtitle = `Desde: ${this.formFilter.value.from} Hasta: ${this.formFilter.value.to}`;

        // crea una matriz de objetos que contengan solo los valores de propiedad que se van a exportar
        const headers = {
            docId: 'N° Factura',
            docDate: 'Fecha',
            supplierCode: 'Codigo',
            supplierName: 'Descripcion',
            payConditionName: 'Condicion de pago',
            docTotal: 'Total',
            createByName: 'Creado por',
        };
        const exportData = this.invoiceList.map((item) => {
            const row = {};
            Object.keys(headers).forEach((key) => {
                row[headers[key]] = item[key];
            });
            return row;
        });

        // crea una hoja de trabajo de Excel
        const worksheet = XLSX.utils.sheet_add_json({}, exportData, {
            skipHeader: true,
            origin: { r: 4, c: 0 },
        });

        // agregar título y subtítulo en la misma hoja de trabajo
        XLSX.utils.sheet_add_aoa(
            worksheet,
            [[title], [], [subtitle], [], Object.values(headers)],
            { origin: { r: 0, c: 0 } }
        );

        // crear un nuevo libro de trabajo y agregar la hoja de trabajo
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

        // guarda el archivo Excel en el disco
        XLSX.writeFile(workbook, 'Reporte de compras.xlsx');

        Messages.closeLoading();
    }
}
