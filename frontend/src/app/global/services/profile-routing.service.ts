import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileStateService, UserProfile } from './profile-state.service';
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

  redirectByPersona(persona: string) {

    let profile: UserProfile;

    switch (persona) {
      case 'persona1':
        profile = {
          persona,
          username: 'Eleni Papadaki',
          avatar: 'assets/avatars/persona1'
        };
        this.currentDevice = '/tablet';
        break;

      case 'persona2':
        profile = {
          persona,
          username: 'Maria Kostaki',
          avatar: 'assets/avatars/persona2'
        };
        this.currentDevice = '/phone';
        break;

      case 'persona3':
        profile = {
          persona,
          username: 'Sofia Lianou',
          avatar: 'assets/avatars/persona3'
        };
        this.currentDevice = '/speaker';
        break;

      case 'persona4':
        profile = {
          persona,
          username: 'Andreas Michas',
          avatar: 'assets/avatars/persona4'
        };
        this.currentDevice = '/watch';
        break;

      default:
        profile = {
          persona,
          username: 'Unknown',
          avatar: 'assets/avatars/default'
        };
        this.currentDevice = '/tablet';
    }

    this.profileState.setUserProfile(profile);
    this.qpPreserver.enable();
    this.router.navigate([`${this.currentDevice}/home`], {
      queryParams: { profile: persona }
    });
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

  isActive(route: string) {
    return this.router.url.startsWith(this.currentDevice + route);
  }
}