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
    // Fetch user data
    this.dataService.getUserById(persona).pipe(take(1)).subscribe(user => {
      if (!user) {
        console.error(`User ${persona} not found`);
        return;
      }

      // Detect device if not already set
      if (!this.currentDevice) {
        this.currentDevice = this.deviceService.detect();
      }

      // Set the profile
      this.profileState.setUserProfileFromData(persona, () => {
        this.qpPreserver.enable();
        this.router.navigate([`${this.currentDevice}/home`], {
          queryParams: { profile: persona }
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
    // Get URL without query params
    const current = this.router.url.split('?')[0];
    // Split the path into segments
    const segments = current.split('/');
    // Extract segments after the device segment
    const pathSegments = segments.slice(2);
    // Construct new path with the current device
    const newPath = [this.currentDevice, ...pathSegments].join('/');

    this.router.navigate([newPath], {
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