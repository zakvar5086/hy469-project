import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
    private router: Router,
    private profileState: ProfileStateService,
    private profileRouting: ProfileRoutingService,
    private qpPreserver: QueryParamPreserveService
  ) {}

  ngOnInit() {
    const saved = this.profileState.getProfile();
    if(saved) {
      // Automatically start preserving query params
      this.qpPreserver.enable();

      // Automatically reroute the user to their persona home
      this.profileRouting.redirectByPersona(saved);
    }
  }
}