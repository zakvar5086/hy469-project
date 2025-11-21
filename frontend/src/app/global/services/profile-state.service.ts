import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ProfileStateService {
  private activeProfile: string | null = null;

  setActiveProfile(profile: string) {
    this.activeProfile = profile;
  }

  getProfile() {
    return this.activeProfile;
  }
}