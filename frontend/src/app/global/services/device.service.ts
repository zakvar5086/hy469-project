import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DeviceService {

  detect(): string {
    const w = window.innerWidth;

    if(w >= 900) return '/tablet';
    if(w >= 600) return '/phone';
    return '/watch'; // default small screen
  }
}