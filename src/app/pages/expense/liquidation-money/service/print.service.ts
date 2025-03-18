import { CommonService } from 'src/app/service/common.service';
import { PrinterConectionService } from 'src/app/service/printer-conection.service';
import { MoneyLiquidationModel } from '../../models/money-liquidation-model';
import { Messages } from 'src/app/helpers/messages';
import EscPosEncoder from 'esc-pos-encoder-ionic';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
@Injectable({
    providedIn: 'root',
})
export class PrintMoneyLiquidationService {
    constructor(
        private commonService: CommonService,
        private conectPrinter: PrinterConectionService,
        private router: Router
    ) {}

    async printLiquidation(liquidation: MoneyLiquidationModel) {
        let print = await Messages.question(
            'Impresión',
            '¿Desea imprimir la liquidación de dinero?'
        );
        if (print) {
            Messages.loading('Impresion', 'Conectando a la impresora...');
            if (!this.conectPrinter.isPrinterConnected) {
                // Navegar a la pantalla de selección de dispositivos
                this.router.navigate(['/bluetooth-device-selector']);
                return;
            }
            await this.sendToPrint(liquidation);
            Messages.closeLoading();
        }
    }

    async sendToPrint(liquidation: MoneyLiquidationModel) {
        await this.generateHeader(liquidation);
        await this.generateTable(liquidation);
        await this.generateFooter(liquidation);
    }

    async generateHeader(liquidation: MoneyLiquidationModel) {
        const companyInfo = await this.commonService.companyInfo();
        const companyEncoder = new EscPosEncoder()
            .initialize()
            .codepage('cp437')
            .line(companyInfo.companyName)
            .encode();
            await this.printToPrinter(companyEncoder);

        const headerEncoder = new EscPosEncoder()
            .initialize()
            .codepage('cp437')
            .align('center')
            .newline()
            .align('left')
            .line(
                `Fecha: ${new Date(liquidation.expenseDate).toLocaleDateString(
                    'es-HN'
                )}`
            )
            .line(`Vendedor: ${liquidation.seller.sellerName}`)
            .newline()
            .encode();

        await this.printToPrinter(headerEncoder);
    }

    async generateTable(liquidation: MoneyLiquidationModel) {
        const tableHeader = new EscPosEncoder()
            .initialize()
            .codepage('cp437')
            .line('='.repeat(40))
            .line('BILLETES    CANTIDAD         TOTAL')
            .line('='.repeat(40))
            .encode();

        await this.printToPrinter(tableHeader);

        const sortedDetails = liquidation.details.sort(
            (a, b) => parseInt(b.denominacion) - parseInt(a.denominacion)
        );

        for (const detail of sortedDetails) {
            const rowEncoder = new EscPosEncoder()
                .initialize()
                .codepage('cp437')
                .line(
                    `${detail.denominacion.padEnd(12)}${detail.quantity
                        .toString()
                        .padEnd(13)}${this.formatNumber(detail.total).padStart(15)}`
                )
                .encode();

            await this.printToPrinter(rowEncoder);
        }
    }

    async generateFooter(liquidation: MoneyLiquidationModel) {
        const footerEncoder = new EscPosEncoder()
            .initialize()
            .codepage('cp437')
            .line('='.repeat(40))
            .align('left')
            .line(`${'EFECTIVO:'.padEnd(25)}${this.formatNumber(liquidation.total-liquidation.deposit).padStart(15)}`)
            .line(`${'DEPOSITOS:'.padEnd(25)}${this.formatNumber(liquidation.deposit).padStart(15)}`)
            .line(`${'TOTAL:'.padEnd(25)}${this.formatNumber(liquidation.total).padStart(15)}`)
            .newline()
            .encode();

        await this.printToPrinter(footerEncoder);
    }

    async printToPrinter(result: Uint8Array) {
        if (!this.conectPrinter.isPrinterConnected) {
            Messages.warning('Error', 'No hay una impresora conectada. Por favor, seleccione una impresora primero.');
            this.router.navigate(['/bluetooth-device-selector']);
            return;
        }

        const MAX_CHUNK_SIZE = 32;
        const DELAY_BETWEEN_CHUNKS = 50;

        for (let offset = 0; offset < result.byteLength; offset += MAX_CHUNK_SIZE) {
            const chunk = result.slice(offset, offset + MAX_CHUNK_SIZE);
            const dataView = new DataView(chunk.buffer);

            try {
                await this.conectPrinter.printData(dataView);
                await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_CHUNKS));
            } catch (error) {
                Messages.warning(
                    'Error al imprimir',
                    'Ocurrió un error al imprimir, por favor vuelva a conectar la impresora. ' + error
                );
                break;
            }
        }
    }

    private formatNumber(num: number): string {
        return num.toLocaleString('es-HN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }
}
