import { DocumentDetailModel } from './../../models/document-detail';
import { DocumentModel } from './../../models/document';
import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import { CommonService } from 'src/app/service/common.service';
import { blobToBase64 } from 'src/app/helpers/helper';
import * as printJS from 'print-js';

@Injectable({
    providedIn: 'root',
})
export class PrintOrderPurchaseService {
    constructor(private commonService: CommonService) {}
    private generateHeader(doc: jsPDF, document: DocumentModel) {
        //Primer Columna
        doc.setFontSize(14);
        doc.setFont('helvetica', 'normal', 'bold');
        doc.text(this.commonService.companyInfo().companyName, 20, 40);
        doc.text('RTN: ' + this.commonService.companyInfo().rtn, 20, 55);
        doc.setFont('helvetica', 'normal', 400);
        doc.setFontSize(10);
        doc.text(this.commonService.companyInfo().addressLine1, 20, 65);
        doc.text(this.commonService.companyInfo().addressLine2, 20, 78);
        doc.text('Tel: ' + this.commonService.companyInfo().phone1, 20, 91);
        doc.text('Correo: ' + this.commonService.companyInfo().email1, 20, 104);
        //Segunda Columna
        const companyLogoBase64 = localStorage.getItem('companyLogo');
        if (companyLogoBase64) {
            doc.addImage(companyLogoBase64, 'JPEG',  470, 40, 80, 60);
        } else {
            doc.addImage(
                './assets/img/pos-terminal.png',
                'JPEG',
                 470, 40, 80, 60
            );
        }

        doc.setFont('helvetica', 'normal', 'bold');
        doc.text('Orden de compra N°: ' + document.docId, 300, 120);

        // Lineas
        doc.rect(18, 130, 0.7, 100, 'F');
        doc.rect(18, 130, 562, 0.7, 'F'); //Linea arriba
        doc.rect(280, 130, 0.7, 100, 'F'); // Linea al centro de los titulos
        doc.rect(580, 130, 0.7, 100, 'F');

        // Cliente Titulos
        doc.setFont('helvetica', 'normal', 'bold');
        doc.text(`Datos Generales del proveedor`, 20, 140);

        //Columna derecha
        doc.setFont('helvetica', 'normal', 400);

        doc.setFont('helvetica', 'normal', 'bold');
        doc.text('Fecha de pedido:', 460, 140);
        doc.text('Fecha de vencimiento:', 460, 160);
        doc.setFont('helvetica', 'normal', 400);
        doc.text(new Date(document.docDate).toLocaleString(), 460, 150);
        doc.text(new Date(document.dueDate).toLocaleDateString('es-HN'), 460, 170);

        // Cliente Columna izquierda
        doc.setFont('helvetica', 'normal', 'bold');
        doc.text(document.supplierCode + ' ' + document.supplierName, 20, 157);
        doc.setFont('helvetica', 'normal', 400);
        doc.text(`R.T.N.: ` , 20, 175);
        doc.text(`Direccion: `, 20, 185);
       // doc.text(document.customerAddress, 20, 195);
        doc.text(`Termino de Pago: ` + document.payConditionName, 20, 205);
        doc.text(`Referencia: ` + document.reference, 20, 220);
        // Columna Derecha sar
        // doc.setFont('helvetica', 'normal', 'bold');
        // doc.text('Régimen de facturación autorizado por la SAR', 290, 190);
        //  doc.rect(280, 200, 300, 0.7, 'F');
        // doc.text(`Codigo CAI: ` + document.cai, 290, 215);
        // doc.rect(280, 220, 300, 0.7, 'F'); //Linea abajo
        // doc.text(
        //     `Rango de Facturacion: ` +
        //         document.authorizedRangeFrom +
        //         ` Al ` +
        //         document.authorizedRangeTo,
        //     290,
        //     235
        // );
        // doc.rect(280, 240, 300, 0.7, 'F'); //Linea abajo
        // doc.text(
        //     `Fecha Limite de emision: ` +
        //         new Date(document.limitIssue).toLocaleString(),
        //     290,
        //     255
        // );
        doc.rect(18, 230, 562, 0.7, 'F'); //Linea abajo
        // //Antes del detalle
        // doc.text(`Numero de BL: `, 20, 275);
        // doc.text(`Contenedor/VIN: `, 175, 275);
        // doc.text(`Fecha llegada: `, 325, 275);
        // doc.text(`Tiempo estadia: `, 500, 275);
        // doc.setFont('helvetica', 'normal', 400);
        // doc.text(document.blMaster, 20, 285);
        // doc.text(document?.blHijo ?? '', 175, 285);
        // doc.text(
        //     new Date(document?.arrivalDate ?? '').toLocaleString(),
        //     325,
        //     285
        // );
        // doc.text(document?.stayTime.toString() + ' dias.', 500, 285);
    }

