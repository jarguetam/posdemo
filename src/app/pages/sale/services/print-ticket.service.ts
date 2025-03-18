import EscPosEncoder from 'esc-pos-encoder-ionic';
import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import * as printJS from 'print-js';
import { blobToBase64 } from 'src/app/helpers/helper';
import { CommonService } from 'src/app/service/common.service';
import { DocumentSaleDetailModel } from '../models/document-detail-model';
import { DocumentSaleModel } from '../models/document-model';

@Injectable({
    providedIn: 'root',
})
export class PrintTicketService {
    file: File;
    printerCharacteristic;
    factNum: string;

    constructor(private commonService: CommonService) {}

    async printInvoice(document: DocumentSaleModel) {

        let detail = [...(document.detailDto && document.detailDto.length > 0 ? document.detailDto : document.detail)];
        let height = this.calculateLastHeight(detail, 90);
        const doc = new jsPDF({
            orientation: 'p',
            unit: 'mm',
            format: [79, height], // Ancho x Alto
        });
        doc.deletePage(1);
        const itemPerPage: number = 12;
        let pages: number = parseInt(
            (document.detailDto.length / itemPerPage).toString()
        );
        let pagesMod: number = parseInt(
            (document.detailDto.length % itemPerPage).toString()
        );
        let pageExtra: number = pagesMod > 0 ? 1 : 0;

        for (let index = 0; index < pages + pageExtra; index++) {
            doc.addPage('mm', 'p');
            let alturaDefecto = 90;
            let items = detail
                .slice(itemPerPage * index, document.detailDto.length)
                .slice(0, itemPerPage);
            this.generateHeader(doc, document);

            if (items.length > 0) {
                this.generateDetail(
                    doc,
                    items,
                    alturaDefecto,
                    index + 1 >= pages + pageExtra,
                    document
                );
            }
        }

        let base64data = await blobToBase64(doc.output('blob'));
        printJS({
            printable: base64data,
            type: 'pdf',
            base64: true,
        });

        const blob = doc.output('blob');
        const buffer = await blob.arrayBuffer();
        let image = new Image();
        image.src = './assets/img/invoice-test.png'; //URL.createObjectURL(blob);
        let encoder = new EscPosEncoder();

        const header = encoder
            .initialize()
            .codepage('cp852')
            .line('DISTRIBUIDORA DE PRODUCTOS ALIMENTICIOS')
            .newline()
            .line('RTN: 050119999025486')
            .line('Mercado Municipal')
            .line('San Pedro Sula, Cortes, Honduras')
            .line('Correo: test@gmail.com')
            .encode();

        const invoiceHeader = encoder
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

        const detailHeader = new EscPosEncoder()
            .initialize()
            .codepage('cp852')
            .line('Descripcion               Cant.   Precio  Total')
            .line('***********************************************') // Línea horizontal
            .encode();

        const detailItems = encoder.initialize().codepage('cp852');
        for (
            let indexItem = 0;
            indexItem < (detail ?? []).length;
            indexItem++
        ) {
            let item = (detail ?? [])[indexItem];
            // Ajusta las longitudes de las columnas según sea necesario
            const itemNameColumn = item.itemName.padEnd(20); // Por ejemplo, la columna del nombre del artículo tiene un ancho de 30 caracteres
            const quantityColumn = item.quantity.toString().padStart(8); // Ancho de 10 caracteres
            const priceColumn = item.price.toString().padStart(8); // Ancho de 15 caracteres
            const lineTotalColumn = item.lineTotal.toString().padStart(11); // Ancho de 20 caracteres

            // Concatena las columnas y agrega la línea al detalle
            detailItems.line(
                `${itemNameColumn}${quantityColumn}${priceColumn}${lineTotalColumn}`
            );
        }
        const subTotal = document.subTotal.toString().padEnd(8);
        const descuento = document.discountsTotal.toString().padStart(8);
        const impuesto = document.tax.toString().padStart(8);
        const total = document.docTotal.toString().padStart(8);
        const footer = new EscPosEncoder()
            .initialize()
            .codepage('cp852')
            .newline()
            .line('****************ULTIMA LINEA******************')
            .align('right')
            .line('Subtotal ' + subTotal)
            .line('Descuento ' + descuento)
            .line('Impuesto ' + impuesto)
            .line('Total ' + total)
            .newline()
            .encode();

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

        await this.connectAndPrint(header);
        await this.connectAndPrint(invoiceHeader);
        await this.connectAndPrint(detailHeader);
        await this.connectAndPrint(detailItems.encode());
        await this.connectAndPrint(footer);
        await this.connectAndPrint(footer2);
        await this.connectAndPrint(footer3);
    }

    Uint8ArrayFromBase64(base64) {
        return Uint8Array.from(window.atob(base64), (v) => v.charCodeAt(0));
    }

