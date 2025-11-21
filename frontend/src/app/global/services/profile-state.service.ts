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
}