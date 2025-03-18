import { Injectable } from '@angular/core';
import { Messages } from '../helpers/messages';
import { BleClient, BleDevice, RequestBleDeviceOptions, ScanMode, ScanResult } from '@capacitor-community/bluetooth-le';

@Injectable({
    providedIn: 'root',
})
export class PrinterConectionService {
    private device: BleDevice | null = null;
    private PRINTER_SERVICE = '000018f0-0000-1000-8000-00805f9b34fb';
    private PRINTER_CHARACTERISTIC = '00002af1-0000-1000-8000-00805f9b34fb';
    public isPrinterConnected = false;

    constructor() {
        BleClient.initialize();
    }

    async requestPermissions(): Promise<boolean> {
        try {
            await BleClient.requestLEScan({}, () => {});
            return true;
        } catch (error) {
            console.error('Error al solicitar permisos:', error);
            Messages.warning('Error de permisos', 'No se pudieron obtener los permisos necesarios.');
            return false;
        }
    }

    async scanForDevices(timeoutMs: number = 5000): Promise<BleDevice[]> {
        const devices: BleDevice[] = [];

        return new Promise((resolve) => {
            const scanOptions: RequestBleDeviceOptions = {
                services: [this.PRINTER_SERVICE],
                scanMode: ScanMode.SCAN_MODE_LOW_LATENCY,
                allowDuplicates: false,
            };

            BleClient.requestLEScan(scanOptions, (result: ScanResult) => {
                if (result.device && !devices.some(d => d.deviceId === result.device.deviceId)) {
                    devices.push(result.device);
                }
            });

            // Detener el escaneo después del tiempo especificado
            setTimeout(async () => {
                await BleClient.stopLEScan();
                resolve(devices);
            }, timeoutMs);
        });
    }

    async connectToPrinter(deviceId: string) {
        try {
            await BleClient.connect(deviceId);
            this.device = { deviceId };
            this.isPrinterConnected = true;
            console.log('Conectado a', deviceId);
            return true;
        } catch (error) {
            console.error('Error al conectar:', error);
            Messages.warning('Error de conexión', 'No se pudo conectar a la impresora.');
            this.isPrinterConnected = false;
            return false;
        }
    }

    async printData(data: DataView) {
        if (!this.device || !this.isPrinterConnected) {
            throw new Error('Impresora no conectada');
        }

        try {
            await BleClient.write(
                this.device.deviceId,
                this.PRINTER_SERVICE,
                this.PRINTER_CHARACTERISTIC,
                data
            );
        } catch (error) {
            console.error('Error al imprimir:', error);
            Messages.warning('Error de impresión', 'No se pudo enviar los datos a la impresora.');
            throw error;
        }
    }

    async disconnect() {
        if (this.device) {
            await BleClient.disconnect(this.device.deviceId);
            this.isPrinterConnected = false;
            this.device = null;
        }
    }
}
