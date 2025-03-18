import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user';
import { ReportsService } from '../service/reports.service';
import { AuthService } from 'src/app/service/users/auth.service';
import { Messages } from 'src/app/helpers/messages';
import * as printJS from 'print-js';
import { blobToBase64 } from 'src/app/helpers/helper';
import { SellerModel } from '../../seller/models/seller';
import { SellerService } from '../../seller/service/seller.service';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { FileOpener } from '@capawesome-team/capacitor-file-opener';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-report-sales-margen',
    templateUrl: './report-sales-margen.component.html',
    styleUrls: ['./report-sales-margen.component.scss'],
})
export class ReportSalesMargenComponent implements OnInit {
    user: User;
    loading: boolean = false;
    title: string = 'Reporte de rentabilidad';
    formFilter: FormGroup;
    pdfSrc: any;
    pdfBlob: Blob;
    sellerList: SellerModel[];

    constructor(
        private reportServices: ReportsService,
        private authService: AuthService,
        private formBuilder: FormBuilder,
        private sellerService: SellerService,
        private datePipe: DatePipe,
    ) {
        this.user = this.authService.UserValue;
    }

    ngOnInit(): void {
        this._createFormBuild();
        this.getSeller();
    }

    async downloadPDF() {
        try {
            const fileName = 'documento.pdf';
            const filePath = `${Directory.Cache}/${fileName}`;

            // Convertir Blob a ArrayBuffer
            const arrayBuffer = await this.pdfBlob.arrayBuffer();

            // Escribir el archivo usando el ArrayBuffer directamente
            await Filesystem.writeFile({
              path: filePath,
              data: this.pdfBlob,
              directory: Directory.Cache,
              recursive: true
            });

            // Obtener la ruta completa del archivo
            const fileInfo = await Filesystem.getUri({
              directory: Directory.Cache,
              path: fileName
            });

            // Abrir el archivo con FileOpener
            await FileOpener.openFile({
              path: fileInfo.uri,
              mimeType: 'application/pdf'
            });
        } catch (error) {
            console.error('Error al guardar el archivo:', error);
            // Aquí puedes mostrar un mensaje de error al usuario
        }
    }

    async getSeller() {
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
            from: [
                new Date(),
                Validators.required,
            ],
            to: [
                new Date(),
                Validators.required,
            ],
            sellerId: [0],
        });
    }

    async loadPdf() {
        Messages.loading('Espere', 'Cargando reporte...');
        await this.reportServices
            .getReportSalesMargenPdf(
                this.datePipe.transform(this.formFilter.value.from, 'yyyy-MM-dd'),
                this.datePipe.transform(this.formFilter.value.to, 'yyyy-MM-dd'),
                this.formFilter.value.sellerId
            )
            .subscribe(
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
