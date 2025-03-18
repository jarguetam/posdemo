import { Injectable } from '@angular/core';
import { PaymentSaleModel } from '../models/payment-sale-model';
import { CommonService } from 'src/app/service/common.service';
import { Messages } from 'src/app/helpers/messages';
import EscPosEncoder from 'esc-pos-encoder-ionic';
import { PrinterConectionService } from 'src/app/service/printer-conection.service';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class PrintEscPaymentService {
    constructor(
        private commonService: CommonService,
        private conectPrinter: PrinterConectionService,
        private router: Router
    ) {}

    async printInvoice(document: PaymentSaleModel): Promise<void> {
        const shouldPrint = await this.confirmPrint();
        if (shouldPrint) {
            await this.ensurePrinterConnected();
            await this.sendToPrint(document);
        }
    }

    private async confirmPrint(): Promise<boolean> {
        return await Messages.question('Impresión', '¿Desea imprimir la factura?');
    }

    private async ensurePrinterConnected(): Promise<void> {
        Messages.loading('Impresión', 'Conectando a la impresora...');
        if (!this.conectPrinter.isPrinterConnected) {
            this.router.navigate(['/bluetooth-device-selector']);
            throw new Error('Printer not connected');
        }
    }

    private async sendToPrint(document: PaymentSaleModel): Promise<void> {
        try {
            await this.generateHeader(document);
            await this.generateDetail(document);
            await this.generateFooter(document);
        } finally {
            Messages.closeLoading();
        }
    }

    private async generateHeader(document: PaymentSaleModel): Promise<void> {
        const companyInfo = await this.commonService.companyInfo();
        const companyEncoder = new EscPosEncoder()
            .initialize()
            .codepage('cp437')
            .line(companyInfo.companyName)
            .newline()
            .line('RTN: ' + companyInfo.rtn)
            .line(companyInfo.addressLine1)
            .line(companyInfo.addressLine2)
            .line(companyInfo.email1)
            .encode();

        await this.printToPrinter(companyEncoder);

        const invoiceEncoder = new EscPosEncoder()
            .initialize()
            .codepage('cp437')
            .newline()
            .line('Pago N°: ' + document.docId.toString())
            .line('Fecha de pago: ' + new Date(document.docDate).toLocaleDateString('es-HN'))
            .line('Cliente: ' + document.customerCode + '-' + document.customerName)
            .line('Termino de pago: ' + document.payConditionName)
            .line('Referencia: ' + document.reference)
            .newline()
            .encode();

        await this.printToPrinter(invoiceEncoder);

        const detailHeader = new EscPosEncoder()
            .initialize()
            .codepage('cp437')
            .bold()
            .line('------------------------------------------------')
            .line('Factura          Vencimiento     Pago      Saldo')
            .line('------------------------------------------------')
            .encode();

        await this.printToPrinter(detailHeader);
    }

    private async generateDetail(document: PaymentSaleModel): Promise<void> {
        const detail = document.detail || [];
        for (const item of detail) {
            const detailItems = new EscPosEncoder()
                .initialize()
                .codepage('cp437')
                .line(this.formatDetailLine(item))
                .encode();

            await this.printToPrinter(detailItems);
        }
    }

    private formatDetailLine(item: any): string {
        const invoiceNum = item.invoiceId.toString().padEnd(20);
        const dueDate = new Date(item.dueDate).toLocaleDateString('es-HN').padStart(8);
        const sumApplied = item.sumApplied.toFixed(2).toString().padStart(11);
        const saldo = Math.max(item.balance - item.sumApplied, 0).toFixed(2).toString().padStart(8);
        return `${invoiceNum}${dueDate}${sumApplied}${saldo}`;
    }

    private async generateFooter(document: PaymentSaleModel): Promise<void> {
        const total = document.docTotal.toFixed(2).toString().padStart(8);
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
            .align('left')
            .line('Comentario: ' + document.comment)
            .newline()
            .encode();

        await this.printToPrinter(footer2);

        const footer3 = new EscPosEncoder()
            .initialize()
            .codepage('cp437')
            .newline()
            .align('left')
            .line(document.createByName)
            .line('__________________')
            .newline()
            .line('Elaborado Por')
            .newline()
            .encode();

        await this.printToPrinter(footer3);
    }

    private async printToPrinter(data: Uint8Array): Promise<void> {
        if (!this.conectPrinter.isPrinterConnected) {
            await this.handlePrinterNotConnected();
            return;
        }

        try {
            await this.sendDataInChunks(data);
        } catch (error) {
            await this.handlePrintError(error);
        }
    }

    private async handlePrinterNotConnected(): Promise<void> {
        await Messages.warning('Error', 'No hay una impresora conectada. Por favor, seleccione una impresora primero.');
        this.router.navigate(['/bluetooth-device-selector']);
    }

    private async sendDataInChunks(data: Uint8Array): Promise<void> {
        const MAX_CHUNK_SIZE = 32;
        const chunks = this.splitDataIntoChunks(data, MAX_CHUNK_SIZE);

        for (const chunk of chunks) {
            await this.conectPrinter.printData(new DataView(chunk.buffer));
        }
    }

    private splitDataIntoChunks(data: Uint8Array, chunkSize: number): Uint8Array[] {
        const chunks: Uint8Array[] = [];
        for (let i = 0; i < data.length; i += chunkSize) {
            chunks.push(data.slice(i, i + chunkSize));
        }
        return chunks;
    }

    private async handlePrintError(error: any): Promise<void> {
        console.error('Error de impresión:', error);
        await Messages.warning(
            'Error al imprimir',
            'Ocurrió un error al imprimir, por favor vuelva a conectar la impresora.'
        );
    }
}
