import { Injectable } from '@angular/core';
import { CommonService } from 'src/app/service/common.service';
import { DocumentSaleModel } from '../models/document-model';
import EscPosEncoder from 'esc-pos-encoder-ionic';
import { Messages } from 'src/app/helpers/messages';
import { PrinterConectionService } from 'src/app/service/printer-conection.service';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class PrintEscPosService {
    constructor(
        private commonService: CommonService,
        private conectPrinter: PrinterConectionService,
        private router: Router
    ) {}

    async printInvoice(document: DocumentSaleModel, typeDocument: string): Promise<void> {
        const shouldPrint = await this.confirmPrint(typeDocument);
        if (shouldPrint) {
            await this.ensurePrinterConnected();
            await this.sendToPrint(document, typeDocument);
        }
    }

    private async confirmPrint(typeDocument: string): Promise<boolean> {
        return await Messages.question('Impresión', `¿Desea imprimir ${typeDocument}?`);
    }

    private async ensurePrinterConnected(): Promise<void> {
        Messages.loading('Impresión', 'Conectando a la impresora...');
        if (!this.conectPrinter.isPrinterConnected) {
            Messages.closeLoading();
            this.router.navigate(['/bluetooth-device-selector']);
            throw new Error('Error: Printer not connected');
        }
    }

    private async sendToPrint(document: DocumentSaleModel, typeDocument: string): Promise<void> {
        try {
            await this.generateHeader(document, typeDocument);
            await this.generateDetail(document);
            await this.generateFooter(document);
        } finally {
            Messages.closeLoading();
        }
    }

    private async generateHeader(document: DocumentSaleModel, typeDocument: string): Promise<void> {
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

        const documentId = typeDocument === 'Factura' ? document.deiNumber.toString() : document.docId.toString();

        const invoiceEncoder = new EscPosEncoder()
            .initialize()
            .codepage('cp437')
            .newline()
            .line(`${typeDocument}: ${documentId}`)
            .line(`Fecha de ${typeDocument}: ${new Date(document.docDate).toLocaleDateString('es-HN')}`)
            .line(`Fecha de vencimiento: ${new Date(document.dueDate).toLocaleDateString('es-HN')}`)
            .line(`Cliente: ${document.customerCode}-${document.customerName}`)
            .line(`R.T.N: ${document.customerRTN}`)
            .line(`Termino de pago: ${document.payConditionName}`)
            .line(`Referencia: ${document.reference}`)
            .newline()
            .encode();

        await this.printToPrinter(invoiceEncoder);

        const detailHeader = new EscPosEncoder()
            .initialize()
            .codepage('cp437')
            .bold()
            .line('='.repeat(48))
            .line('Descripcion               Cant.   Precio  Total ')
            .line('='.repeat(48))
            .encode();

        await this.printToPrinter(detailHeader);
    }

    private async generateDetail(document: DocumentSaleModel): Promise<void> {
        const detail = document.detailDto?.length > 0 ? document.detailDto : document.detail;

        for (const item of detail) {
            const detailItems = new EscPosEncoder()
                .initialize()
                .codepage('cp437')
                .bold()
                .line(item.itemName.padEnd(40))
                .line(`${item.quantity.toString().padStart(30)}${parseFloat(item.price.toString()).toFixed(2).padStart(8)}${parseFloat(item.lineTotal.toString()).toFixed(2).padStart(10)}`)
                .encode();
            await this.printToPrinter(detailItems);
        }
    }

    private async generateFooter(document: DocumentSaleModel): Promise<void> {
        const footer = new EscPosEncoder()
            .initialize()
            .codepage('cp437')
            .newline()
            .line('*****************ULTIMA LINEA******************')
            .align('right')
            .line(`Subtotal ${parseFloat(document.subTotal.toString()).toFixed(2).padEnd(8)}`)
            .line(`Descuento ${parseFloat(document.discountsTotal.toString()).toFixed(2).padStart(8)}`)
            .line(`Impuesto ${parseFloat(document.tax.toString()).toFixed(2).padStart(8)}`)
            .line(`Total ${parseFloat(document.docTotal.toString()).toFixed(2).padStart(8)}`)
            .newline()
            .encode();
        await this.printToPrinter(footer);

        const footer2 = new EscPosEncoder()
            .initialize()
            .codepage('cp437')
            .newline()
            .align('left')
            .line(`Comentario: ${document.comment}`)
            .line(`CAI: ${document.cai}`)
            .line(`Rango de facturacion: ${document.authorizedRangeFrom} Al ${document.authorizedRangeTo}`)
            .line(`Fecha Limite Emision ${new Date(document.limitIssue).toLocaleDateString('es-HN')}`)
            .newline()
            .encode();
        await this.printToPrinter(footer2);

        const footer3 = new EscPosEncoder()
            .initialize()
            .codepage('cp437')
            .newline()
            .align('left')
            .line(document.sellerName)
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
