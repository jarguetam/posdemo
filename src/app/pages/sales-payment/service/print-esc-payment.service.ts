import { Injectable } from '@angular/core';
import { PaymentSaleModel } from '../models/payment-sale-model';
import { CommonService } from 'src/app/service/common.service';
import { Messages } from 'src/app/helpers/messages';
import EscPosEncoder from 'esc-pos-encoder-ionic';
import { PrinterConectionService } from 'src/app/service/printer-conection.service';

@Injectable({
    providedIn: 'root',
})
export class PrintEscPaymentService {
    printerCharacteristic;
    documentModel: PaymentSaleModel;

    constructor(
        private commonService: CommonService,
        private conectPrinter: PrinterConectionService
    ) {}

    async printInvoice(document: PaymentSaleModel) {
        let print = await Messages.question(
            'Impresion',
            '¿Desea imprimir la factura?'
        );
        if (print) {
            Messages.loading('Impresion', 'Imprimiendo documento...');
            await this.connectPrinter(document);
            Messages.closeLoading();
        }
    }

    async sendToPrint(document: PaymentSaleModel) {
        await this.generateHeader(document);

        await this.generateDetail(document);

        await this.generateFooter(document);
    }

    async generateHeader(document: PaymentSaleModel) {
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
            .line(
                'Fecha de pago: ' +
                    new Date(document.docDate).toLocaleDateString('es-HN')
            )
            .line(
                'Cliente: ' +
                    document.customerCode +
                    '-' +
                    document.customerName
            )
            .line('Termino de pago: ' + document.payConditionName)
            .line('Referencia: ' + document.reference)
            .newline()
            .encode();

        await this.printToPrinter(invoiceEncoder);

        const detailHeader = new EscPosEncoder()
            .initialize()
            .codepage('cp437')
            .bold()
            .line('------------------------------------------------') // Línea horizontal
            .line('Factura          Vencimiento     Pago      Saldo')
            .line('------------------------------------------------') // Línea horizontal
            .encode();

        await this.printToPrinter(detailHeader);
    }
    async generateDetail(document: PaymentSaleModel) {
        const detail = document.detail ? [...document.detail] : [];
        for (const item of detail) {
            const invoiceNum = item.invoiceId.toString().padEnd(20);
            const dueDate = new Date(item.dueDate)
                .toLocaleDateString('es-HN')
                .padStart(8);
            const lineTotal = item.lineTotal.toFixed(2).toString().padStart(8);
            let result = (item.balance - item.sumApplied).toFixed(2).toString();
            const saldo = result.padStart(8);
            const sumApplied = item.sumApplied
                .toFixed(2)
                .toString()
                .padStart(11);
            const detailItems = new EscPosEncoder()
                .initialize()
                .codepage('cp437')
                .line(`${invoiceNum}${dueDate}${sumApplied}${saldo}`)
                .encode();

            await this.printToPrinter(detailItems);
        }
    }

    async generateFooter(document: PaymentSaleModel) {
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

    async await100ms(): Promise<void> {
        await new Promise((resolve) => setTimeout(resolve, 100));
    }

    async connectPrinter(document: PaymentSaleModel) {
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
