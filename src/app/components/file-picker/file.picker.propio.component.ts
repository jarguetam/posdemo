import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Messages } from 'src/app/helpers/messages';
import { FileToUpload } from 'src/app/models/file.to.upload';
import { CommonService } from 'src/app/service/common.service';
import { environment } from 'src/environments/environment';
import { CameraPickerComponent } from '../camera-picker/camera-picker.component';

@Component({
    selector: 'file-picker-propio-component',
    templateUrl: './file.picker.propio.component.html',
    styleUrls: ['./file.picker.propio.component.scss'],
})
export class FilePickerPropioComponent implements OnInit {
    @ViewChild(CameraPickerComponent) CameraPicker: CameraPickerComponent;
    @Input() title: string = '';
    loading: boolean = false;
    @Input() files: FileToUpload[] = [];
    @Input() accept: string = '.png, .jpg, .pdf';
    @Output() OnFileSelect = new EventEmitter<FileToUpload>();
    baseUrl: string = '';

    constructor(private common: CommonService) {}

    ngOnInit() {
        this.baseUrl =
            environment.uriLogistic + '/api/Common/DownloadFile?Path=';
    }

    async handleChangeFile(e: any, isPhoto: boolean) {
        try {
            let file;
            isPhoto? file= e: file = e.target.files[0];
            const ACCEPTED_UPLOAD_SIZE = 5120; // 1MB
            if (this.bytesToSize(file.size) > ACCEPTED_UPLOAD_SIZE) {
                Messages.warning(
                    'Advertencia',
                    'El archivo es demasiado grande'
                );
                return;
            }
            let lastIndex = file.name.toString().lastIndexOf('.');
            if (lastIndex == -1) {
                Messages.warning(
                    'Advertencia',
                    'El archivo es incorrecto o tiene un mal nombre'
                );
                return;
            }
            this.loading = true;
            let fileUpload = await this.common.uploadFile(file);

            this.loading = false;

            this.OnFileSelect.emit(fileUpload);
        } catch (ex) {
            this.loading = false;
            Messages.warning('Advertencia', ex.error.message);
        }
    }

    async takePicture()
    {
        this.CameraPicker.addpicture();
    }

    goToLink(url: string) {
        window.open(this.baseUrl + url, '_blank');
    }

    bytesToSize(bytes: any) {
        // var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes === 0) return 0;
        // var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round(bytes / 1024);
    }
}
