import { Injectable } from '@angular/core';
import { PaymentSaleModel } from '../models/payment-sale-model';
import { CommonService } from 'src/app/service/common.service';
import { Messages } from 'src/app/helpers/messages';
import EscPosEncoder from 'esc-pos-encoder-ionic';

@Injectable({
    providedIn: 'root',
})
export class PrintEscPaymentService {
    printerCharacteristic;
    documentModel: PaymentSaleModel;

    constructor(private commonService: CommonService) {}

    async printInvoice(document: PaymentSaleModel) {
        debugger
        Messages.loading('Impresion', 'Imprimiendo documento...');
        await this.connectPrinter(document);
        Messages.closeLoading();
    }

    async sendToPrint(document: PaymentSaleModel) {
        await this.await100ms();
        await this.generateHeader(document);
        await this.await100ms();
        await this.generateDetail(document);
        await this.await100ms();
        await this.generateFooter(document);
        await this.await100ms();
    }

    async generateHeader(document: PaymentSaleModel) {
        const companyInfo = await this.commonService.companyInfo();
        const companyEncoder = new EscPosEncoder()
            .initialize()
            .codepage('cp852')
            .line(companyInfo.companyName)
            .newline()
            .line('RTN: ' + companyInfo.rtn)
            .line(companyInfo.addressLine1)
            .line(companyInfo.addressLine2)
            .line(companyInfo.email1)
            .encode();
        await this.await100ms();

        await this.printToPrinter(companyEncoder);

        const invoiceEncoder = new EscPosEncoder()
            .initialize()
            .codepage('cp852')
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
        await this.await100ms();

        await this.printToPrinter(invoiceEncoder);

        const detailHeader = new EscPosEncoder()
            .initialize()
            .codepage('cp852')
            .bold()
            .line('------------------------------------------------') // Línea horizontal
            .line('Factura          Vencimiento     Total      Pago')
            .line('------------------------------------------------') // Línea horizontal
            .encode();
        await this.await100ms();
        await this.printToPrinter(detailHeader);
    }
    async generateDetail(document: PaymentSaleModel) {
        const detail = document.detail ? [...document.detail] : [];
        await this.await100ms();
        for (const item of detail) {
            await this.await100ms();
            const invoiceNum = item.invoiceId.toString().padEnd(20);
            const dueDate =new Date(item.dueDate).toLocaleDateString('es-HN').padStart(8);
            const lineTotal = item.lineTotal.toFixed(2).toString().padStart(8);
            const sumApplied = item.sumApplied.toFixed(2).toString().padStart(11);
            const detailItems = new EscPosEncoder()
                .initialize()
                .codepage('cp852')
                .line(
                    `${invoiceNum}${dueDate}${lineTotal}${sumApplied}`
                )
                .encode();
            await this.await100ms();
            await this.printToPrinter(detailItems);
        }
    }

    async generateFooter(document: PaymentSaleModel) {
        const total = document.docTotal.toFixed(2).toString().padStart(8);
        const footer = new EscPosEncoder()
            .initialize()
            .codepage('cp852')
            .newline()
            .line('*****************ULTIMA LINEA******************')
            .align('right')
            .line('Total ' + total)
            .newline()
            .encode();
        await this.await100ms();
        await this.printToPrinter(footer);

        const footer2 = new EscPosEncoder()
            .initialize()
            .codepage('cp852')
            .newline()
            .align('left')
            .line('Comentario: ' + document.comment)
            .newline()
            .encode();
        await this.await100ms();
        await this.printToPrinter(footer2);

        const footer3 = new EscPosEncoder()
            .initialize()
            .codepage('cp852')
            .newline()
            .align('left')
            .line(document.createByName)
            .line('__________________')
            .newline()
            .line('Elaborado Por')
            .newline()
            .encode();
        await this.await100ms();
        await this.printToPrinter(footer3);
    }

    async await100ms(): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    async connectPrinter(document: PaymentSaleModel) {
        try {
            if (!this.printerCharacteristic) {
                const mobileNavigatorObject: any = window.navigator;
                if (mobileNavigatorObject && mobileNavigatorObject.bluetooth) {
                    const device = await mobileNavigatorObject.bluetooth.requestDevice({
                        filters: [{ services: ['000018f0-0000-1000-8000-00805f9b34fb'] }],
                    });
                    const server = await device.gatt.connect();
                    const service = await server.getPrimaryService('000018f0-0000-1000-8000-00805f9b34fb');
                    this.printerCharacteristic = await service.getCharacteristic('00002af1-0000-1000-8000-00805f9b34fb');
                    debugger
                    this.sendToPrint(document); // Iniciar impresión después de la conexión
                }
            } else {
                this.sendToPrint(document);
            }
        } catch (error) {
            Messages.warning('Error durante la impresión:', error);
        }
    }

    async printToPrinter(result) {
        await this.await100ms();
        if (this.printerCharacteristic != null) {
            const MAX_CHUNK_SIZE = 128;
            for (
                let offset = 0;
                offset < result.byteLength;
                offset += MAX_CHUNK_SIZE
            ) {
                const chunk = result.slice(offset, offset + MAX_CHUNK_SIZE);
                try {
                    // await this.await100ms();
                    await this.printerCharacteristic.writeValue(chunk);
                } catch (error) {
                    Messages.warning(
                        'Error al imprimir',
                        'Ocurrio un error al imprimir, favor vuelva a conectar la impresora.'
                    );
                }
            }
        }
    }
}
