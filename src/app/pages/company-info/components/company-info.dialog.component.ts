import { CompanyInfo } from './../../../models/company-info';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/service/common.service';
import { Messages } from 'src/app/helpers/messages';
import { AuthService } from 'src/app/service/users/auth.service';
import { User } from 'src/app/models/user';
import { FileToUpload } from 'src/app/models/file.to.upload';

@Component({
    selector: 'company-info-dialog',
    templateUrl: './company-info.dialog.component.html',
    styleUrls: ['./company-info.dialog.component.scss'],
})
export class CompanyInfoDialogComponent implements OnInit {
    @Output() companyModify = new EventEmitter<CompanyInfo[]>();
    company: CompanyInfo;
    isAdd: boolean;
    formMode: FormGroup;
    loading: boolean = false;
    display: boolean = false;
    usuario: User;
    fileid: number;
    files: FileToUpload[] = [];

    constructor(
        private fb: FormBuilder,
        private commonService: CommonService,
        private authService: AuthService
    ) {
        this.usuario = this.authService.UserValue;
    }

    ngOnInit() {
        this._createFormBuild();
    }

    showDialog(company: CompanyInfo, isAdd: boolean) {
        this.files = [];
        this.new();
        this.isAdd = isAdd;
        this.company = company;
        this.display = true;
        if (!this.isAdd) {
            const nuevoArchivo: FileToUpload = {
                path: company.path,
                extension: company.extension,
                description: '',
                fileId: company.fileId,
                name: '',
            };
            this.files.push(nuevoArchivo);
        }
        this._createFormBuild();
    }

    async _getImage() {
        try {
            let file = await this.commonService.GetFileById(
                this.company.fileId
            );
            this.files.push(file);
            Messages.closeLoading();
            this.loading = false;
        } catch (ex) {
            this.loading = false;
            Messages.warning('Advertencia', ex);
        }
    }
    _createFormBuild() {
        this.formMode = this.fb.group({
            id: [this.company.id ?? 0],
            companyName: [this.company.companyName ?? '', Validators.required],
            rtn: [this.company.rtn ?? '', Validators.required],
            addressLine1: [
                this.company.addressLine1 ?? '',
                Validators.required,
            ],
            addressLine2: [
                this.company.addressLine2 ?? '',
                Validators.required,
            ],
            phone1: [this.company.phone1 ?? '', Validators.required],
            phone2: [this.company.phone2 ?? '', Validators.required],
            email1: [this.company.email1 ?? '', Validators.required],
            email2: [this.company.email2 ?? '', Validators.required],
            taxValue: [this.company.taxValue * 100 ?? '', Validators.required],
            negativeInventory: [
                this.company.negativeInventory ?? false,
                Validators.required,
            ],
            printLetter: [
                this.company.printLetter ?? false,
                Validators.required,
            ],
            userId: [this.company.userId ?? this.usuario.userId],
        });
    }

    new() {
        this.company = undefined;
        this.formMode = undefined;
    }

    async add() {
        if (this.formMode.valid) {
            try {
                let company = this.formMode.value as CompanyInfo;
                company.fileId = this.fileid;
                Messages.loading('Agregando', 'Agregando datos de empresa');
                let modes = await this.commonService.addCompanyInfo(company);
                this.commonService.getCompanyInfoAsync();
                await Messages.closeLoading();
                Messages.Toas('Agregado Correctamente');
                this.companyModify.emit(modes);
                this.display = false;
            } catch (ex) {
                await Messages.closeLoading();
                Messages.warning('Advertencia', ex);
            }
        }
    }

    async edit() {
        if (this.formMode.valid) {
            try {
                let company = this.formMode.value as CompanyInfo;
                company.fileId = this.fileid;
                Messages.loading('Editando', 'Editando empresa');
                let modes = await this.commonService.editCompanyInfo(company);
                this.commonService.getCompanyInfoAsync();
                await Messages.closeLoading();
                Messages.Toas('Editado Correctamente');
                this.companyModify.emit(modes);
                this.display = false;
            } catch (ex) {
                await Messages.closeLoading();
                Messages.warning('Advertencia', ex);
            }
        }
    }

    OnFileSelect(file: FileToUpload) {
        this.files = [];
        this.files.push(file);
        this.fileid = file.fileId;
    }
}