    private async connectAndPrint(result) {
        const MAX_CHUNK_SIZE = 256;
        try {
            if (this.printerCharacteristic == null) {
                let mobileNavigatorObject: any = window.navigator;
                if (mobileNavigatorObject && mobileNavigatorObject.bluetooth) {
                    mobileNavigatorObject.bluetooth;
                    mobileNavigatorObject.bluetooth
                        .requestDevice({
                            filters: [
                                {
                                    services: [
                                        '000018f0-0000-1000-8000-00805f9b34fb',
                                    ],
                                },
                            ],
                        })
                        .then((device) => device.gatt.connect())
                        .then((server) =>
                            server.getPrimaryService(
                                '000018f0-0000-1000-8000-00805f9b34fb'
                            )
                        )
                        .then((service) =>
                            service.getCharacteristic(
                                '00002af1-0000-1000-8000-00805f9b34fb'
                            )
                        )
                        .then(async (characteristic) => {
                            this.printerCharacteristic = characteristic;

                            // await characteristic.writeValue(arrayBuffer);

                            // Enviar la imagen en fragmentos
                            for (
                                let offset = 0;
                                offset < result.byteLength;
                                offset += MAX_CHUNK_SIZE
                            ) {
                                const chunk = result.slice(
                                    offset,
                                    offset + MAX_CHUNK_SIZE
                                );
                                try {
                                    // await characteristic.writeValue(encoder.encode('Test'));
                                    await characteristic.writeValue(chunk);
                                } catch (error) {
                                    //Manejar el error según sea necesario
                                    console.error(
                                        'Error al escribir en la característica:',
                                        error
                                    );
                                }
                            }

                            // Finalizar la impresión de la imagen
                            // await characteristic.writeValue(
                            //     new Uint8Array([0x0a])
                            // );

                            console.log(
                                'Write done. Document sent to printer.'
                            );
                        })
                        .catch((error) => {
                            console.error('Error during printing:', error);
                        });
                }
            } else {
                await this.printerCharacteristic.writeValue(result);
            }
        } catch (error) {
            console.error('Error al imprimir:', error);
        }
    }

    private generateHeader(doc: jsPDF, document: DocumentSaleModel) {
        // Primer Columna
        doc.setFontSize(8); // Ajusta el tamaño de la fuente según tus necesidades
        doc.setFont('helvetica', 'normal', 'bold');
        doc.text(this.commonService.companyInfo().companyName, 5, 10); // Ajusta las coordenadas
        doc.text('RTN: ' + this.commonService.companyInfo().rtn, 5, 15);
        doc.setFont('helvetica', 'normal', 400);
        doc.setFontSize(6); // Ajusta el tamaño de la fuente según tus necesidades
        doc.text(this.commonService.companyInfo().addressLine1, 5, 20);
        doc.text(this.commonService.companyInfo().addressLine2, 5, 25);
        doc.text('Tel: ' + this.commonService.companyInfo().phone1, 5, 30);
        doc.text('Correo: ' + this.commonService.companyInfo().email1, 5, 35);
        // Primer Columna (Ajusta las coordenadas y tamaños según tus necesidades)
        const companyLogoBase64 = localStorage.getItem('companyLogo');
        if (companyLogoBase64) {
            doc.addImage(companyLogoBase64, 'JPEG', 55, 15, 10, 10);
        } else {
            doc.addImage(
                './assets/img/pos-terminal.png',
                'JPEG',
                55,
                15,
                10,
                10
            );
        }
        doc.setFont('helvetica', 'normal', 'bold');
        doc.text('Factura N°: ' + document.deiNumber, 5, 40);
        doc.text(
            'Fecha de factura: ' +
                new Date(document.docDate).toLocaleDateString('es-HN'),
            5,
            45
        );
        doc.text(
            'Fecha de vencimiento: ' +
                new Date(document.dueDate).toLocaleDateString('es-HN'),
            5,
            50
        );
        doc.text(
            'Cliente: ' + document.customerCode + ' ' + document.customerName,
            5,
            55
        );
        doc.text(`R.T.N.: ` + document.customerRTN, 5, 60);
        doc.text(`Direccion: ` + document.customerAddress, 5, 65);
        doc.text(`Termino de Pago: ` + document.payConditionName, 5, 70);
        doc.text(`Referencia: ` + document.reference, 5, 75);
        // Lineas
        doc.rect(2, 36, 0.5, 42, 'F');
        doc.rect(2, 36, 73, 0.5, 'F');
        //doc.rect(35, 45, 0.5, 45, 'F');
        doc.rect(75, 36, 0.5, 42, 'F');
        doc.rect(2, 78, 73, 0.5, 'F');
    }

