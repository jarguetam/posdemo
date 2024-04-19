import { Component, OnInit } from '@angular/core';
import { SupplierAccountModel } from '../models/supplier-account-model';
import { SupplierAccountService } from '../services/supplier-account.service';
import { AuthService } from 'src/app/service/users/auth.service';
import { Messages } from 'src/app/helpers/messages';
import * as XLSX from 'xlsx';

@Component({
    selector: 'app-supplier-account-list',
    templateUrl: './supplier-account-list.component.html',
    styleUrls: ['./supplier-account-list.component.scss'],
})
export class SupplierAccountListComponent implements OnInit {
    loading: boolean = false;
    title: string = 'Cuentas por pagar proveedores';
    accountList: SupplierAccountModel[];
    constructor(
        private accountService: SupplierAccountService,
        private auth: AuthService
    ) {}

    ngOnInit(): void {
        this.search();
    }

    getBalanceStyle(balance: number) {
        return balance !== 0 ? {'color': 'red'} : {};
      }

    async search() {
        try {
            this.loading = true;
            this.accountList = await this.accountService.getAccountSupplier();
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
            supplierCode: 'Codigo',
            supplierName: 'Proveedor',
            payConditionName: 'Condicion',
            invoiceNumber: 'N° Fact.',
            dueDate: 'Fecha vencimiento',
            unexpiredBalance: 'Saldo Sin vencer',
            balanceDue: 'Saldo Vencido',
            balanceAt30Days: 'Saldo a 30 dias',
            balanceFrom31To60Days: 'Saldo de 31 a 60 dias',
            balanceFrom61To90Days: 'Saldo de 61 a 90 dias',
            balanceFrom91To120Days: 'Saldo de 91 a 120 dias',
            balanceMoreThan120Days: 'Saldo +120 dias',
            daysExpired: 'Dias vencidos',
        };
        // crea una matriz de objetos que contengan solo los valores de propiedad que se van a exportar
        const exportData = this.accountList.map((item) => {
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
        XLSX.writeFile(workbook, 'Cuentas por pagar proveedores.xlsx');
        Messages.closeLoading();
    }
}
