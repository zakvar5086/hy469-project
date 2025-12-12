import { Component, OnInit } from '@angular/core';
import { ProfileStateService } from './global/services/profile-state.service';
import { ProfileRoutingService } from './global/services/profile-routing.service';
import { QueryParamPreserveService } from './global/services/query-param-preserve.service';
import { PillPopupService } from './global/services/pill-popup.service';
import { PillReminderService } from './global/services/pill-reminder.service';
import { WatchPillPopupService } from './global/services/watch-pill-reminder.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  private currentRoute: string = '';

  constructor(
    private router: Router,
    private profileState: ProfileStateService,
    private profileRouting: ProfileRoutingService,
    private qpPreserver: QueryParamPreserveService,
    public pillPopupService: PillPopupService,
    private pillReminderService: PillReminderService,
    private watchPillPopupService: WatchPillPopupService
  ) {
    // Track current route
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event) => {
        const navEnd = event as NavigationEnd;
        this.currentRoute = navEnd.url;
      });
  }

  showNavbar(): boolean {
    const hideOnRoutes = ['/persona', '/watch', '/tablet/pill-details', '/phone/pill-details'];
    return !hideOnRoutes.some(route => this.router.url.startsWith(route));
  }

  
  
  showpopup(): boolean {
    const hideOnRoutes = ['/persona', '/watch'];
    return !hideOnRoutes.some(route => this.router.url.startsWith(route));
  }

  isWatchRoute(): boolean {
    return this.currentRoute.startsWith('/watch');
  }

  ngOnInit() {
    const saved = this.profileState.getUserProfile();

    if (saved) this.qpPreserver.enable();

    // Initial device detection
    this.profileRouting.initializeDeviceFromWidth();

    // Global resize listener
    window.addEventListener('resize', () => {
      this.profileRouting.updateDeviceOnResize();
    });

    // Start pill reminder service
    this.pillReminderService.startReminderChecks();
  }
}