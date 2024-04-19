import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import * as printJS from 'print-js';
import { blobToBase64 } from 'src/app/helpers/helper';
import { CommonService } from 'src/app/service/common.service';
import { InventoryTransferModel } from '../models/inventory-transfer';
import { InventoryTransferDetailModel } from '../models/inventory-transfer-detail';

@Injectable({
  providedIn: 'root'
})
export class PrintTransferService {

    constructor(private commonService: CommonService) {}

    async printRequestTransfer(transfer: InventoryTransferModel) {
        const doc = new jsPDF({
            orientation: 'p',
            unit: 'pt',
            format: 'letter',
        });
        doc.deletePage(1);

        let detail = [...transfer.detail];
        const itemPerPage: number = 18;
        let pages: number = parseInt(
            (transfer.detail.length / itemPerPage).toString()
        );
        let pagesMod: number = parseInt(
            (transfer.detail.length % itemPerPage).toString()
        );
        let pageExtra: number = pagesMod > 0 ? 1 : 0;

        for (let index = 0; index < pages + pageExtra; index++) {
            doc.addPage('letter', 'l');
            let alturaDefecto = 155;
            let items = detail
                .slice(itemPerPage * index, transfer.detail.length)
                .slice(0, itemPerPage);

            //Primer Columna
            doc.setFontSize(14);
            doc.setFont('helvetica', 'normal', 'bold');
            doc.text(this.commonService.companyInfo().companyName, 20, 40);
            doc.text('Transferencia de mercancia', 360, 40);
            doc.setFont('helvetica', 'normal', 400);
            doc.setFontSize(10);
            doc.text(this.commonService.companyInfo().addressLine1, 20, 55);
            doc.text(this.commonService.companyInfo().addressLine2, 20, 68);
            doc.text('Tel: ' + this.commonService.companyInfo().phone1, 20, 81);
            doc.text(
                'Correo: ' +
                    this.commonService.companyInfo().email1 +
                    '/ ' +
                    this.commonService.companyInfo().email2,
                20,
                94
            );
            //Segunda Columna
            const companyLogoBase64 = localStorage.getItem('companyLogo');
            if (companyLogoBase64) {
                doc.addImage(companyLogoBase64, 'JPEG', 660, 20, 80, 60);
            } else {
                doc.addImage(
                    './assets/img/pos-terminal.png',
                    'JPEG',
                    660, 20, 80, 60
                );
            }
            // doc.setFontSize(14);
            doc.setFont('helvetica', 'normal', 'bold');
            doc.text("Almacen Origen: " +transfer.fromWhsName, 20, 110);
            doc.text("Almacen Destino: " +transfer.toWhsName, 20, 122);
            doc.text('Comentario: ' + transfer.comment, 20, 140);
            // doc.text("Consolidador: " +transfer.consolidator, 175, 140);
            doc.text('Fecha y Hora:', 570, 140);
            doc.text(new Date(transfer.transferDate).toLocaleString(), 650, 140);

            doc.setFont('helvetica', 'normal', 'bold');
            doc.setFontSize(14);
            doc.text('N°: ' + transfer.transferId, 570, 40);
            doc.setFontSize(12);

            if (items.length > 0) {
                this.generateDetailDiff(
                    doc,
                    items,
                    alturaDefecto,
                    index + 1 >= pages + pageExtra,
                    transfer.toWhsName
                );
            }
            if (alturaDefecto + 105 > 755 && index == pages + pageExtra - 1) {
                pages += 1;
            }
            let pageNumber = index + 1;
            let pagesTotal = pages + pageExtra;
            doc.text(`Pagína ${pageNumber}/${pagesTotal}`, 710, 570);
        }

        let base64data = await blobToBase64(doc.output('blob'));
        printJS({
            printable: base64data,
            type: 'pdf',
            base64: true,
        });
    }

