import { Injectable } from '@angular/core';
import { DocumentSaleModel } from '../../models/document-model';
import { CommonService } from 'src/app/service/common.service';
import { PrinterConectionService } from 'src/app/service/printer-conection.service';
import { Messages } from 'src/app/helpers/messages';
import EscPosEncoder from 'esc-pos-encoder-ionic';
import { GroupedCustomer, PrintBalance } from '../model/grouped-customer';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class PrintBalanceService {
    printerCharacteristic;
    documentModel: DocumentSaleModel;
    customer: PrintBalance = new PrintBalance();
    constructor(
        private commonService: CommonService,
        private conectPrinter: PrinterConectionService,
        private router: Router
    ) {}

    async printEsc(
        groupedCustomer: GroupedCustomer,
        details: DocumentSaleModel[]
    ) {
        this.customer.customer = groupedCustomer;
        this.customer.detail = details;

        await this.printInvoice(this.customer);
    }

    async printInvoice(document: PrintBalance) {
        let print = await Messages.question(
            'Impresion',
            '¿Desea imprimir el estado de cuenta?'
        );
        if (print) {
            Messages.loading('Impresion', 'Imprimiendo documento...');
            if (!this.conectPrinter.isPrinterConnected) {
                // Navegar a la pantalla de selección de dispositivos
                this.router.navigate(['/bluetooth-device-selector']);
                return;
            }
            await this.sendToPrint(document);
            Messages.closeLoading();
        }
    }

    async sendToPrint(document: PrintBalance) {
        await this.generateHeader(document);
        await this.generateDetail(document);
        await this.generateFooter(document);
    }

    async generateHeader(document: PrintBalance) {
        const companyInfo = await this.commonService.companyInfo();
        const companyEncoder = new EscPosEncoder()
            .initialize()
            .codepage('cp437')
            .line(companyInfo.companyName)
            .newline()

            .encode();

        await this.printToPrinter(companyEncoder);

        const invoiceEncoder = new EscPosEncoder()
            .initialize()
            .codepage('cp437')
            .newline()
            .line('CUENTAS POR COBRAR')
            .line('Fecha: ' + new Date().toLocaleDateString('es-HN'))
            .newline()
            .line(
                'Cliente: ' +
                    document.customer.customerCode +
                    '-' +
                    document.customer.customerName
            )
            .newline()
            .encode();

        await this.printToPrinter(invoiceEncoder);

        const detailHeader = new EscPosEncoder()
            .initialize()
            .codepage('cp437')
            .bold()
            .line('------------------------------------------------') // Línea horizontal
            .line('Fact.  Fecha    Vencimiento   Original     Saldo')
            .line('------------------------------------------------') // Línea horizontal
            .encode();

        await this.printToPrinter(detailHeader);
    }

    async generateDetail(document: PrintBalance) {
        const detail = document.detail ? [...document.detail] : [];
        for (const item of detail) {
            const invoiceNum = item.docId.toString().padEnd(5);
            const dueDate = this.formatDate(new Date(item.dueDate), 12);
            const docDate = this.formatDate(new Date(item.docDate), 10);
            // Formateo de lineTotal
            const lineTotal = this.formatCurrency(item.docTotal, 10);
            // Formateo de saldo
            const saldo = this.formatCurrency(item.balance, 10);

            const detailItems = new EscPosEncoder()
                .initialize()
                .codepage('cp437')
                .line(`${invoiceNum}${docDate}${dueDate}${lineTotal}${saldo}`)
                .encode();

            await this.printToPrinter(detailItems);
        }
    }

    private formatCurrency(amount: number, width: number): string {
        return amount
            .toLocaleString('es-HN', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
                useGrouping: true,
            })
            .padStart(width);
    }

    private formatDate(date: Date, width: number): string {
        return date.toLocaleDateString('es-HN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).padStart(width);
    }


    async generateFooter(document: PrintBalance) {

        const total =  this.formatCurrency(document.customer.totalBalance, 8);

        const footer = new EscPosEncoder()
            .initialize()
            .codepage('cp437')
            .newline()
            .line('*****************ULTIMA LINEA******************')
            .align('right')
            .line('Total ' + total)
            .newline()
            .encode();

        await this.printToPrinter(footer);

        const footer2 = new EscPosEncoder()
            .initialize()
            .codepage('cp437')
            .newline()
            .newline()
            .encode();

        await this.printToPrinter(footer2);

        const footer3 = new EscPosEncoder()
            .initialize()
            .codepage('cp437')
            .newline()
            .align('left')
            .newline()
            .encode();

        await this.printToPrinter(footer3);
    }

    async await100ms(): Promise<void> {
        await new Promise((resolve) => setTimeout(resolve, 100));
    }

    // async connectPrinter(document: PrintBalance) {
    //     try {
    //         if (this.conectPrinter.isPrinterConnected) {
    //             await this.sendToPrint(document); // Iniciar impresión después de la conexión
    //         } else {
    //             await this.conectPrinter.connectPrinter();
    //             if (this.conectPrinter.isPrinterConnected) {
    //                 await this.sendToPrint(document);
    //             }
    //         }
    //     } catch (error) {
    //         Messages.warning('Error durante la impresión:', error);
    //     }
    // }

    async printToPrinter(result: Uint8Array) {
        if (!this.conectPrinter.isPrinterConnected) {
            Messages.warning('Error', 'No hay una impresora conectada. Por favor, seleccione una impresora primero.');
            this.router.navigate(['/bluetooth-device-selector']);
            return;
        }

        const MAX_CHUNK_SIZE = 32;
        const DELAY_BETWEEN_CHUNKS = 50;

        for (let offset = 0; offset < result.byteLength; offset += MAX_CHUNK_SIZE) {
            const chunk = result.slice(offset, offset + MAX_CHUNK_SIZE);
            const dataView = new DataView(chunk.buffer);

            try {
                await this.conectPrinter.printData(dataView);
                await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_CHUNKS));
            } catch (error) {
                Messages.warning(
                    'Error al imprimir',
                    'Ocurrió un error al imprimir, por favor vuelva a conectar la impresora. ' + error
                );
                break;
            }
        }
    }
}
