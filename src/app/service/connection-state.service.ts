import { Injectable } from '@angular/core';
import { Network } from '@capacitor/network';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConnectionStateService {
  private forceOfflineSubject = new BehaviorSubject<boolean>(false);
  private networkStatusSubject = new BehaviorSubject<boolean>(true);
  forceOffline$ = this.forceOfflineSubject.asObservable();
  networkStatus$ = this.networkStatusSubject.asObservable();

  constructor() {
    this.initNetworkListener();
    this.loadConnectionState(); // Load the connection state from the local storage
  }

  private async initNetworkListener() {
    // Initial network status
    const status = await Network.getStatus();
    this.networkStatusSubject.next(status.connected);

    // Listen for changes
    Network.addListener('networkStatusChange', (status) => {
      this.networkStatusSubject.next(status.connected);
    });
  }

  toggleForceOffline(force: boolean) {
    this.forceOfflineSubject.next(force);
    this.saveConnectionState(); // Save the connection state to the local storage
  }

  isEffectivelyOffline(): boolean {
    return !this.networkStatusSubject.value || this.forceOfflineSubject.value;
  }

  private saveConnectionState() {
    const connectionState = {
      forceOffline: this.forceOfflineSubject.value,
      networkStatus: this.networkStatusSubject.value,
    };
    localStorage.setItem('connectionState', JSON.stringify(connectionState));
  }

  private loadConnectionState() {
    const connectionStateString = localStorage.getItem('connectionState');
    if (connectionStateString) {
      const connectionState = JSON.parse(connectionStateString);
      this.forceOfflineSubject.next(connectionState.forceOffline);
      this.networkStatusSubject.next(connectionState.networkStatus);
    }
  }
}
