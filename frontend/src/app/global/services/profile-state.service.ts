import { Injectable } from '@angular/core';

export interface UserProfile {
  persona: string;
  username: string;
  avatar: string;
}

@Injectable({ providedIn: 'root' })
export class ProfileStateService {

  private profile: UserProfile | null = null;

  constructor() {
    const saved = localStorage.getItem('userProfile');
    if (saved) {
      this.profile = JSON.parse(saved);
      console.log("Loaded profile:", this.profile);
    }
  }

  setUserProfile(profile: UserProfile) {
    this.profile = profile;
    localStorage.setItem('userProfile', JSON.stringify(profile));
  }

  getUserProfile(): UserProfile | null {
    return this.profile;
  }

  getPersona(): string | null {
    return this.profile?.persona ?? null;
  }

  getUsername(): string | null {
    return this.profile?.username ?? null;
  }

  getAvatarBase(): string | null {
    return this.profile?.avatar ?? null;
  }

  getAvatarForDevice(device: string): string {
    const base = this.getAvatarBase();
    if (!base) return 'assets/avatars/default.svg';

    switch (device) {
      case '/tablet':
        return `${base}.svg`;
      case '/phone':
        return `${base}.svg`;
      case '/watch':
        return `${base}.svg`;
      default:
        return `${base}.svg`;
    }
  }

  clearProfile() {
    this.profile = null;
    localStorage.removeItem('userProfile');
  }
}