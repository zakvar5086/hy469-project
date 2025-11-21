import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileStateService } from './profile-state.service';

@Injectable({ providedIn: 'root' })
export class ProfileRoutingService {

  constructor(
    private router: Router,
    private profileState: ProfileStateService
  ) {}

  redirectByPersona(profile: string) {
    this.profileState.setActiveProfile(profile);

    switch (profile) {
      case 'persona1':
        this.router.navigate(['/tablet/home'], { queryParams: { profile } });
        break;

      case 'persona2':
        this.router.navigate(['/phone/home'], { queryParams: { profile } });
        break;

      case 'persona3':
        this.router.navigate(['/speaker/home'], { queryParams: { profile } });
        break;

      case 'persona4':
        this.router.navigate(['/watch/home'], { queryParams: { profile } });
        break;

      default:
        this.router.navigate(['/tablet/home'], { queryParams: { profile } });
        break;
    }
  }
}