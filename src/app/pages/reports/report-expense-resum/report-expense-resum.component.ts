import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Messages } from 'src/app/helpers/messages';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/service/users/auth.service';
import { SellerModel } from '../../seller/models/seller';
import { SellerService } from '../../seller/service/seller.service';
import { ReportsService } from '../service/reports.service';
import { DatePipe } from '@angular/common';
import { Directory, Filesystem } from '@capacitor/filesystem';

@Component({
  selector: 'app-report-expense-resum',
  templateUrl: './report-expense-resum.component.html',
  styleUrls: ['./report-expense-resum.component.scss']
})
export class ReportExpenseResumComponent implements OnInit {
    user: User;
    loading: boolean = false;
    title: string = 'Reporte de gastos resumido';
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
            from: [
                new Date(),
                Validators.required,
            ],
            to: [
                new Date(),
                Validators.required,
            ],
            sellerId: [
                0
             ],
        });
    }


    async loadPdf() {
        Messages.loading('Espere', 'Cargando reporte...');
        await this.reportServices
                .getReportExpensePdf(
                    this.datePipe.transform(this.formFilter.value.from, 'yyyy-MM-dd'),
                    this.datePipe.transform(this.formFilter.value.to, 'yyyy-MM-dd'),
                    this.formFilter.value.sellerId,
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

    async handleDownload(event: any) {
        try {
          await Filesystem.writeFile({
            path: 'documento.pdf',
            data: this.pdfBlob,
            directory: Directory.Documents
          });
        } catch (error) {
          console.error('Error al descargar:', error);
        }
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
