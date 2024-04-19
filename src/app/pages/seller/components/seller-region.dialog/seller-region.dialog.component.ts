import { SellerService } from './../../service/seller.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user';
import { SellerRegion } from '../../models/seller-region';
import { AuthService } from 'src/app/service/users/auth.service';
import { Messages } from 'src/app/helpers/messages';

@Component({
    selector: 'app-seller-region-dialog',
    templateUrl: './seller-region.dialog.component.html',
    styleUrls: ['./seller-region.dialog.component.scss'],
})
export class SellerRegionDialogComponent implements OnInit {
    @Output() SellerRegionModify = new EventEmitter<SellerRegion[]>();
    sellerRegion: SellerRegion;
    isAdd: boolean;
    formSellerRegion: FormGroup;
    loading: boolean = false;
    display: boolean = false;
    usuario: User;
    constructor(
        private fb: FormBuilder,
        private sellerService: SellerService,
        private authService: AuthService
    ) {
        this.usuario = this.authService.UserValue;
    }

    ngOnInit(): void {
        this._createFormBuild();
    }

    showDialog(sellerRegion:SellerRegion, isAdd:boolean) {
        this.new();
        this.isAdd = isAdd;
        this.sellerRegion = sellerRegion;
        this._createFormBuild();
        this.display = true;
    }

    _createFormBuild(){
        this.formSellerRegion = this.fb.group({
        regionId: [this.sellerRegion.regionId??0],
        nameRegion: [this.sellerRegion.nameRegion??"", Validators.required],
        createBy: [this.sellerRegion.createBy??this.usuario.userId],
        active: [this.sellerRegion.active??false],
    })
    }

    new(){
        this.sellerRegion = undefined;
        this.formSellerRegion = undefined;
    }


    async add(){
        if(this.formSellerRegion.valid){
            try{
                Messages.loading("Agregando", "Agregando region de vendedor");
                let request  =this.formSellerRegion.value as SellerRegion;
                let region = await this.sellerService.addSellerRegion(request);
                Messages.closeLoading();
                Messages.Toas("Agregando Correctamente");
                this.SellerRegionModify.emit(region);
                this.display = false;
            }
            catch(ex){
                Messages.closeLoading();
                Messages.warning("Advertencia", ex);
            }
        }
    }
    async edit(){
        if(this.formSellerRegion.valid){
            try{
                Messages.loading("Editando", "Editando region de vendedor");
                let request  =this.formSellerRegion.value as SellerRegion;
                let users = await this.sellerService.editSellerRegion(request);
                Messages.closeLoading();
                Messages.Toas("Editado Correctamente");
                this.SellerRegionModify.emit(users);
                this.display = false;
            }
            catch(ex){
                Messages.closeLoading();
                Messages.warning("Advertencia", ex);
            }
        }
    }
}
