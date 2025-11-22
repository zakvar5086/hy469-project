import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ProfileStateService {
  
  private activeProfile: string | null = null;

  constructor() {
    const saved = localStorage.getItem('activeProfile');
    if(saved) {
      this.activeProfile = saved;
    }
  }

  setActiveProfile(profile: string) {
    this.activeProfile = profile;
    localStorage.setItem('activeProfile', profile);
  }

  getProfile() {
    return this.activeProfile;
  }

  clearProfile() {
    this.activeProfile = null;
    localStorage.removeItem('activeProfile');
  }

  getAvatarForDevice(device: string): string {
    const profile = this.getProfile();

    // Fallback if no persona
    if(!profile) return 'assets/avatars/persona1.svg';

    switch (device) {
      case '/tablet':
        return `assets/avatars/${profile}.svg`;
      case '/phone':
        return `assets/avatars/${profile}.svg`;
      case '/watch':
        return `assets/avatars/${profile}.svg`;
      default:
        return `assets/avatars/${profile}.svg`;
    }
  }
}