import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DeviceService {

  detect(): string {
    const w = window.innerWidth;

    if (w >= 768) return '/tablet';
    if (w >= 321) return '/phone';

    return '/watch';
  }
}