    private async generateDetail(
        doc: jsPDF,
        detail: DocumentSaleDetailModel[],
        alturaDefecto: number,
        isLastPage: boolean,
        document: DocumentSaleModel
    ) {
        doc.setDrawColor(255, 0, 0);
        doc.rect(2, alturaDefecto - 5, 0.5, 8, 'F');
        doc.rect(75, alturaDefecto - 5, 0.5, 8, 'F');
        doc.rect(2, alturaDefecto - 5, 73, 0.5, 'F');
        doc.rect(2, alturaDefecto + 3, 73, 0.5, 'F');
        let lastHeight = alturaDefecto;
        let initialHeight = alturaDefecto;
        // Tabla
        doc.setFontSize(6);
        doc.text(`Descripcion`, 3, alturaDefecto);
        doc.text(`Cantidad`, 35, alturaDefecto);
        doc.text(`Precio`, 45, alturaDefecto);
        doc.text(`Total`, 60, alturaDefecto);

        for (
            let indexItem = 0;
            indexItem < (detail ?? []).length;
            indexItem++
        ) {
            indexItem == 0 ? (lastHeight += 7) : (lastHeight += 5);
            //   lastHeight += 5;
            let item = (detail ?? [])[indexItem];
            doc.text(`${item.itemName}`, 3, lastHeight);
            doc.text(`${item.quantity}`, 38, lastHeight);
            doc.text(
                `${item.price.toLocaleString('es-HN', {
                    style: 'currency',
                    currency: 'HNL',
                })}`,
                45,
                lastHeight
            );
            doc.text(
                `${item.lineTotal.toLocaleString('es-HN', {
                    style: 'currency',
                    currency: 'HNL',
                })}`,
                60,
                lastHeight
            );
        }

        this.drawDashedLine(doc, 3, lastHeight + 5, 70, 2);
        if (isLastPage) {
            doc.text(`*ÚLTIMA LÍNEA*`, 28, lastHeight + 10);
            doc.text(`Comentarios: ` + document.comment, 3, lastHeight + 35);
            doc.rect(130, lastHeight + 5, 0.5, 20, 'F');
            doc.text(`Subtotal`, 45, lastHeight + 15);
            doc.text(
                document.subTotal.toLocaleString('es-HN', {
                    style: 'currency',
                    currency: 'HNL',
                }),
                60,
                lastHeight + 15
            );
            //doc.rect(130, lastHeight + 15, 50, 0.5, 'F');
            doc.text(`Descuento`, 45, lastHeight + 20);
            doc.text(
                document.discountsTotal.toLocaleString('es-HN', {
                    style: 'currency',
                    currency: 'HNL',
                }),
                60,
                lastHeight + 20
            );
            // doc.rect(130, lastHeight + 25, 50, 0.5, 'F');
            doc.text(`Impuesto`, 45, lastHeight + 25);
            doc.text(
                document.tax.toLocaleString('es-HN', {
                    style: 'currency',
                    currency: 'HNL',
                }),
                60,
                lastHeight + 25
            );
            // doc.rect(130, lastHeight + 35, 50, 0.5, 'F');
            doc.text(`Total`, 45, lastHeight + 30);
            doc.text(
                document.docTotal.toLocaleString('es-HN', {
                    style: 'currency',
                    currency: 'HNL',
                }),
                60,
                lastHeight + 30
            );
            // doc.rect(130, lastHeight + 45, 50, 0.5, 'F');
            doc.text(`CAI: ` + document.cai, 3, lastHeight + 50);
            doc.text(
                `Rango de Facturacion: ` +
                    document.authorizedRangeFrom +
                    ` Al ` +
                    document.authorizedRangeTo,
                3,
                lastHeight + 55
            );
            doc.text(
                `Fecha Limite de emision: ` +
                    new Date(document.limitIssue).toLocaleDateString('es-HN'),
                3,
                lastHeight + 60
            );
            doc.text(document.sellerName, 3, lastHeight + 75);
            doc.rect(3, lastHeight + 76, 40, 0.2, 'F');
            doc.text(`Elaborado por`, 3, lastHeight + 80);
        }
    }

    private calculateLastHeight(
        detail: DocumentSaleDetailModel[],
        alturaDefecto: number
    ): number {
        let lastHeight = alturaDefecto;

        for (
            let indexItem = 0;
            indexItem < (detail ?? []).length;
            indexItem++
        ) {
            lastHeight += 5;
        }
        lastHeight += 90;
        return lastHeight;
    }

    drawDashedLine(
        doc: jsPDF,
        x: number,
        y: number,
        length: number,
        dashLength: number
    ) {
        doc.setDrawColor(0);
        for (let i = x; i <= x + length; i += dashLength * 2) {
            doc.line(i, y, i + dashLength, y);
        }
        doc.setDrawColor(0, 0, 0);
    }

    printTest() {}
}
