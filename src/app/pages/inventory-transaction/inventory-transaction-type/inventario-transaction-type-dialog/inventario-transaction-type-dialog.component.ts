import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Messages } from 'src/app/helpers/messages';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/service/users/auth.service';
import { InventoryTransactionTypeModel } from '../model/inventory-type-model';
import { InventoryTypeService } from '../services/inventory-type.service';

@Component({
  selector: 'app-inventario-transaction-type-dialog',
  templateUrl: './inventario-transaction-type-dialog.component.html',
  styleUrls: ['./inventario-transaction-type-dialog.component.scss']
})
export class InventarioTransactionTypeDialogComponent implements OnInit {
    @Output() InventoryTransactionTypeModify = new EventEmitter<InventoryTransactionTypeModel[]>();
    inventoryTransactionType: InventoryTransactionTypeModel;
    isAdd: boolean;
    formInventoryTransactionType: FormGroup;
    loading: boolean = false;
    display: boolean = false;
    usuario: User;
    transactionList: any[];

    constructor(
        private fb: FormBuilder,
        private itemService: InventoryTypeService,
        private authService: AuthService
    ) {
        this.usuario = this.authService.UserValue;
        this.transactionList= [
            { id: 'N', value: 'Seleccione un tipo' },
            { id: 'E', value: 'Entrada de inventario' },
            { id: 'S', value: 'Salida de inventario' },
            { id: 'T', value: 'Transferencia' }
          ];
    }

    ngOnInit(): void {
        this._createFormBuild();

    }

    showDialog(inventoryTransactionType: InventoryTransactionTypeModel, isAdd: boolean) {
        this.new();
        this.isAdd = isAdd;
        this.inventoryTransactionType = inventoryTransactionType;
        this._createFormBuild();
        this.display = true;

    }

    _createFormBuild() {
        this.formInventoryTransactionType = this.fb.group({
            id: [this.inventoryTransactionType.id ?? 0],
            name: [
                this.inventoryTransactionType.name ?? '',
                Validators.required,
            ],
            transaction: [this.inventoryTransactionType.transaction ?? 'N'],
            createBy: [this.inventoryTransactionType.createBy ?? this.usuario.userId],
        });

    }

    new() {
        this.inventoryTransactionType = undefined;
        this.formInventoryTransactionType = undefined;

    }

    async add() {
        if (this.formInventoryTransactionType.valid) {
            try {
                Messages.loading(
                    'Agregando',
                    'Agregando tipo de ajuste de inventario'
                );
                let request = this.formInventoryTransactionType.value as InventoryTransactionTypeModel;
                let region = await this.itemService.addInventoryTransactionType(request);
                Messages.closeLoading();
                Messages.Toas('Agregando Correctamente');
                this.InventoryTransactionTypeModify.emit(region);
                this.display = false;
            } catch (ex) {
                Messages.closeLoading();
                Messages.warning('Advertencia', ex.error.message);
            }
        }
    }

    async edit() {
        if (this.formInventoryTransactionType.valid) {
            try {
                Messages.loading('Editando', 'Editando tipo de ajuste de inventario');
                let request = this.formInventoryTransactionType.value as InventoryTransactionTypeModel;
                let users = await this.itemService.editInventoryTransactionType(request);
                Messages.closeLoading();
                Messages.Toas('Editado Correctamente');
                this.InventoryTransactionTypeModify.emit(users);
                this.display = false;
            } catch (ex) {
                Messages.closeLoading();
                Messages.warning('Advertencia', ex.error.message);
            }
        }
    }

}