    private async generateDetailDiff(
        doc: jsPDF,
        detail: InventoryTransferDetailModel[],
        alturaDefecto: number,
        isLastPage: boolean,
        whsName: string
    ) {
        let totalQty = 0;
        detail.forEach(function (a) {
            totalQty += a.quantity;
        });

        let totalWeight = 0;
        detail.forEach(function (a) {
            totalWeight += a.lineTotal;
        });

        //linea gruesa
        doc.setDrawColor(255, 0, 0);
        doc.rect(20, alturaDefecto - 10, 750, 0.7, 'F');
        //doc.rect(270, alturaDefecto +5 , 410, 0.7, "F");
        doc.rect(20, alturaDefecto + 20, 750, 0.7, 'F');
        doc.rect(20, alturaDefecto - 10, 0.7, 30, 'F'); // Linea al centro primera
        doc.rect(75, alturaDefecto - 10, 0.7, 30, 'F'); // Linea al centro primera
        doc.rect(400, alturaDefecto - 10, 0.7, 30, 'F'); // Linea al centro primera
        // //Lineas de KG y Piezas
        doc.rect(260, alturaDefecto - 10, 0.7, 30, 'F'); // Linea al centro primera
        //doc.rect(445, alturaDefecto + 5, 0.7, 15, "F");// Linea al centro primera
        doc.rect(480, alturaDefecto - 10, 0.7, 30, 'F'); // Linea al centro primera
        doc.rect(580, alturaDefecto - 10, 0.7, 30, 'F'); // Linea al centro primera
        doc.rect(680, alturaDefecto - 10, 0.7, 30, 'F'); // Linea al centro primera
        //doc.rect(720, alturaDefecto - 10, 0.7, 30 , "F");// Linea al centro primera
        doc.rect(770, alturaDefecto - 10, 0.7, 30, 'F'); // Linea al centro primera

        //Tabla
        doc.setFontSize(9);
        doc.setTextColor('000000');
        doc.text(`Codigo`, 25, alturaDefecto + 7);
        doc.text(`Descripcion`, 85, alturaDefecto + 7);
        doc.text(`Almacen destino`, 270, alturaDefecto + 7);

        doc.text(`Cantidad`, 410, alturaDefecto + 7);
        doc.text(`Precio`, 500, alturaDefecto + 7);
        doc.text(`Vencimiento`, 600, alturaDefecto + 7);
        doc.text(`Total`, 700, alturaDefecto + 7);
        //doc.text(`KG`, 730, alturaDefecto+ 7);

        doc.setTextColor('000000');
        let initialHeight = alturaDefecto + 20;
        let lastHeight = alturaDefecto + 15;
        for (
            var indexItem = 0;
            indexItem < (detail ?? []).length;
            indexItem++
        ) {
            lastHeight += 20;
            let item = (detail ?? [])[indexItem];
            //let date =new Date(item.dueDate).toLocaleString('dd/mm/yyyy')
            doc.text(`${item.itemCode}`, 25, lastHeight);
            doc.text(`${item.itemName}`, 85, lastHeight);
            doc.text(`${whsName}`, 270, lastHeight);
            doc.text(`${item.quantity}`, 410, lastHeight);
            doc.text(
                `${item.price.toLocaleString('es-HN', {
                    style: 'currency',
                    currency: 'HNL',
                })}`,
                500,
                lastHeight
            );
            doc.text(
                `${new Date(item.dueDate).toLocaleDateString('es-HN')}`,
                600,
                lastHeight
            );
            doc.text(
                `${item.lineTotal.toLocaleString('es-HN', {
                    style: 'currency',
                    currency: 'HNL',
                })}`,
                700,
                lastHeight
            );
            // doc.text(`${item.weight}`, 730, lastHeight);
            doc.rect(20, lastHeight + 5, 750, 0.7, 'F');
        }
        //  doc.rect(20, lastHeight+15, 750, 0.7, "F");
        // lastHight+= 19;

        if (isLastPage) {
            doc.text(`*ÚLTIMA LÍNEA*`, 270, lastHeight + 15);
            doc.text(`Total:`, 45, lastHeight + 35);
            doc.text(`` + totalQty.toLocaleString(), 410, lastHeight + 35);
            doc.text(
                `` +
                    totalWeight.toLocaleString('es-HN', {
                        style: 'currency',
                        currency: 'HNL',
                    }),
                700,
                lastHeight + 35
            );
        }
        let totalHeight = lastHeight - initialHeight + 5;
        alturaDefecto = totalHeight;
        //Lineas divisorias

        doc.rect(20, initialHeight, 0.7, totalHeight, 'F'); // Linea al centro primera
        doc.rect(75, initialHeight, 0.7, totalHeight, 'F'); // Linea al centro de los titulos//Despues de descripción
        doc.rect(400, initialHeight, 0.7, totalHeight, 'F'); // Linea al centro de los titulos //despues de empaque
        doc.rect(260, initialHeight, 0.7, totalHeight, 'F'); // Linea al centro de los titulos despues de almacen
        doc.rect(480, initialHeight, 0.7, totalHeight, 'F'); // Linea al centro de los titulos despues de dimensiones

        doc.rect(580, initialHeight, 0.7, totalHeight, 'F'); // Linea al centro de los titulos despues del vin
        doc.rect(680, initialHeight, 0.7, totalHeight, 'F'); // Linea al centro de los titulos despues de piezas
        //doc.rect(720, initialHeight, 0.7, totalHeight, "F");// Linea al centro de los titulos despues de kilos
        doc.rect(770, initialHeight, 0.7, totalHeight, 'F'); // Linea al centro de los titulos despues de kilos
    }
}
