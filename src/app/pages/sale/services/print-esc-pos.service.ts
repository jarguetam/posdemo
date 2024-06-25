import { Injectable } from '@angular/core';
import { CommonService } from 'src/app/service/common.service';
import { DocumentSaleModel } from '../models/document-model';
import EscPosEncoder from 'esc-pos-encoder-ionic';
import { Messages } from 'src/app/helpers/messages';
import { PrinterConectionService } from 'src/app/service/printer-conection.service';

@Injectable({
    providedIn: 'root',
})
export class PrintEscPosService {
    printerCharacteristic;
    documentModel: DocumentSaleModel;

    constructor(
        private commonService: CommonService,
        private conectPrinter: PrinterConectionService
    ) {}

    async printInvoice(document: DocumentSaleModel) {
        let print = await Messages.question(
            'Impresion',
            '¿Desea imprimir la factura?'
        );
        if (print) {
            Messages.loading('Facturando', 'Imprimiendo documento...');
            await this.connectPrinter(document);
            Messages.closeLoading();
        }
    }

    async sendToPrint(document: DocumentSaleModel) {

        await this.generateHeader(document);

        await this.generateDetail(document);

        await this.generateFooter(document);

    }

    async generateHeader(document: DocumentSaleModel) {
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
        //await this.await100ms();

        await this.printToPrinter(companyEncoder);

        const invoiceEncoder = new EscPosEncoder()
            .initialize()
            .codepage('cp437')
            .newline()
            .line('Factura: ' + document.deiNumber.toString())
            .line(
                'Fecha de factura: ' +
                    new Date(document.docDate).toLocaleDateString('es-HN')
            )
            .line(
                'Fecha de vencimiento: ' +
                    new Date(document.dueDate).toLocaleDateString('es-HN')
            )
            .line(
                'Cliente: ' +
                    document.customerCode +
                    '-' +
                    document.customerName
            )
            .line('R.T.N: ' + document.customerRTN.toString())
            //.line('Direccion: ' + document.customerAddress)
            .line('Termino de pago: ' + document.payConditionName)
            .line('Referencia: ' + document.reference)
            .newline()
            .encode();

        await this.printToPrinter(invoiceEncoder);

        const detailHeader = new EscPosEncoder()
            .initialize()
            .codepage('cp437')
            .bold()
            .line('='.repeat(48)) // Línea horizontal
            .line('Descripcion               Cant.   Precio  Total ')
            .line('='.repeat(48)) // Línea horizontal
            .encode();

        await this.printToPrinter(detailHeader);
    }

    async generateDetail(document: DocumentSaleModel) {
        const detail = [
            ...(document.detailDto && document.detailDto.length > 0
                ? document.detailDto
                : document.detail),
        ];
        for (const item of detail) {
            const itemNameColumn = item.itemName.padEnd(40);
            const quantityColumn = item.quantity.toString().padStart(30);
            const priceColumn = parseFloat(item.price.toString())
                .toFixed(2)
                .toString()
                .padStart(8);
            const lineTotalColumn = parseFloat(item.lineTotal.toString())
                .toFixed(2)
                .toString()
                .padStart(10);

            const detailItems = new EscPosEncoder()
                .initialize()
                .codepage('cp437')
                .bold()
                .line(itemNameColumn)
                .line(`${quantityColumn}${priceColumn}${lineTotalColumn}`)
                .encode();
            await this.printToPrinter(detailItems);
        }
    }

    async generateFooter(document: DocumentSaleModel) {
        const subTotal = parseFloat(document.subTotal.toString())
            .toFixed(2)
            .toString()
            .padEnd(8);
        const descuento = parseFloat(document.discountsTotal.toString())
            .toFixed(2)
            .toString()
            .padStart(8);
        const impuesto = parseFloat(document.tax.toString())
            .toFixed(2)
            .toString()
            .padStart(8);
        const total = parseFloat(document.docTotal.toString())
            .toFixed(2)
            .toString()
            .padStart(8);

        const footer = new EscPosEncoder()
            .initialize()
            .codepage('cp437')
            .newline()
            .line('*****************ULTIMA LINEA******************')
            .align('right')
            .line('Subtotal ' + subTotal)
            .line('Descuento ' + descuento)
            .line('Impuesto ' + impuesto)
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
            .line('CAI: ' + document.cai)
            .line(
                'Rango de facturacion: ' +
                    document.authorizedRangeFrom +
                    ' Al ' +
                    document.authorizedRangeTo
            )
            .line(
                'Fecha Limite Emision ' +
                    new Date(document.limitIssue).toLocaleDateString('es-HN')
            )
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

    async await100ms(): Promise<void> {
        await new Promise((resolve) => setTimeout(resolve, 100));
    }

    async connectPrinter(document: DocumentSaleModel) {
        try {
            if (this.conectPrinter.isPrinterConect) {
               await this.sendToPrint(document); // Iniciar impresión después de la conexión
            } else {
                await this.conectPrinter.connectPrinter();
                if (this.conectPrinter.isPrinterConect) {
                    await this.sendToPrint(document);
                }
            }
        } catch (error) {
            Messages.warning('Error durante la impresión:', error);
        }
    }

    async printToPrinter(result) {
        if (this.conectPrinter.printerCharacteristic != null) {
            const MAX_CHUNK_SIZE = 32; // Tamaño del chunk reducido a 32 bytes
            const DELAY_BETWEEN_CHUNKS = 50; // Retraso de 50 milisegundos entre chunks

            for (let offset = 0; offset < result.byteLength; offset += MAX_CHUNK_SIZE) {
                const chunk = result.slice(offset, offset + MAX_CHUNK_SIZE);

                try {
                    await this.conectPrinter.printerCharacteristic.writeValue(chunk);

                    // Agregar un retraso entre cada chunk para permitir que el dispositivo procese
                    await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_CHUNKS));
                } catch (error) {
                    Messages.warning(
                        'Error al imprimir',
                        'Ocurrió un error al imprimir, por favor vuelva a conectar la impresora. ' + error
                    );
                    // Opcionalmente podrías intentar reconectar la impresora aquí si es necesario
                }
            }
        }
    }


}
