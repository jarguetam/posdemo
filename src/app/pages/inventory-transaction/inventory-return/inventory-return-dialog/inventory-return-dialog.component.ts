import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Messages } from 'src/app/helpers/messages';
import { User } from 'src/app/models/user';
import { WareHouseModel } from 'src/app/pages/items/warehouse/models/warehouse';
import { ServiceWareHouseService } from 'src/app/pages/items/warehouse/service/service-ware-house.service';
import { AuthService } from 'src/app/service/users/auth.service';
import { InventoryReturnDetailModel } from '../models/inventory-return-detail';
import { InventoryReturnModel } from '../models/inventory-return-model';
import { InventoryReturnService } from '../services/inventory-return.service';
import { SellerModel } from 'src/app/pages/seller/models/seller';
import { SellerRegion } from 'src/app/pages/seller/models/seller-region';
import { SellerService } from 'src/app/pages/seller/service/seller.service';
import { DbLocalService } from 'src/app/service/db-local.service';

@Component({
    selector: 'app-inventory-return-dialog',
    templateUrl: './inventory-return-dialog.component.html',
    styleUrls: ['./inventory-return-dialog.component.scss'],
})
export class InventoryReturnDialogComponent implements OnInit {
    @Output() InventoryReturnModify = new EventEmitter<
        InventoryReturnModel[]
    >();

    return: InventoryReturnModel = new InventoryReturnModel();
    isAdd: boolean;
    isOffline: boolean;
    disabled: boolean = false;
    formReturn: FormGroup;
    loading: boolean = false;
    display: boolean = false;
    usuario: User;
    doctotal: number = 0;
    docQuantity: number = 0;
    wareHouseList: WareHouseModel[];
    index = 0;
    barcodeValue: string = '';
    sellerList: SellerModel[];
    regionList: SellerRegion[] = [];
    complete: boolean = false;
    private intervalId: any;

    constructor(
        private formBuilder: FormBuilder,
        private returnService: InventoryReturnService,
        private authService: AuthService,
        private wareHouseService: ServiceWareHouseService,
        private sellerServices: SellerService,
        private dbLocal: DbLocalService
    ) {
        this.usuario = this.authService.UserValue;
    }
    ngOnInit(): void {}

    startAutoSave() {
        this.intervalId = setInterval(async () => {
            if (this.isOffline) {
                // Verifica tu condición aquí
                await this.saveLocal(this.return, true);
            }
        }, 6000); // 60000 milisegundos = 1 minuto
    }

