import { BpJornalModel } from './../../../models/bpJornal-model';
import { CommonService } from 'src/app/service/common.service';
import { Component, OnInit } from '@angular/core';
import { Messages } from 'src/app/helpers/messages';

@Component({
    selector: 'app-view-jornal-bp-dialog',
    templateUrl: './view-jornal-bp-dialog.component.html',
    styleUrls: ['./view-jornal-bp-dialog.component.scss'],
})
export class ViewJornalBpDialogComponent implements OnInit {
    jornalBpList: BpJornalModel[];
    loading: boolean;
    display: boolean = false;
    constructor(private commonService: CommonService) {}

    ngOnInit(): void {}

    getBackgroundColor(transValue: number): string {
        return transValue < 0 ? '#FFA500' : '#87CEEB'; // Orange for negative values, light blue for others
    }

    async _getData(bpid: number, type: string) {
        try {
            this.loading = true;
            this.jornalBpList = await this.commonService.getJornalBp(
                bpid,
                type
            );
            Messages.closeLoading();
            this.loading = false;
        } catch (ex) {
            this.loading = false;
            Messages.warning('Advertencia', ex.error.message);
        }
    }

    showDialog(bpid: number, type: string) {
        this._getData(bpid, type);
        this.display = true;
    }
}
