import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileStateService } from './profile-state.service';
import { QueryParamPreserveService } from './query-param-preserve.service';
import { DeviceService } from './device.service';
import { DataService } from './data.services';
import { take } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProfileRoutingService {

  currentDevice = '';

  constructor(
    private router: Router,
    private profileState: ProfileStateService,
    private qpPreserver: QueryParamPreserveService,
    private deviceService: DeviceService,
    private dataService: DataService
  ) {}

  redirectByPersona(persona: string) {
    // Load user data and device mapping from JSON
    this.dataService.getUserById(persona).pipe(take(1)).subscribe(user => {
      if (!user) {
        console.error(`User ${persona} not found`);
        return;
      }

      // Get the device mapping for this persona
      this.dataService.getDeviceForPersona(persona).pipe(take(1)).subscribe(deviceType => {
        if (!deviceType) {
          console.error(`Device mapping for ${persona} not found`);
          return;
        }

        // Map device type to route
        this.currentDevice = `/${deviceType}`;

        // Set the profile
        this.profileState.setUserProfileFromData(persona, () => {
          this.qpPreserver.enable();
          this.router.navigate([`${this.currentDevice}/home`], {
            queryParams: { profile: persona }
          });
        });
      });
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