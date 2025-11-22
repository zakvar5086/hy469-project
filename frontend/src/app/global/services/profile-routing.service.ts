import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileStateService } from './profile-state.service';
import { QueryParamPreserveService } from './query-param-preserve.service';
import { DeviceService } from './device.service';

@Injectable({ providedIn: 'root' })
export class ProfileRoutingService {

  currentDevice = '';

  constructor(
    private router: Router,
    private profileState: ProfileStateService,
    private qpPreserver: QueryParamPreserveService,
    private deviceService: DeviceService
  ) {}

  redirectByPersona(profile: string) {
    this.profileState.setActiveProfile(profile);
    this.qpPreserver.enable();

    switch (profile) {
      case 'persona1':
        this.currentDevice = '/tablet';
        this.router.navigate(['/tablet/home'], { queryParams: { profile } });
        break;

      case 'persona2':
        this.currentDevice = '/phone';
        this.router.navigate(['/phone/home'], { queryParams: { profile } });
        break;

      case 'persona3':
        this.currentDevice = '/speaker';
        this.router.navigate(['/speaker/home'], { queryParams: { profile } });
        break;

      case 'persona4':
        this.currentDevice = '/watch';
        this.router.navigate(['/watch/home'], { queryParams: { profile } });
        break;

      default:
        this.currentDevice = '/tablet';
        this.router.navigate(['/tablet/home'], { queryParams: { profile } });
        break;
    }
  }

  logoutToPersonaSelector() {
    this.profileState.clearProfile();
    this.qpPreserver.disable();
    this.router.navigate(['/persona']);
  }

  initializeDeviceFromWidth() {
    this.currentDevice = this.deviceService.detect();
  }

  updateDeviceOnResize() {
    const newDevice = this.deviceService.detect();

    if (newDevice !== this.currentDevice) {
      this.currentDevice = newDevice;
      this.switchToCurrentDevice();
    }
  }

  private switchToCurrentDevice() {
    const current = this.router.url.split('?')[0];
    const page = current.split('/')[2] || 'home';

    this.router.navigate([`${this.currentDevice}/${page}`], {
      queryParamsHandling: 'merge'
    });
  }

  navigateTo(route: string) {
    this.router.navigate([`${this.currentDevice}${route}`], {
      queryParamsHandling: 'merge'
    });
  }

  isActive(route: string): boolean {
    return this.router.url.startsWith(this.currentDevice + route);
  }
}