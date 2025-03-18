import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import * as printJS from 'print-js';
import { blobToBase64 } from 'src/app/helpers/helper';
import { CommonService } from 'src/app/service/common.service';
import { InventoryTransferModel } from '../models/inventory-transfer';
import { InventoryTransferDetailModel } from '../models/inventory-transfer-detail';
import { Capacitor } from '@capacitor/core';
import { FileSharer } from '@byteowls/capacitor-filesharer';

@Injectable({
    providedIn: 'root',
})
export class PrintTransferService {
    constructor(private commonService: CommonService) {}

    async printRequestTransfer(transfer: InventoryTransferModel) {
        try {
            const doc = new jsPDF({
                orientation: 'p',
                unit: 'pt',
                format: 'letter',
            });
            doc.deletePage(1);

            let detail = [...transfer.detail];
            const itemPerPage: number = 25; // Increased for portrait mode
            let pages: number = parseInt(
                (transfer.detail.length / itemPerPage).toString()
            );
            let pagesMod: number = parseInt(
                (transfer.detail.length % itemPerPage).toString()
            );
            let pageExtra: number = pagesMod > 0 ? 1 : 0;

            for (let index = 0; index < pages + pageExtra; index++) {
                doc.addPage('letter', 'p'); // Changed to portrait
                let alturaDefecto = 200;
                let items = detail
                    .slice(itemPerPage * index, transfer.detail.length)
                    .slice(0, itemPerPage);

                // Header adjustments for portrait
                doc.setFontSize(14);
                doc.setFont('helvetica', 'normal', 'bold');
                doc.text('Transferencia de mercancia', doc.internal.pageSize.width / 2, 40, { align: 'center' });
                doc.text('N°: ' + transfer.transferId, 450, 40);
                doc.text(this.commonService.companyInfo().companyName, 20, 70);
                doc.setFont('helvetica', 'normal', 400);
                doc.setFontSize(10);
                doc.text(this.commonService.companyInfo().addressLine1, 20, 85);
                doc.text(this.commonService.companyInfo().addressLine2, 20, 98);
                doc.text('Tel: ' + this.commonService.companyInfo().phone1, 20, 111);
                doc.text(
                    'Correo: ' +
                        this.commonService.companyInfo().email1 +
                        '/ ' +
                        this.commonService.companyInfo().email2,
                    20,
                    124
                );

                // Logo position adjusted for portrait
                const companyLogoBase64 = localStorage.getItem('companyLogo');
                if (companyLogoBase64) {
                    doc.addImage(companyLogoBase64, 'JPEG', 500, 60, 80, 60);
                } else {
                    doc.addImage(
                        './assets/img/pos-terminal.png',
                        'JPEG',
                        450, 20, 80, 60
                    );
                }

                doc.setFont('helvetica', 'normal', 'bold');
                doc.text('Almacen Origen: ' + transfer.fromWhsName, 20, 140);
                doc.text('Almacen Destino: ' + transfer.toWhsName, 20, 152);
                doc.text('Comentario: ' + transfer.comment, 20, 170);
                doc.text('Fecha y Hora:', 350, 180);
                doc.text(new Date(transfer.transferDate).toLocaleString(), 450, 180);


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
                if (
                    alturaDefecto + 105 > 755 &&
                    index == pages + pageExtra - 1
                ) {
                    pages += 1;
                }
                let pageNumber = index + 1;
                let pagesTotal = pages + pageExtra;
                doc.text(`Pagína ${pageNumber}/${pagesTotal}`, 450, 750); // Adjusted for portrait
            }

            if (Capacitor.isNativePlatform()) {
                // Para dispositivos móviles
                let base64 = await blobToBase64(doc.output('blob'));
                const fileName = `Transferencia_${transfer.transferId}.pdf`;

                await FileSharer.share({
                    filename: fileName,
                    base64Data: base64,
                    contentType: 'application/pdf',
                });
            } else {
                const blob = doc.output('blob');
                const url = URL.createObjectURL(blob);
                window.open(url, '_blank');
            }
        } catch (error) {
            debugger;
            console.error('Error al generar PDF:', error);
            alert('Error al generar el PDF. Por favor intente nuevamente.');
        }
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

        // Adjusted table width for portrait mode
        doc.setFillColor(245, 245, 245);
        doc.rect(20, alturaDefecto - 10, 550, 30, 'F');

        // Column headers
        doc.setFontSize(9);
        doc.setTextColor('000000');
        doc.text(`Codigo`, 25, alturaDefecto + 7);
        doc.text(`Descripcion`, 100, alturaDefecto + 7);
        doc.text(`Cantidad`, 350, alturaDefecto + 7);
        doc.text(`Pedido`, 450, alturaDefecto + 7);

        let initialHeight = alturaDefecto + 20;
        let lastHeight = alturaDefecto + 15;

        for (let indexItem = 0; indexItem < (detail ?? []).length; indexItem++) {
            lastHeight += 20;
            let item = (detail ?? [])[indexItem];

            if (indexItem % 2 === 0) {
                doc.setFillColor(250, 250, 250);
                doc.rect(20, lastHeight - 15, 550, 20, 'F');
            }

            // Adjusted text positions
            doc.text(`${item.itemCode}`, 25, lastHeight);
            doc.text(`${item.itemName}`, 100, lastHeight);
            doc.text(`${item.quantity}`, 350, lastHeight);
            doc.text(`${item.quantityUnit}`, 450, lastHeight);
        }

        if (isLastPage) {
            doc.setFillColor(245, 245, 245);
            doc.rect(20, lastHeight + 5, 550, 40, 'F');
            doc.text(`*ÚLTIMA LÍNEA*`, 220, lastHeight + 15);
            doc.text(`Total:`, 45, lastHeight + 35);
            doc.text(`` + totalQty.toLocaleString(), 350, lastHeight + 35);
        }

        let totalHeight = lastHeight - initialHeight + 5;
        alturaDefecto = totalHeight;
    }
}
