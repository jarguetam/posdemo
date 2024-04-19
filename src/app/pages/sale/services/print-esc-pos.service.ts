import { Injectable } from '@angular/core';
import { CommonService } from 'src/app/service/common.service';
import { DocumentSaleModel } from '../models/document-model';
import EscPosEncoder from 'esc-pos-encoder-ionic';
import { Messages } from 'src/app/helpers/messages';

@Injectable({
    providedIn: 'root',
})
export class PrintEscPosService {
    printerCharacteristic;
    documentModel: DocumentSaleModel;

    constructor(private commonService: CommonService) {}

    async printInvoice(document: DocumentSaleModel) {
        Messages.loading('Facturando', 'Imprimiendo documento...');
        await this.connectPrinter(document);
        Messages.closeLoading();
    }

    async sendToPrint(document: DocumentSaleModel) {
        await this.await100ms();
        await this.generateHeader(document);
        await this.await100ms();
        await this.generateDetail(document);
        await this.await100ms();
        await this.generateFooter(document);
        await this.await100ms();
    }

    async generateHeader(document: DocumentSaleModel) {
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
            .line('Direccion: ' + document.customerAddress)
            .line('Termino de pago: ' + document.payConditionName)
            .line('Referencia: ' + document.reference)
            .newline()
            .encode();
        await this.await100ms();

        await this.printToPrinter(invoiceEncoder);

        const detailHeader = new EscPosEncoder()
            .initialize()
            .codepage('cp852')
            .line('------------------------------------------------') // Línea horizontal
            .line('Descripcion               Cant.   Precio  Total')
            .line('------------------------------------------------') // Línea horizontal
            .encode();
        await this.await100ms();
        await this.printToPrinter(detailHeader);
    }
    async generateDetail(document: DocumentSaleModel) {
        const detail = document.detailDto ? [...document.detailDto] : [];
        await this.await100ms();
        for (const item of detail) {
            await this.await100ms();
            const itemNameColumn = item.itemName.padEnd(20);
            const quantityColumn = item.quantity.toString().padStart(8);
            const priceColumn = parseFloat(item.price.toString()).toFixed(2).toString().padStart(8);
            const lineTotalColumn = parseFloat(item.lineTotal.toString()).toFixed(2).toString().padStart(11);

            const detailItems = new EscPosEncoder()
                .initialize()
                .codepage('cp852')
                .line(
                    `${itemNameColumn}${quantityColumn}${priceColumn}${lineTotalColumn}`
                )
                .encode();
            await this.await100ms();
            await this.printToPrinter(detailItems);
            await this.await100ms();
        }
    }

    async generateFooter(document: DocumentSaleModel) {
        const subTotal = parseFloat(document.subTotal.toString()).toFixed(2).toString().padEnd(8);
        const descuento = parseFloat(document.discountsTotal.toString()).toFixed(2).toString().padStart(8);
        const impuesto = parseFloat(document.tax.toString()).toFixed(2).toString().padStart(8);
        const total = parseFloat(document.docTotal.toString()).toFixed(2).toString().padStart(8);

        const footer = new EscPosEncoder()
            .initialize()
            .codepage('cp852')
            .newline()
            .line('*****************ULTIMA LINEA******************')
            .align('right')
            .line('Subtotal ' + subTotal)
            .line('Descuento ' + descuento)
            .line('Impuesto ' + impuesto)
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
        await this.await100ms();
        await this.printToPrinter(footer2);

        const footer3 = new EscPosEncoder()
            .initialize()
            .codepage('cp852')
            .newline()
            .align('left')
            .line(document.sellerName)
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

    async connectPrinter(document: DocumentSaleModel) {
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
