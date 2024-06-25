import { Component, OnInit } from '@angular/core';
import { Messages } from 'src/app/helpers/messages';
import { AuthService } from 'src/app/service/users/auth.service';
import { CustomerAccountModel } from '../models/customer-account-model';
import { CustomerAccountService } from '../services/customer-account.service';
import * as XLSX from 'xlsx';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-customer-account-list',
  templateUrl: './customer-account-list.component.html',
  styleUrls: ['./customer-account-list.component.scss']
})
export class CustomerAccountListComponent implements OnInit {

    loading: boolean = false;
    title: string = 'Cuentas por cobrar clientes';
    accountList: CustomerAccountModel[];
    totalBalanceFrom61To90Days: number = 0;
    totalBalanceDue: number;
    totalBalanceAt30Days: number;
    totalBalanceFrom31To60Days: number;
    totalBalanceFrom91To120Days: number;
    totalBalanceMoreThan120Days: number;
    totalunexpiredBalance: number;
    usuario: User;
    constructor(
        private accountService: CustomerAccountService,
        private auth: AuthService
    ) {
        this.usuario = this.auth.UserValue;
    }

    ngOnInit(): void {
        this.search();
    }

    getBalanceStyle(balance: number) {
        return balance !== 0 ? {'color': 'red'} : {};
      }

    async search() {
        try {
            this.loading = true;
            this.accountList = await this.accountService.getAccountCustomer();
            if (this.usuario.roleId != 1) {
                this.accountList = this.accountList.filter(
                    (x) => x.sellerId === this.usuario.sellerId
                );
            }
            this.calcularTotales();
            Messages.closeLoading();
            this.loading = false;
        } catch (ex) {
            this.loading = false;
            Messages.warning('Advertencia', ex.message);
        }
    }

    calcularTotales(): void {
        this.totalBalanceFrom61To90Days = this.accountList.reduce(
          (total, order) => total + order.balanceFrom61To90Days, 0
        );
        this.totalunexpiredBalance = this.accountList.reduce(
            (total, order) => total + order.unexpiredBalance, 0
          );
        this.totalBalanceDue = this.accountList.reduce(
          (total, order) => total + order.balanceDue, 0
        );

        this.totalBalanceAt30Days = this.accountList.reduce(
          (total, order) => total + order.balanceAt30Days, 0
        );

        this.totalBalanceFrom31To60Days = this.accountList.reduce(
          (total, order) => total + order.balanceFrom31To60Days, 0
        );

        this.totalBalanceFrom91To120Days = this.accountList.reduce(
          (total, order) => total + order.balanceFrom91To120Days, 0
        );

        this.totalBalanceMoreThan120Days = this.accountList.reduce(
          (total, order) => total + order.balanceMoreThan120Days, 0
        );
      }


    exportToExcel() {
        Messages.loading('Exportando', 'Espere un momento...');
        const headers = {
            customerCode: 'Codigo',
            customerName: 'cliente',
            sellerName: 'Vendedor',
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
        XLSX.writeFile(workbook, 'Cuentas por cobrar clientes.xlsx');
        Messages.closeLoading();
    }

}
