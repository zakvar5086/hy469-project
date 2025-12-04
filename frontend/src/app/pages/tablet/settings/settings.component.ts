import { Component, OnInit } from '@angular/core';
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
export class SettingsComponent implements OnInit {

  appVersion = "1.0.0";
  project = "CS452";
  isKid= false;

  ngOnInit() {
    const persona = this.profileState.getPersona();
    this.isKid = persona === 'persona3';
    
  }
  constructor(
    private profileRouting: ProfileRoutingService,
    private profileState: ProfileStateService
  ) {}

  get username() {
    return this.profileState.getUsername();
  }

  get avatar() {
    return this.profileState.getAvatarForDevice('/phone');
  }

  changePersona() {
    this.profileRouting.logoutToPersonaSelector();
  }

  resetApp() {
    localStorage.clear();
    this.profileState.clearProfile();

    location.href = "/persona";
  }
}