import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { filter } from 'rxjs';
import { ProfileStateService } from './profile-state.service';

@Injectable({ providedIn: 'root' })
export class QueryParamPreserveService {

  private enabled = false;

  constructor(
    private router: Router,
    private profileState: ProfileStateService
  ) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationStart))
      .subscribe(event => {

        if (!this.enabled) return;

        const profile = this.profileState.getPersona();
        if (!profile) return;

        const nav = event as NavigationStart;

        if (nav.url.includes(`profile=${profile}`)) return;

        const url = nav.url.split('?')[0];

        this.router.navigate([url], {
          queryParams: { profile },
          replaceUrl: true
        });
      });
  }

  enable() { this.enabled = true; }
  disable() { this.enabled = false; }
}