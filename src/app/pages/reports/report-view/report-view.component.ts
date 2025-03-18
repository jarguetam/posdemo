import { Component, OnInit } from '@angular/core';
import { ReportsService } from '../service/reports.service';
import { ReportsModel } from '../models/report-model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/service/users/auth.service';
import { User } from 'src/app/models/user';
import { Messages } from 'src/app/helpers/messages';
import * as XLSX from 'xlsx';
interface Column {
    field: string;
    header: string;
    type?: 'date' | 'number' | 'currency' | 'string';
  }

@Component({
    selector: 'app-report-view',
    templateUrl: './report-view.component.html',
    styleUrls: ['./report-view.component.scss'],
})
export class ReportViewComponent implements OnInit {
    loading: boolean = false;
    user: User;
    reportList: ReportsModel[] = [];
    title: string = 'Reporte varios';
    formFilter: FormGroup;
    reportData: any[] = [];
    columns: Column[] = [];
    globalFilterFields: string[] = [];
    titleReport: string = '';

    constructor(
        private service: ReportsService,
        private authService: AuthService,
        private formBuilder: FormBuilder
    ) {
        this.user = this.authService.UserValue;
    }

    async ngOnInit(): Promise<void> {
        this._createFormBuild();
        this.reportList = await this.service.getReportList();
        this.reportList.unshift({
            id: 0,
            name: 'Seleccione el reporte',
            params: false,
            viewName: '',
        });
    }

    _createFormBuild() {
        this.formFilter = this.formBuilder.group({
            reportId: [0],
        });
    }

    async getReport() {
        Messages.loading('Espere', 'Cargando reporte...');
        try {
          const selectedReport = this.reportList.find(
            (r) => r.viewName ===this.formFilter.value.reportId
          );
          if (selectedReport && selectedReport.viewName) {
            this.reportData = await this.service.getDataFromView(
              selectedReport.viewName
            );
            if (this.reportData.length > 0) {
              this.columns = Object.keys(this.reportData[0]).map(
                (key) => ({
                  field: key,
                  header: key.charAt(0).toUpperCase() + key.slice(1),
                  type: this.getColumnType(key, this.reportData[0][key])
                })
              );
              this.globalFilterFields = this.columns.map((col) => col.field);
            }
            this.titleReport = selectedReport.name;
          }
          Messages.closeLoading();
        } catch (ex: any) {
          this.loading = false;
          Messages.warning('Advertencia', ex.message);
        }
      }

      getColumnType(key: string, value: any): 'date' | 'number' | 'currency' | 'string' {
        if (value instanceof Date) return 'date';
        if (typeof value === 'string'){
            return key.toLowerCase().includes('fecha') ? 'date' : 'string';
        }
        if (typeof value === 'number') {
          // Puedes ajustar esta lógica según tus necesidades específicas
          return key.toLowerCase().includes('price') || key.toLowerCase().includes('total') || key.toLowerCase().includes('pago')? 'currency' : 'number';
        }
        return 'string';
      }
    exportToExcel() {
        Messages.loading('Exportando', 'Espere un momento...');
        try {
            // Usar las columnas dinámicas para crear los encabezados
            const headers = {};
            this.columns.forEach(col => {
                headers[col.field] = col.header;
            });

            // Crear una matriz de objetos que contengan solo los valores de propiedad que se van a exportar
            const exportData = this.reportData.map((item) => {
                const row = {};
                this.columns.forEach(col => {
                    row[headers[col.field]] = item[col.field];
                });
                return row;
            });

            // Crear un libro de trabajo de Excel
            const workbook = XLSX.utils.book_new();

            // Convertir la matriz de datos en una hoja de trabajo de Excel
            const worksheet = XLSX.utils.json_to_sheet(exportData);

            // Agregar la hoja de trabajo al libro de trabajo
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

            // Guardar el archivo Excel
            XLSX.writeFile(workbook, `${this.titleReport}.xlsx`);

            Messages.closeLoading();
        } catch (error) {
            Messages.closeLoading();
        }
    }
}
