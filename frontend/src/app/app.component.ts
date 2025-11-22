import { Component, OnInit } from '@angular/core';
import { ProfileStateService } from './global/services/profile-state.service';
import { ProfileRoutingService } from './global/services/profile-routing.service';
import { QueryParamPreserveService } from './global/services/query-param-preserve.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    private profileState: ProfileStateService,
    private profileRouting: ProfileRoutingService,
    private qpPreserver: QueryParamPreserveService
  ) {}

  ngOnInit() {
    const saved = this.profileState.getProfile();

    if (saved) {
      this.qpPreserver.enable();
    }

    // Initial device detection
    this.profileRouting.initializeDeviceFromWidth();

    // Global resize listener
    window.addEventListener('resize', () => {
      this.profileRouting.updateDeviceOnResize();
    });
  }
}