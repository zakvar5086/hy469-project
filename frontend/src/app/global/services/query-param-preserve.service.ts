import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { filter } from 'rxjs';
import { ProfileStateService } from './profile-state.service';

@Injectable({ providedIn: 'root' })
export class QueryParamPreserveService {

  constructor(private router: Router, private profileState: ProfileStateService) {
    this.router.events
      .pipe(filter(e => e instanceof NavigationStart))
      .subscribe((e: NavigationStart) => {

        const profile = this.profileState.getProfile();
        if (!profile) return;

        const url = e.url.split('?')[0];

        this.router.navigate([url], {
          queryParams: { profile },
          replaceUrl: true
        });
      });
  }
}