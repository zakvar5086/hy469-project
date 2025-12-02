import { Component, OnInit } from '@angular/core';
import { ProfileStateService } from './global/services/profile-state.service';
import { ProfileRoutingService } from './global/services/profile-routing.service';
import { QueryParamPreserveService } from './global/services/query-param-preserve.service';
import { PillPopupService } from './global/services/pill-popup.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    private router: Router,
    private profileState: ProfileStateService,
    private profileRouting: ProfileRoutingService,
    private qpPreserver: QueryParamPreserveService,
    public pillPopupService: PillPopupService
  ) {}

  showNavbar(): boolean {
    return !this.router.url.startsWith('/persona');
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
  }
}