    private generateFooter(
        doc: jsPDF,
        alturaDefecto: number,
        document: DocumentModel,
        pageNumber: number,
        pagesTotal: number
    ) {
        //Numero de pagina
        doc.text(`Pagína ${pageNumber}/${pagesTotal}`, 510, 30);
        doc.setFont('helvetica', 'normal', 'bold');
    }

    private async generateDetail(
        doc: jsPDF,
        detail: DocumentDetailModel[],
        alturaDefecto: number,
        isLastPage: boolean,
        document: DocumentModel
    ) {
        //linea gruesa
        doc.setDrawColor(255, 0, 0);
        doc.rect(20, alturaDefecto-15, 560, 16, 'F');
        let lastHeight = alturaDefecto;
        let initialHeight = alturaDefecto;
        //Tabla
        doc.setFontSize(9);
        doc.setTextColor('ffffff');
        doc.text(`Codigo`, 25, alturaDefecto-5);
        doc.text(`Descripcion`, 82, alturaDefecto-5);
        doc.text(`Cantidad`, 250, alturaDefecto-5);
        doc.text(`Unidad`, 300, alturaDefecto-5);
        doc.text(`Precio`, 410, alturaDefecto-5);
        doc.text(`Total`, 510, alturaDefecto-5);
        doc.setTextColor('000000');
        //doc.text(document.docQty.toLocaleString(), 25, 320);
        //doc.text(document.docTotal.toLocaleString(), 100, 320);
        for (var indexItem = 0; indexItem < (detail??[]).length; indexItem++)
        {
            lastHeight+= 20;
            let item = (detail??[])[indexItem];
            //let date =new Date(item.dueDate).toLocaleString('dd/mm/yyyy')
            doc.text(`${item.itemCode}`, 25, lastHeight);
            doc.text(`${item.itemName}`, 82, lastHeight);
            doc.text(`${item.quantity}`, 250, lastHeight);
            doc.text(`${item.unitOfMeasureName}`, 310, lastHeight);
            doc.text(`${item.price.toLocaleString('es-HN', { style: 'currency', currency: 'HNL' })}`, 410, lastHeight);
            //doc.text(`${new Date(item.dueDate).toLocaleDateString('es-HN')}`, 600, lastHeight);
            doc.text(`${item.lineTotal.toLocaleString('es-HN', { style: 'currency', currency: 'HNL' })}`,510 , lastHeight);
           // doc.text(`${item.weight}`, 730, lastHeight);
           // doc.rect(20, lastHeight+5, 750, 0.7, "F");

        };

       doc.rect(20, lastHeight + 20, 560, 0.7, 'F');
        // lastHight+= 19;
        if (isLastPage) {
            doc.text(`*ÚLTIMA LÍNEA*`, 280, lastHeight + 35);
            doc.text(`Comentarios: ` + document.comment, 20, lastHeight + 50);
            doc.rect(400, lastHeight + 20, 0.7, 60, 'F');
            doc.text(`Subtotal`, 405, lastHeight + 30);
            doc.text(document.subTotal.toLocaleString('es-HN', { style: 'currency', currency: 'HNL' }), 505, lastHeight + 30);
            doc.rect(400, lastHeight + 35, 180, 0.7, 'F');
            doc.text(`Descuento`, 405, lastHeight + 45);
            doc.text(document.discountsTotal.toLocaleString('es-HN', { style: 'currency', currency: 'HNL' }), 505, lastHeight + 45);
            doc.rect(400, lastHeight + 50, 180, 0.7, 'F');
            doc.text(`Impuesto`, 405, lastHeight + 60);
            doc.text( document.tax.toLocaleString('es-HN', { style: 'currency', currency: 'HNL' }), 505, lastHeight + 60);
            doc.rect(400, lastHeight + 65, 180, 0.7, 'F');
            doc.text(`Total`, 405, lastHeight + 75);
            doc.text(
                 document.docTotal.toLocaleString('es-HN', { style: 'currency', currency: 'HNL' }),
                505,
                lastHeight + 75
            );

           doc.rect(400, lastHeight + 80, 180, 0.7, 'F');
            //   doc.text(`Son: ` + document.totalLetters, 25, lastHeight + 190);

            doc.rect(500, lastHeight + 20, 0.7, 60, 'F');
            doc.rect(580, lastHeight + 20, 0.7, 60, 'F');
            doc.text(document.createByName, 30, lastHeight + 400);
            doc.rect(30, lastHeight + 405, 120, 0.7, 'F');
            doc.text(`Solicitado por`, 30, lastHeight + 420);
        }
        let totalHeight = lastHeight - initialHeight + 20;
        //Lineas divisorias

        doc.rect(20, initialHeight, 0.7, totalHeight, 'F'); // Linea al centro primera
        doc.rect(78, initialHeight, 0.7, totalHeight, 'F');
        doc.rect(245, initialHeight, 0.7, totalHeight, 'F'); // Linea al centro de los titulos//Despues de descripción
        // doc.rect(295, initialHeight, 0.7, totalHeight, "F");// Linea al centro de los titulos //despues de empaque
        doc.rect(295, initialHeight, 0.7, totalHeight, 'F'); // Linea al centro de los titulos despues de rack
        doc.rect(400, initialHeight, 0.7, totalHeight, 'F'); // Linea al centro de los titulos despues de dimensiones
        // doc.rect(460, initialHeight, 0.7, totalHeight, "F");// Linea al centro de los titulos despues del vin
        doc.rect(500, initialHeight, 0.7, totalHeight, 'F'); // Linea al centro de los titulos despues de piezas
        // doc.rect(535, initialHeight, 0.7, totalHeight, "F");// Linea al centro de los titulos despues de kilos
        doc.rect(580, initialHeight, 0.7, totalHeight, 'F'); // Linea al centro de los titulos despues de kilos
    }

    async printOrder(document: DocumentModel) {
        const doc = new jsPDF({
            orientation: 'p',
            unit: 'pt',
            format: 'letter',
        });
        doc.deletePage(1);
        let detail = [...document.detail];
        const itemPerPage: number = 12;
        let pages: number = parseInt(
            (document.detail.length / itemPerPage).toString()
        );
        let pagesMod: number = parseInt(
            (document.detail.length % itemPerPage).toString()
        );
        let pageExtra: number = pagesMod > 0 ? 1 : 0;

        for (let index = 0; index < pages + pageExtra; index++) {
            doc.addPage('letter', 'p');
            let alturaDefecto = 260;
            let items = detail
                .slice(itemPerPage * index, document.detail.length)
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
            if (alturaDefecto + 105 > 755 && index == pages + pageExtra - 1) {
                pages += 1;
            }
            this.generateFooter(
                doc,
                alturaDefecto,
                document,
                index + 1,
                pages + pageExtra
            );
        }

        let base64data = await blobToBase64(doc.output('blob'));
        printJS({
            printable: base64data,
            type: 'pdf',
            base64: true,
        });
    }
}
