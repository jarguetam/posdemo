import { Component, OnInit } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { InactivityService } from 'src/app/service/inactivity.service';


@Component({
    selector: 'app-inactivity-modal',
    templateUrl: './inactivity-modal.component.html',
    styleUrls: ['./inactivity-modal.component.scss'],
    animations: [
        trigger('countdown', [
            transition(':decrement', [
                style({ transform: 'scale(1.2)' }),
                animate('1s ease-out', style({ transform: 'scale(1)' }))
            ])
        ])
    ]
})
export class InactivityModalComponent implements OnInit {
    display: boolean = false;
    countdown: number;

    constructor(private inactiveService: InactivityService) {}

    ngOnInit(): void {
        this.inactiveService.display$.subscribe((display) => {
            this.display = display;
            if (display) {
                this.setupInactivityTimer();
            }
        });
    }

    public setupInactivityTimer() {
        this.display = this.inactiveService.display;
        this.countdown = this.inactiveService.countdown;
    }


}
