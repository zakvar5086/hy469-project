import { Injectable } from '@angular/core';
import { DataService, User } from './data.services';
import { take } from 'rxjs';

export interface UserProfile {
  persona: string;
  username: string;
  avatar: string;
  age?: number;
  name?: string;
}

@Injectable({ providedIn: 'root' })
export class ProfileStateService {

  private profile: UserProfile | null = null;

  constructor(private dataService: DataService) {
    const saved = localStorage.getItem('userProfile');
    if (saved) {
      this.profile = JSON.parse(saved);
    }
  }

  setUserProfile(profile: UserProfile) {
    this.profile = profile;
    localStorage.setItem('userProfile', JSON.stringify(profile));
  }

  setUserProfileFromData(personaId: string, callback?: () => void) {
    this.dataService.getUserById(personaId).pipe(take(1)).subscribe(user => {
      if (user) {
        const profile: UserProfile = {
          persona: user.id,
          username: user.username,
          avatar: user.avatar,
          age: user.age,
          name: user.name
        };
        this.setUserProfile(profile);
        if (callback) callback();
      } else {
        console.warn(`User with ID ${personaId} not found`);
      }
    });
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

  getName(): string | null {
    return this.profile?.name ?? null;
  }

  getAge(): number | null {
    return this.profile?.age ?? null;
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