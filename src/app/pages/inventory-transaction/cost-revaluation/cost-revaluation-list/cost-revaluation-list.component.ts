import { Component, OnInit, ViewChild } from '@angular/core';
import { CostRevaluationDialogComponent } from '../cost-revaluation-dialog/cost-revaluation-dialog.component';
import { CostRevaluationModel } from '../models/cost-revaluation-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CostRevaluationService } from '../services/cost-revaluation.service';
import { AuthService } from 'src/app/service/users/auth.service';
import { Messages } from 'src/app/helpers/messages';
import { PrintCostRevaluationService } from '../services/print-cost-revaluation.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-cost-revaluation-list',
  templateUrl: './cost-revaluation-list.component.html',
  styleUrls: ['./cost-revaluation-list.component.scss']
})
export class CostRevaluationListComponent implements OnInit {
    @ViewChild(CostRevaluationDialogComponent)
    CostRevaluationDialog: CostRevaluationDialogComponent;
    loading: boolean = false;
    title: string = 'Listado de revalorizaciones de costo de articulos';
    costRevaluationList: CostRevaluationModel[];
    formFilter: FormGroup;
    constructor(
        private costRevaluationServices: CostRevaluationService,
        private auth: AuthService,
        private formBuilder: FormBuilder,
        private printService: PrintCostRevaluationService,
        private datePipe: DatePipe,
    ) {}

    ngOnInit() {
        this._createFormBuild();
    }

    _createFormBuild() {
        this.formFilter = this.formBuilder.group({
            from: [
                new Date(),
                Validators.required,
            ],
            to: [
                new Date(),
                Validators.required,
            ],
        });
    }

    async search() {
        try {
            this.loading = true;
            this.costRevaluationList = await this.costRevaluationServices.getByDate(
                this.datePipe.transform(this.formFilter.value.from, 'yyyy-MM-dd'),
                this.datePipe.transform(this.formFilter.value.to, 'yyyy-MM-dd')
            );
            Messages.closeLoading();
            this.loading = false;
        } catch (ex) {
            this.loading = false;
            Messages.warning('Advertencia', ex.error);
        }
    }

    costRevaluationModify(costRevaluation: CostRevaluationModel[]) {
        this.costRevaluationList = costRevaluation;
    }

    addEntry() {
        if(!this.auth.hasPermission("btn_add_cost_revaluation")){
             Messages.warning("No tiene acceso", "No puede agregar, por favor solicite el acceso")
             return;
           }
        this.CostRevaluationDialog.showDialog(new CostRevaluationModel(), true);
    }

    viewEntry(costRevaluation: CostRevaluationModel) {
        if(!this.auth.hasPermission("btn_edit_cost_revaluation")){
             Messages.warning("No tiene acceso", "No puede agregar por favor solicite el acceso")
             return;
           }
        this.CostRevaluationDialog.showDialog(costRevaluation, false);
    }

    print(costRevaluation: CostRevaluationModel){
        costRevaluation.detail =[];
        costRevaluation.detail.push(costRevaluation);
        this.printService.printRequestEntry(costRevaluation);
    }
}