    ngOnDestroy() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    }

    onDialogHide() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    }

    async _getWareHouse() {
        try {
            this.loading = true;
            this.wareHouseList =
                await this.wareHouseService.getWarehouseActive();
            this.sellerList = await this.sellerServices.getSeller();
            this.regionList = await this.sellerServices.getSellerRegionActive();
            this.wareHouseList.unshift({
                whsCode: 0,
                whsName: 'Seleccione un almacen',
                createBy: 2,
                active: true,
                createByName: '',
                createDate: undefined,
                updateBy: 0,
                updateDate: undefined,
            });
            this.sellerList.unshift({
                sellerId: 0,
                sellerName: 'Seleccione la region',
                whsCode: 0,
                whsName: '',
                regionId: 0,
                regionName: '',
                createByName: '',
                createBy: 0,
                createDate: undefined,
                updateBy: 0,
                updateDate: undefined,
                active: true,
            });
            this.regionList.unshift({
                regionId: 0,
                nameRegion: 'Seleccione el vendedor',
                createBy: 0,
                createByName: '',
                createDate: undefined,
                updateBy: 0,
                updateDate: undefined,
                active: false,
            });
            Messages.closeLoading();
            this.loading = false;
        } catch (ex) {
            this.loading = false;
            Messages.warning('Advertencia', ex.error.message);
        }
    }

    showDialog(returnNew: InventoryReturnModel, isAdd: boolean) {
        this.display = true;
        this.new();
        this.isAdd = isAdd;
        this.isOffline = returnNew.offline;
        this.complete = returnNew.complete;
        this.disabled = returnNew.complete;
        this.return = returnNew;
        if (this.isOffline) {
            this.startAutoSave();
        }
        this._createFormBuild();
        this._getWareHouse();
    }

    _createFormBuild() {
        const currentDate = new Date();
        const localDateString = new Date(
            currentDate.getTime() - currentDate.getTimezoneOffset() * 60000
        )
            .toISOString()
            .substring(0, 10);
        if (this.isAdd) {
            this.return.docDate = currentDate;
        }
        this.formReturn = this.formBuilder.group({
            id: [this.return.id ?? 0],
            docDate: [localDateString],
            sellerId: [this.return.sellerId ?? 0, Validators.required],
            regionId: [this.return.regionId ?? 0, Validators.required],
            whsCode: [
                this.return.whsCode ?? this.usuario.whsCode,
                Validators.required,
            ],
            createdBy: [this.return.createdBy ?? this.usuario.userId],
            detail: [[]],
        });
    }

    new() {
        this.return = undefined;
        this.formReturn = undefined;
    }

    setSellerData() {
        this.formReturn.patchValue({
            regionId: this.sellerList.find(
                (x) => x.sellerId == this.formReturn.value.sellerId
            ).regionId,
        });
        this.formReturn.patchValue({
            whsCode: this.sellerList.find(
                (x) => x.sellerId == this.formReturn.value.sellerId
            ).whsCode,
        });
    }

    calculate(detail: InventoryReturnDetailModel) {
        setTimeout(() => {
            detail.quantityDiference =
                detail.quantityReturn - detail.quantityWareHouse;
            if (detail.quantityDiference < 0) {
                detail.comment = 'Faltante';
            } else if (detail.quantityDiference > 0) {
                detail.comment = 'Sobrantes';
            } else {
                detail.comment = 'Cuadrado';
            }
        }, 300);
    }

    calculateAll() {
        this.return.detail.forEach((detail) => {
            detail.quantityDiference =
                detail.quantityReturn - detail.quantityWareHouse;
            if (detail.quantityDiference < 0) {
                detail.comment = 'Faltante';
            } else if (detail.quantityDiference > 0) {
                detail.comment = 'Sobrantes';
            } else {
                detail.comment = 'Cuadrado';
            }
        });
    }

    async searchData() {
        try {
            this.loading = true;

            // Inicializar el detalle de retorno si está en línea
            if (!this.isOffline) {
                this.return.detail =
                    await this.returnService.getInventoryReturnResumen(
                        this.formReturn.value.docDate,
                        this.formReturn.value.whsCode
                    );
            } else {
                // Si está fuera de línea, obtener los datos offline y combinar con los nuevos resultados
                const offlineData = this.return.detail; // Método para obtener datos offline

                // Ahora busca cada ítem individualmente
                const onlineData =
                    await this.returnService.getInventoryReturnResumen(
                        this.formReturn.value.docDate,
                        this.formReturn.value.whsCode
                    );
                // Combina los datos offline y online, y actualiza las columnas necesarias
                this.return.detail = offlineData.map((offlineItem) => {
                    const matchingOnlineItem = onlineData.find(
                        (onlineItem) =>
                            onlineItem.itemCode === offlineItem.itemCode
                    );
                    if (matchingOnlineItem) {
                        // Actualizar las columnas del registro offline con la información del registro online
                        return {
                            ...offlineItem,
                            quantityInitial: matchingOnlineItem.quantityInitial,
                            quantityOutPut: matchingOnlineItem.quantityOutPut,
                            quantitySeller: matchingOnlineItem.quantitySeller,
                        };
                    }
                    return offlineItem;
                });

                // Añadir los nuevos ítems online que no están en los datos offline
                const newOnlineItems = onlineData.filter(
                    (onlineItem) =>
                        !offlineData.some(
                            (offlineItem) =>
                                offlineItem.itemCode === onlineItem.itemCode
                        )
                );
                this.return.detail = [...this.return.detail, ...newOnlineItems];
            }

            this.calculateAll();
            Messages.closeLoading();
            this.loading = false;
        } catch (ex) {
            this.loading = false;
            if (ex.error && ex.error.message) {
                Messages.warning('Advertencia', ex.error.message);
            } else {
                Messages.warning('Advertencia', ex.message);
            }
        }
    }

    async add() {
        if (this.formReturn.valid) {
            try {
                Messages.loading(
                    'Agregando',
                    'Agregando devolucion de mercaderia'
                );

                let newReturn = this.formReturn.value as InventoryReturnModel;
                newReturn.detail = this.return.detail;
                let returnResult = await this.returnService.add(newReturn);
                Messages.closeLoading();
                Messages.Toas('Agregado Correctamente');

                if (this.isOffline) {
                    if (this.intervalId) {
                        clearInterval(this.intervalId);
                    }
                    await this.dbLocal.inventoryReturn.delete(
                        this.return.idOffline
                    );
                }
                const currentDate = new Date();
                const localDateString = new Date(
                    currentDate.getTime() -
                        currentDate.getTimezoneOffset() * 60000
                )
                    .toISOString()
                    .substring(0, 10);
                this.InventoryReturnModify.emit(
                    await this.returnService.getByDate(
                        localDateString,
                        localDateString
                    )
                );
                this.display = false;
                this.index = 0;
            } catch (ex) {
                Messages.closeLoading();
                if (ex.error && ex.error.message) {
                    Messages.warning('Advertencia', ex.error.message);
                } else {
                    Messages.warning('Advertencia', ex.message);
                }
            }
        }
    }

    async saveLocal(returnInventory: InventoryReturnModel, close: boolean) {
        let newReturn = this.formReturn.value as InventoryReturnModel;
        newReturn.idOffline = returnInventory.idOffline;
        newReturn.offline = true;
        newReturn.detail = returnInventory.detail;
        newReturn.sellerName = this.sellerList.find(
            (x) => x.sellerId == newReturn.sellerId
        ).sellerName;
        newReturn.regionName = this.regionList.find(
            (x) => x.regionId == newReturn.regionId
        ).nameRegion;
        newReturn.createdByName = this.usuario.name;
        if (newReturn.idOffline != undefined) {
            // Si el registro existe, actualizar
            await this.dbLocal
                .table('inventoryReturn')
                .update(newReturn.idOffline, newReturn);
            Messages.Toas('Actualizado localmente');
        } else {
            // Si el registro no existe, agregar
            await this.dbLocal.table('inventoryReturn').add(newReturn);
            Messages.Toas('Guardado localmente');
        }
        const currentDate = new Date();
        const localDateString = new Date(
            currentDate.getTime() - currentDate.getTimezoneOffset() * 60000
        )
            .toISOString()
            .substring(0, 10);
        this.InventoryReturnModify.emit(
            await this.returnService.getByDate(localDateString, localDateString)
        );
        this.display = close;
        if (!close) {
            if (this.intervalId) {
                clearInterval(this.intervalId);
            }
        }
        this.index = 0;
    }

    async edit() {
        if (this.formReturn.valid) {
            try {
                Messages.loading(
                    'Editando',
                    'Editando devolucion de mercaderia'
                );
                let newReturn = this.formReturn.value as InventoryReturnModel;
                newReturn.detail = this.return.detail;
                let returnResult = await this.returnService.edit(newReturn);
                Messages.closeLoading();
                Messages.Toas('Editado Correctamente');
                this.InventoryReturnModify.emit(returnResult);
                this.display = false;
                this.index = 0;
            } catch (ex) {
                Messages.closeLoading();
                if (ex.error && ex.error.message) {
                    Messages.warning('Advertencia', ex.error.message);
                } else {
                    Messages.warning('Advertencia', ex.message);
                }
            }
        }
    }
    async completeReturn() {
        if (this.formReturn.valid) {
            try {
                Messages.loading(
                    'Completando',
                    'Completando devolucion de mercaderia'
                );
                let newReturn = this.formReturn.value as InventoryReturnModel;
                newReturn.detail = this.return.detail;
                let returnResult = await this.returnService.edit(newReturn);
                Messages.closeLoading();
                Messages.Toas('Completado Correctamente');
                this.InventoryReturnModify.emit(returnResult);
                this.display = false;
                this.index = 0;
            } catch (ex) {
                Messages.closeLoading();
                if (ex.error && ex.error.message) {
                    Messages.warning('Advertencia', ex.error.message);
                } else {
                    Messages.warning('Advertencia', ex.message);
                }
            }
        }
    }
}
