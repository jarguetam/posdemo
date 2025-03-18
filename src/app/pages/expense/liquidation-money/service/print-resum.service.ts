import { LightboxModule } from 'primeng/lightbox';
import { Injectable } from '@angular/core';
import EscPosEncoder from 'esc-pos-encoder-ionic';
import { CommonService } from 'src/app/service/common.service';
import { PrinterConectionService } from 'src/app/service/printer-conection.service';
import { MoneyLiquidationModel } from '../../models/money-liquidation-model';
import { Messages } from 'src/app/helpers/messages';
import {
    Detail,
    LiquidationResumModel,
    Resum,
} from '../../models/liquidation-resum';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class PrintResumService {
    total: number = 0;
    constructor(
        private commonService: CommonService,
        private conectPrinter: PrinterConectionService,
        private router: Router
    ) {}

    async printLiquidation(
        liquidation: LiquidationResumModel,
        seller: string,
        total: number
    ) {
        let print = await Messages.question(
            'Impresión',
            '¿Desea imprimir la liquidación?'
        );
        if (print) {
            Messages.loading('Impresión', 'Imprimiendo liquidación...');
            if (!this.conectPrinter.isPrinterConnected) {
                this.router.navigate(['/bluetooth-device-selector']);
                return;
            }
            this.total = total;
            await this.sendToPrint(liquidation, seller);
            Messages.closeLoading();
        }
    }

    async sendToPrint(liquidation: LiquidationResumModel, seller: string) {
        await this.generateHeader(seller);
        await this.generateResum(liquidation.resum);
        await this.generateDetail(liquidation.detail);
        await this.generateFooter();
    }

    async generateHeader(seller: string) {
        const companyInfo = await this.commonService.companyInfo();
        const headerEncoder = new EscPosEncoder()
            .initialize()
            .codepage('cp437')
            .align('center')
            .line(companyInfo.companyName)
            .newline()
            .align('left')
            .line(`Fecha: ${new Date().toLocaleDateString('es-HN')}`)
            .line(`Vendedor: ${seller}`)
            .line('LIQUIDACION')
            .encode();

        await this.printToPrinter(headerEncoder);
    }

    async generateResum(resum: Resum[]) {
        const resumEncoder = new EscPosEncoder()
            .initialize()
            .codepage('cp437')
            .line('='.repeat(40))
            .encode();

        await this.printToPrinter(resumEncoder);

        for (const item of resum) {
            const itemEncoder = new EscPosEncoder()
                .initialize()
                .codepage('cp437')
                .line(
                    `${item.docType.padEnd(20)}${this.formatNumber(
                        item.total
                    ).padStart(20)}`
                )
                .encode();

            await this.printToPrinter(itemEncoder);
        }

        const ingresoNetos =
            resum.find((item) => item.docType === 'INGRESO NETOS')?.total ?? 0;
        const diferenciaValor = this.total - ingresoNetos;
        const EPSILON = 0.001; // Margen de error aceptable
        const mensajeEstado =
            Math.abs(diferenciaValor) < EPSILON
                ? 'CUADRADO'
                : diferenciaValor > 0
                ? 'SOBRANTE'
                : 'FALTANTE';

        const resumenFinal = new EscPosEncoder()
            .initialize()
            .codepage('cp437')
            .line(
                `${'EFECTIVO + DEPOSITO'.padEnd(20)}${this.formatNumber(
                    this.total
                ).padStart(20)}`
            )
            .line(
                `${'DIFERENCIA'.padEnd(20)}${this.formatNumber(
                    diferenciaValor
                ).padStart(20)}`
            )
            .line(
                `${
                    'COMENTARIO: ' + mensajeEstado.padEnd(5)
                }${this.formatNumber(diferenciaValor).padStart(20)}`
            )
            .encode();

        await this.printToPrinter(resumenFinal);
    }

    async generateDetail(detail: Detail[]) {
        const detailHeaderEncoder = new EscPosEncoder()
            .initialize()
            .codepage('cp437')
            .newline()
            .line('DETALLE')
            .line('='.repeat(40))
            .line('T  CLIENTE                           TOTAL')
            .line('='.repeat(40))
            .encode();

        await this.printToPrinter(detailHeaderEncoder);

        for (const item of detail) {
            const itemEncoder = new EscPosEncoder()
                .initialize()
                .codepage('cp437')
                .line(
                    `${item.docTypeCode} ${item.customerName.padEnd(
                        30
                    )}${this.formatNumber(item.total).padStart(10)}`
                )
                .encode();

            await this.printToPrinter(itemEncoder);
        }
    }

    async generateFooter() {
        const footerEncoder = new EscPosEncoder()
            .initialize()
            .codepage('cp437')
            .newline()
            .line('Nota')
            .line('1 = Factura de contado')
            .line('2 = Factura de crédito')
            .line('3 = Cobros')
            .line('4 = Gastos')
            .newline()
            .newline()
            .bold(true)
            .line('='.repeat(40))
            .align('center')
            .line('Firma')
            .newline()
            .newline()
            .cut()
            .encode();

        await this.printToPrinter(footerEncoder);
    }

    // async connectPrinter(liquidation: LiquidationResumModel, seller: string) {
    //     try {
    //         if (this.conectPrinter.isPrinterConnected) {
    //             await this.sendToPrint(liquidation, seller);
    //         } else {
    //             await this.conectPrinter.connectPrinter();
    //             if (this.conectPrinter.isPrinterConnected) {
    //                 await this.sendToPrint(liquidation, seller);
    //             }
    //         }
    //     } catch (error) {
    //         Messages.warning('Error durante la impresión:', error);
    //     }
    // }

    async printToPrinter(result: Uint8Array) {
        if (!this.conectPrinter.isPrinterConnected) {
            Messages.warning(
                'Error',
                'No hay una impresora conectada. Por favor, seleccione una impresora primero.'
            );
            this.router.navigate(['/bluetooth-device-selector']);
            return;
        }

        const MAX_CHUNK_SIZE = 32;
        const DELAY_BETWEEN_CHUNKS = 50;

        for (
            let offset = 0;
            offset < result.byteLength;
            offset += MAX_CHUNK_SIZE
        ) {
            const chunk = result.slice(offset, offset + MAX_CHUNK_SIZE);
            const dataView = new DataView(chunk.buffer);

            try {
                await this.conectPrinter.printData(dataView);
                await new Promise((resolve) =>
                    setTimeout(resolve, DELAY_BETWEEN_CHUNKS)
                );
            } catch (error) {
                Messages.warning(
                    'Error al imprimir',
                    'Ocurrió un error al imprimir, por favor vuelva a conectar la impresora. ' +
                        error
                );
                break;
            }
        }
    }

    private formatNumber(num: number): string {
        return num.toLocaleString('es-HN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    }
}
