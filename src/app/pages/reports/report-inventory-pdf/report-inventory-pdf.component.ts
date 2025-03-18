import { Component, OnInit } from '@angular/core';
import { ReportsService } from '../service/reports.service';
import { WareHouseModel } from '../../items/warehouse/models/warehouse';
import { ServiceWareHouseService } from '../../items/warehouse/service/service-ware-house.service';
import { Messages } from 'src/app/helpers/messages';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
    selector: 'app-report-inventory-pdf',
    templateUrl: './report-inventory-pdf.component.html',
    styleUrls: ['./report-inventory-pdf.component.scss'],
})
export class ReportInventoryPdfComponent implements OnInit {
    wareHouseList: WareHouseModel[];
    formFilter: FormGroup;
    loading: boolean = false;
    pdfSrc: any;
    pdfBlob: Blob;
    title:String = "Reporte inventario por familia";

    constructor(private reportService: ReportsService,
        private wareHouseService: ServiceWareHouseService,
        private formBuilder: FormBuilder,
    ) {}

    ngOnInit() {
        this._createFormBuild();
       this._getWareHouse();
    }

    async _getWareHouse() {
        try {
            this.loading = true;
            this.wareHouseList =
                await this.wareHouseService.getWarehouseActive();
            this.wareHouseList.unshift({
                whsCode: 0,
                whsName: 'Todos los almacenes',
                createBy: 2,
                active: true,
                createByName: '',
                createDate: undefined,
                updateBy: 0,
                updateDate: undefined,
            });
            Messages.closeLoading();
            this.loading = false;
        } catch (ex) {
            this.loading = false;
            Messages.warning('Advertencia', ex.error.message);
        }
    }

    _createFormBuild() {
        this.formFilter = this.formBuilder.group({
            whsCode: [
               0
            ],
        });
    }

    loadPdf() {
        this.reportService.getReportInventoryPdf(this.formFilter.value.whsCode).subscribe(
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



    downloadPdf() {
        if (this.pdfBlob) {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(this.pdfBlob);
            link.download = 'reporte_inventario.pdf'; // Nombre del archivo a descargar
            link.click();
            URL.revokeObjectURL(link.href);
        } else {
            console.error('El PDF no está cargado');
        }
    }
}
