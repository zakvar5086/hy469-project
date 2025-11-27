import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileRoutingService } from 'src/app/global/services/profile-routing.service';
import { ProfileStateService } from 'src/app/global/services/profile-state.service';

@Component({
  selector: 'tablet-settings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {

  username = "Eleni";
  avatar = "assets/avatars/persona1.svg";
  appVersion = "1.0.0";
  project = "CS452";
  

  constructor(
    private profileRouting: ProfileRoutingService,
    private profileState: ProfileStateService
  ) {}

  changePersona() {
    this.profileRouting.logoutToPersonaSelector();
  }

  resetApp() {
    localStorage.clear();
    this.profileState.clearProfile();

    location.href = "/persona";
  }
}