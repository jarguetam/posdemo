import { Injectable } from '@angular/core';
import { Messages } from '../helpers/messages';

@Injectable({
    providedIn: 'root',
})
export class PrinterConectionService {
    printerCharacteristic: any;
    isPrinterConect: boolean = false;

    constructor() {}
    async connectPrinter() {
        try {
            if (!this.printerCharacteristic) {
                const mobileNavigatorObject: any = window.navigator;
                if (mobileNavigatorObject && mobileNavigatorObject.bluetooth) {
                    const device =
                        await mobileNavigatorObject.bluetooth.requestDevice({
                            filters: [
                                {
                                    services: [
                                        '000018f0-0000-1000-8000-00805f9b34fb'
                                    ],
                                },
                            ],
                        });
                    const server = await device.gatt.connect();
                    const service = await server.getPrimaryService(
                        '000018f0-0000-1000-8000-00805f9b34fb'
                    );
                    this.printerCharacteristic =
                        await service.getCharacteristic(
                            '00002af1-0000-1000-8000-00805f9b34fb'
                        );
                    this.isPrinterConect = true;
                    return true; // Iniciar impresión después de la conexión
                } else {
                    this.isPrinterConect = false;
                    return false;
                }
            } else {
                this.isPrinterConect = false;
                return false;
            }
        } catch (error) {
            this.isPrinterConect = false;
            Messages.warning('Error durante la impresión:', error);
            return false;
        }
    }
}
