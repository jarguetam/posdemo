import { Injectable } from '@angular/core';
import { Subject, timer } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from './users/auth.service';
import { Messages } from '../helpers/messages';

@Injectable({
    providedIn: 'root',
})
export class InactivityService {
    private inactivityTimeout = 20 * 60 * 1000; // 20 minutos en milisegundos
    private lastAction: number;
    private inactivityTimer;
    public display: boolean;
    private countdownInterval;
    public countdown: number = 30;
    private displaySubject = new Subject<boolean>();
    get display$() {
        return this.displaySubject.asObservable();
    }

    constructor(private authService: AuthService, private router: Router) {
        this.lastAction = Date.now();
        this.setupTimer();
        this.setupEventListeners();
    }

    private setupTimer() {
        this.inactivityTimer = timer(0, 1000).subscribe(() => {
            const currentTime = Date.now();
            const timeDifference = currentTime - this.lastAction;
            if (timeDifference >= this.inactivityTimeout) {
                if (!this.router.url.includes('/login')) {
                    this.setupInactivityTimer();
                    if (this.countdown === 0) {
                        this.authService.logout();
                        Messages.warning(
                            'Sesión expirada...',
                            'Se cerró su sesión debido a inactividad, favor vuelva a ingresar.'
                        );
                        this.countdown = 30;
                    }
                }
            }
        });
    }

    private setupEventListeners() {
        document.addEventListener('mousemove', () => this.resetTimer());
        document.addEventListener('keydown', () => this.resetTimer());
    }

    public resetTimer() {
        this.lastAction = Date.now();
        this.display = false;
        this.countdown = 30;
        this.displaySubject.next(this.display);
    }

    public setupInactivityTimer() {
        this.display = true;
        this.countdown -= 1;
        this.displaySubject.next(this.display);
        if (this.countdown === 0) {
            //clearInterval(this.countdownInterval);
            this.hideInactivityModal();
        }
    }

    public hideInactivityModal() {
        this.display = false;
       // clearInterval(this.countdownInterval);
       // this.setupTimer(); // Reinicia el temporizador general después de ocultar el modal
    }
}
