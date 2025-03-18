import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Messages } from 'src/app/helpers/messages';
import { ReportsService } from '../service/reports.service';
import { AuthService } from 'src/app/service/users/auth.service';
import * as printJS from 'print-js';
import { blobToBase64 } from 'src/app/helpers/helper';
import { User } from 'src/app/models/user';
import { SellerModel } from '../../seller/models/seller';
import { SellerService } from '../../seller/service/seller.service';

@Component({
  selector: 'app-report-cxc-seller',
  templateUrl: './report-cxc-seller.component.html',
  styleUrls: ['./report-cxc-seller.component.scss']
})
export class ReportCxcSellerComponent implements OnInit {
    user: User;
    loading: boolean = false;
    title: string = 'Reporte de cuentas por cobrar por vendedor';
    formFilter: FormGroup;
    sellerList: SellerModel[];
    pdfSrc: any;
    pdfBlob: Blob;

    constructor(
        private reportServices: ReportsService,
        private authService: AuthService,
        private formBuilder: FormBuilder,
        private sellerService: SellerService,
    ) {
        this.user = this.authService.UserValue;

    }

    ngOnInit(): void {
        this._createFormBuild();
        this.getSeller();
    }

    async getSeller(){
        this.sellerList = await this.sellerService.getSeller();
        this.sellerList.unshift({
            sellerId: 0,
            sellerName: 'Todos los vendedores',
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
    }

    _createFormBuild() {
        this.formFilter = this.formBuilder.group({
            sellerId: [
               0
            ],
            onlyOverDue: [false]
        });
    }

    async getReport() {
        Messages.loading('Espere', 'Cargando reporte...');
        await this.loadPdf();
        try {
            //this.loading = true;
            // await this.reportServices
            //     .getReportCxCPdf(
            //         this.formFilter.value.sellerId,
            //     )
            //     .subscribe(async (blob) => {
            //         let base64data = await blobToBase64(blob);
            //         printJS({
            //             printable: base64data,
            //             type: 'pdf',
            //             base64: true,
            //         });
            //         Messages.closeLoading();
            //     });
            this.loading = false;
        } catch (ex) {
            this.loading = false;
            Messages.warning('Advertencia', ex.message);
        }
    }

    async loadPdf() {
        await this.reportServices
        .getReportCxCPdf(
            this.formFilter.value.sellerId,
            this.formFilter.value.onlyOverDue,
        ).subscribe(
            (pdfBlob: Blob) => {
                this.pdfBlob = pdfBlob;
                // Opción 1: Usar URL.createObjectURL
                this.pdfSrc = { url: URL.createObjectURL(pdfBlob) };

                this.loading = false;
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
