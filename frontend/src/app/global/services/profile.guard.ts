import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ProfileStateService } from './profile-state.service';

@Injectable({ providedIn: 'root' })
export class ProfileGuard implements CanActivate {

  constructor(
    private profileState: ProfileStateService,
    private router: Router
  ) {}

  canActivate(): boolean {
    const profile = this.profileState.getProfile();

    if(!profile) {
      this.router.navigate(['/persona']);
      return false;
    }

    return true;
  }
}