import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileStateService } from './profile-state.service';
import { QueryParamPreserveService } from './query-param-preserve.service';

@Injectable({ providedIn: 'root' })
export class ProfileRoutingService {

  constructor(
    private router: Router,
    private profileState: ProfileStateService,
    private qpPreserver: QueryParamPreserveService
  ) {}

  redirectByPersona(profile: string) {
    this.profileState.setActiveProfile(profile);
    this.qpPreserver.enable();

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

  logoutToPersonaSelector() {
    this.profileState.clearProfile();

    // Disable QP preserver to prevent interference
    this.qpPreserver.disable();

    // Go back to /persona
    this.router.navigate(['/persona']);
}

}