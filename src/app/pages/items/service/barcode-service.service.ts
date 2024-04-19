import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import * as printJS from 'print-js';
import { blobToBase64 } from 'src/app/helpers/helper';

@Injectable({
    providedIn: 'root',
})
export class BarcodeService {
    async generateBarcode(
        itemCode: string,
        codesPerPage: number
    ): Promise<void> {
        const doc = new jsPDF();

        // Configuración de la página
        const pageWidth = doc.internal.pageSize.width;
        const pageHeight = doc.internal.pageSize.height;
        const margin = 40;
        const columnWidth = 80; // Ancho de cada código de barras
        const rowHeight = 40; // Altura de cada fila

        // Obtén la lista de códigos de barras utilizando JsBarcode
        const barcodeList = this.generateBarcodeList(itemCode, codesPerPage);

        let currentRow = 0;
        let currentCol = 0;
        // Itera sobre la lista de códigos de barras y agrega a la página
        barcodeList.forEach((barcode, index) => {
            if (currentCol >= Math.floor(pageWidth / columnWidth)) {
                // Cambiar a la siguiente fila
                currentCol = 0;
                currentRow++;
            }
            doc.setFontSize(44);
            doc.addFont('./assets/Code39r.ttf', 'barcode', 'normal');
            doc.setFontSize(44);
            doc.setFont('barcode', 'normal');
            const x = margin + currentCol * columnWidth;
            const y = margin + currentRow * rowHeight;
            doc.text(barcode, x, y);
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal', 'bold');
            doc.text(barcode, x+12, y+5);
            // Incrementa la posición actual
            currentCol++;
        });

        // Convertir el documento jsPDF a base64 usando un Blob
        let base64data = await blobToBase64(doc.output('blob'));
        printJS({
            printable: base64data,
            type: 'pdf',
            base64: true,
        });
    }

    private generateBarcodeList(
        itemCode: string,
        codesPerPage: number
    ): string[] {
        // Lógica para generar la lista de códigos de barras utilizando JsBarcode
        const barcodeList: string[] = [];
        for (let i = 0; i < codesPerPage; i++) {
            barcodeList.push(itemCode);
        }

        return barcodeList;
    }
}
