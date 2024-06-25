import { Component, OnInit, ViewChild } from '@angular/core';
import { Messages } from 'src/app/helpers/messages';
import { LiquidationModel } from '../../models/liquidation-model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/service/users/auth.service';
import { LiquidationService } from '../../services/liquidation.service';
import { LiquidationDialogComponent } from '../liquidation-dialog/liquidation-dialog.component';

@Component({
  selector: 'app-liquidation-list',
  templateUrl: './liquidation-list.component.html',
  styleUrls: ['./liquidation-list.component.scss']
})
export class LiquidationListComponent implements OnInit {
    @ViewChild(LiquidationDialogComponent)
    LiquidationDialogComponent: LiquidationDialogComponent;
    loading: boolean = false;
    title: string = 'Listado de liquidaciones';
    liquidationList: LiquidationModel[];
    formFilter: FormGroup;
    constructor(
        private liquidationService: LiquidationService,
        private auth: AuthService,
        private formBuilder: FormBuilder,
    ) {}

    ngOnInit() {
        this._createFormBuild();
    }

    _createFormBuild() {
        const currentDate = new Date();
        const localDateString = new Date(currentDate.getTime() - currentDate.getTimezoneOffset() * 60000).toISOString().substring(0, 10);
        this.formFilter = this.formBuilder.group({
            from: [
                localDateString,
                Validators.required,
            ],
            to: [
                localDateString,
                Validators.required,
            ],
        });
    }

    async search() {
        try {
            this.loading = true;
            this.liquidationList = await this.liquidationService.getLiquidationByDate(
                this.formFilter.value.from,
                this.formFilter.value.to
            );
            Messages.closeLoading();
            this.loading = false;
        } catch (ex) {
            this.loading = false;
            Messages.warning('Advertencia', ex.message);
        }
    }

    liquidationModify(liquidation: LiquidationModel[]) {
        this.liquidationList = liquidation;
    }

    addLiquidation() {
        if(!this.auth.hasPermission("btn_agregar_liquidacion")){
             Messages.warning("No tiene acceso", "No puede agregar, por favor solicite el acceso.")
             return;
           }
        this.LiquidationDialogComponent.showDialog(new LiquidationModel(), true);
    }

    editLiquidation(liquidation: LiquidationModel){
        if(!this.auth.hasPermission("btn_editar_liquidacion")){
            Messages.warning("No tiene acceso", "No puede editar, por favor solicite el acceso.")
            return;
          }
       this.LiquidationDialogComponent.showDialog(liquidation, false);
    }

    viewLiquidation(liquidation: LiquidationModel) {
        if(!this.auth.hasPermission("btn_editar_liquidacion")){
             Messages.warning("No tiene acceso", "No puede agregar por favor solicite el acceso.")
             return;
           }
        this.LiquidationDialogComponent.showDialog(liquidation, false);
    }

}
