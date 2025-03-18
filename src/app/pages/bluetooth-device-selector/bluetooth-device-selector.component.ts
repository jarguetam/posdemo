import { Component, OnInit } from '@angular/core';
import { BleDevice } from '@capacitor-community/bluetooth-le';
import { PrinterConectionService } from 'src/app/service/printer-conection.service';
import { Location } from '@angular/common';
import { Messages } from 'src/app/helpers/messages';

@Component({
    selector: 'app-bluetooth-device-selector',
    templateUrl: './bluetooth-device-selector.component.html',
    styleUrls: ['./bluetooth-device-selector.component.scss'],
})
export class BluetoothDeviceSelectorComponent implements OnInit {
    devices: BleDevice[] = [];

    constructor(
      private printerService: PrinterConectionService,
      private location: Location
    ) {}

    ngOnInit(): void {
        Messages.closeLoading();
        this.scanForDevices();
    }

    async scanForDevices() {
      const hasPermissions = await this.printerService.requestPermissions();
      if (hasPermissions) {
        Messages.loading('Escaneando', 'Buscando dispositivos Bluetooth...');
        this.devices = await this.printerService.scanForDevices();
        Messages.closeLoading();

        if (this.devices.length === 0) {
          await Messages.warning('No se encontraron dispositivos', 'No se encontraron dispositivos Bluetooth cercanos.');
        } else {
          Messages.Toas(`Se encontraron ${this.devices.length} dispositivos.`, 'success');
        }
      } else {
        Messages.closeLoading();
        await Messages.warning('Error de permisos', 'No se pudo obtener los permisos necesarios para el escaneo Bluetooth.');
      }
    }

    async connectToDevice(device: BleDevice) {
      Messages.loading('Conectando', 'Intentando conectar al dispositivo...');
      const connected = await this.printerService.connectToPrinter(device.deviceId);
      Messages.closeLoading();

      if (connected) {
        await Messages.ok('Conectado', `Conectado exitosamente a ${device.name || 'dispositivo desconocido'}`);
        this.location.back();
      } else {
        await Messages.warning('Error de conexión', 'No se pudo conectar al dispositivo seleccionado.');
      }
    }
}
