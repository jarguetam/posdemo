import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { PrinterConectionService } from 'src/app/service/printer-conection.service';
import { InventoryRequestTransfer } from '../models/inventory-request-transfer';
import { Messages } from 'src/app/helpers/messages';
import EscPosEncoder from 'esc-pos-encoder-ionic';

@Injectable({
    providedIn: 'root'
})
export class PrintInventoryRequestService {
    constructor(
        private conectPrinter: PrinterConectionService,
        private router: Router
    ) {}

    async printInventoryRequest(request: InventoryRequestTransfer): Promise<void> {
        const shouldPrint = await this.confirmPrint();
        if (shouldPrint) {
            await this.ensurePrinterConnected();
            await this.sendToPrint(request);
        }
    }

    private async confirmPrint(): Promise<boolean> {
        return await Messages.question('Impresión', '¿Desea imprimir la solicitud de transferencia de inventario?');
    }

    private async ensurePrinterConnected(): Promise<void> {
        Messages.loading('Impresión', 'Conectando a la impresora...');
        if (!this.conectPrinter.isPrinterConnected) {
            Messages.closeLoading();
            this.router.navigate(['/bluetooth-device-selector']);
            throw new Error('Error: Printer not connected');
        }
    }

    private async sendToPrint(request: InventoryRequestTransfer): Promise<void> {
        try {
            await this.generateHeader(request);
            await this.generateDetail(request);
            await this.generateFooter(request);
        } finally {
            Messages.closeLoading();
        }
    }

    private async generateHeader(request: InventoryRequestTransfer): Promise<void> {
        const header = new EscPosEncoder()
            .initialize()
            .codepage('cp437')
            .line('SOLICITUD DE TRANSFERENCIA DE INVENTARIO')
            .newline()
            .line(`Fecha: ${new Date(request.transferRequestDate).toLocaleDateString('es-HN')}`)
            .line(`De: ${request.fromWhsName}`)
            .line(`A: ${request.toWhsName}`)
            .line(`Vendedor: ${request.createByName}`)
            .newline()
            .line('='.repeat(48))
            .line('Descripción               Cant.         Unidades ')
            .line('='.repeat(48))
            .encode();

        await this.printToPrinter(header);
    }

    private async generateDetail(request: InventoryRequestTransfer): Promise<void> {
        for (const item of request.detail) {
            const detailItem = new EscPosEncoder()
                .initialize()
                .codepage('cp437')
                .line(item.itemName.padEnd(30))
                .line(`${item.quantity.toFixed(2).padStart(30)}${item.quantityUnit.padStart(15)}`)
                .encode();
            await this.printToPrinter(detailItem);
        }
    }

    private async generateFooter(request: InventoryRequestTransfer): Promise<void> {
        // Calcular el total de unidades sumando las cantidades de todos los ítems
        const totalUnits = request.detail.reduce((total, item) => total + item.quantity, 0);

        const footer = new EscPosEncoder()
            .initialize()
            .codepage('cp437')
            .newline()
            .line('*****************ULTIMA LINEA******************')
            .align('right')
            .line(`Total unidades: ${totalUnits.toFixed(2).padStart(30)}`) // Total de unidades
            .newline()
            .align('left')
            .line(`Comentario: ${request.comment}`)
            .newline()
            .encode();

        await this.printToPrinter(footer);
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
