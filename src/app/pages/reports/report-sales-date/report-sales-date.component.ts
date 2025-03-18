import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as printJS from 'print-js';
import { blobToBase64 } from 'src/app/helpers/helper';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/service/users/auth.service';
import { ReportsService } from '../service/reports.service';
import { Messages } from 'src/app/helpers/messages';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-report-sales-date',
    templateUrl: './report-sales-date.component.html',
    styleUrls: ['./report-sales-date.component.scss'],
})
export class ReportSalesDateComponent implements OnInit {
    user: User;
    loading: boolean = false;
    title: string = 'Reporte de ventas por fecha';
    formFilter: FormGroup;
    pdfSrc: any;
    pdfBlob: Blob;

    constructor(
        private reportServices: ReportsService,
        private authService: AuthService,
        private formBuilder: FormBuilder,
        private datePipe: DatePipe,
    ) {
        this.user = this.authService.UserValue;
    }

    ngOnInit(): void {
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
            userId: [this.user.userId],
        });
    }

    async getReport() {
        Messages.loading('Espere', 'Cargando reporte...');
        try {
            //this.loading = true;
            await this.reportServices
                .getReportSalesPdf(
                    this.datePipe.transform(this.formFilter.value.from, 'yyyy-MM-dd'),
                    this.datePipe.transform(this.formFilter.value.to, 'yyyy-MM-dd')
                )
                .subscribe(async (blob) => {
                    let base64data = await blobToBase64(blob);
                    printJS({
                        printable: base64data,
                        type: 'pdf',
                        base64: true,
                    });
                    Messages.closeLoading();
                });
            this.loading = false;
        } catch (ex) {
            this.loading = false;
            Messages.warning('Advertencia', ex.message);
        }
    }

    async loadPdf() {
        Messages.loading('Espere', 'Cargando reporte...');
        await this.reportServices
                .getReportSalesPdf(
                    this.formFilter.value.from,
                    this.formFilter.value.to
                ).subscribe(
            (pdfBlob: Blob) => {
                this.pdfBlob = pdfBlob;
                // Opción 1: Usar URL.createObjectURL
                this.pdfSrc = { url: URL.createObjectURL(pdfBlob) };

                this.loading = false;
                Messages.closeLoading();
            },
            (error) => {
                console.error('Error al cargar el PDF', error);
            }
        );
    }

    public base64ToBlob(b64Data, sliceSize = 512) {
        let byteCharacters = atob(b64Data); //data.file there
        let byteArrays = [];
        for (
            let offset = 0;
            offset < byteCharacters.length;
            offset += sliceSize
        ) {
            let slice = byteCharacters.slice(offset, offset + sliceSize);

            let byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
            let byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }
        return new Blob(byteArrays, {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
    }
}
