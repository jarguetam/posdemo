import { Component, OnInit } from '@angular/core';
import { Messages } from 'src/app/helpers/messages';
import { ItemJornalModel } from '../models/item-jornal-model';
import { ItemService } from '../service/items.service';

@Component({
  selector: 'app-view-jornal-items-dialog',
  templateUrl: './view-jornal-items-dialog.component.html',
  styleUrls: ['./view-jornal-items-dialog.component.scss']
})
export class ViewJornalItemsDialogComponent implements OnInit {
  loading: boolean;
    jornalList: ItemJornalModel[];
    display: boolean;

  constructor(private commonService: ItemService) { }

  ngOnInit(): void {
  }

  async _getData(itemId: number){
    try {
        this.loading = true;
        this.jornalList =
            await this.commonService.getItemsJornal(itemId);
        Messages.closeLoading();
        this.loading = false;
    } catch (ex) {
        this.loading = false;
        Messages.warning('Advertencia', ex.error.message);
    }
  }

  showDialog(itemId: number) {
    this._getData(itemId);
    this.display = true;
}

}
