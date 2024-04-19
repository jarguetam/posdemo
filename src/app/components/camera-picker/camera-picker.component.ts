import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';

@Component({
    selector: 'camera-picker',
    templateUrl: './camera-picker.component.html',
    styleUrls: ['./camera-picker.component.scss'],
})
export class CameraPickerComponent implements OnInit {
    @Output() capture = new EventEmitter<any>();

    public showWebcam = false;
    public allowCameraSwitch = true;
    public multipleWebcamsAvailable = false;
    public deviceId: string;
    public videoOptions: MediaTrackConstraints = {
        // width: {ideal: 1024},
        // height: {ideal: 576}
    };
    public errors: WebcamInitError[] = [];

    // webcam snapshot trigger
    private trigger: Subject<void> = new Subject<void>();
    // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
    private nextWebcam: Subject<boolean | string> = new Subject<
        boolean | string
    >();
    loading: boolean;
    displayCam: boolean;
    constructor() {}

    ngOnInit(): void {
        WebcamUtil.getAvailableVideoInputs().then(
            (mediaDevices: MediaDeviceInfo[]) => {
                this.multipleWebcamsAvailable =
                    mediaDevices && mediaDevices.length > 1;
            }
        );
    }

    public triggerSnapshot(): void {
        this.trigger.next();
    }

    public toggleWebcam(): void {
        this.showWebcam = !this.showWebcam;
    }

    public handleInitError(error: WebcamInitError): void {
        this.errors.push(error);
    }

    public showNextWebcam(directionOrDeviceId: boolean | string): void {
        this.nextWebcam.next(directionOrDeviceId);
    }

    public async handleImage(webcamImage: WebcamImage) {
        const arr = webcamImage.imageAsDataUrl.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        const file: File = new File([u8arr], 'picture.png', {
            type: 'image/png',
        });
        this.capture.emit(file);
        this.displayCam = false;
        this.showWebcam = false;
    }

    addpicture() {
        this.loading = true;
        this.showWebcam = true;
        this.displayCam = true;
        this.loading = false;
    }

    hide(){
        this.showWebcam = false;
    }

    public cameraWasSwitched(deviceId: string): void {
        this.deviceId = deviceId;
    }

    public get triggerObservable(): Observable<void> {
        return this.trigger.asObservable();
    }

    public get nextWebcamObservable(): Observable<boolean | string> {
        return this.nextWebcam.asObservable();
    }
}
