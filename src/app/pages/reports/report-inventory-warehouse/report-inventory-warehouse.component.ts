import { Component, OnInit } from '@angular/core';
import { Messages } from 'src/app/helpers/messages';
import { AuthService } from 'src/app/service/users/auth.service';
import * as XLSX from 'xlsx';
import { InventoryReportModel } from '../models/inventory-report-model';
import { ReportsService } from '../service/reports.service';
@Component({
  selector: 'app-report-inventory-warehouse',
  templateUrl: './report-inventory-warehouse.component.html',
  styleUrls: ['./report-inventory-warehouse.component.scss']
})
export class ReportInventoryWarehouseComponent implements OnInit {

    loading: boolean = false;
    title: string = 'Reporte de existencias de inventario por almacen';
    stockList: InventoryReportModel[];
    constructor(
        private accountService: ReportsService,
        private auth: AuthService
    ) {}

    ngOnInit(): void {
        this.search();
    }

    async search() {
        try {
            this.loading = true;
            this.stockList = await this.accountService.getInventoryWarehouseReport();
            Messages.closeLoading();
            this.loading = false;
        } catch (ex) {
            this.loading = false;
            Messages.warning('Advertencia', ex.message);
        }
    }

    exportToExcel() {
        Messages.loading('Exportando', 'Espere un momento...');
        const headers = {
            itemCode: 'Codigo',
            itemName: 'Descripcion',
            quantity: 'Cantidad',
            whsName: 'Almacen',
            avgPrice: 'Costo',
            costTotal: 'Valor Total',
        };
        // crea una matriz de objetos que contengan solo los valores de propiedad que se van a exportar
        const exportData = this.stockList.map((item) => {
            const row = {};
            Object.keys(headers).forEach((key) => {
                row[headers[key]] = item[key];
            });
            return row;
        });

        // crea un libro de trabajo de Excel
        const workbook = XLSX.utils.book_new();

        // convierte la matriz de datos en una hoja de trabajo de Excel
        const worksheet = XLSX.utils.json_to_sheet(exportData);

        // agrega la hoja de trabajo al libro de trabajo
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

        // guarda el archivo Excel en el disco
        XLSX.writeFile(workbook, 'Existencia de inventario por almacen.xlsx');
        Messages.closeLoading();
    }

}
