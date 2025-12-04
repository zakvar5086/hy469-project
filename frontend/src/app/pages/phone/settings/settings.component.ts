import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileRoutingService } from 'src/app/global/services/profile-routing.service';
import { ProfileStateService } from 'src/app/global/services/profile-state.service';
import { Router, RouterModule } from '@angular/router';

@Component({
    selector: 'app-settings',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
    appVersion = "1.0.0";
    project = "CS452";
    isKid=false;

    ngOnInit() {
    const persona = this.profileState.getPersona();
    this.isKid = persona === 'persona3';
  }

    constructor(
        private profileRouting: ProfileRoutingService,
        private profileState: ProfileStateService,
        private router: Router
    ) {}

    get username() {
        return this.profileState.getUsername() || 'User';
    }

    get avatar() {
        return this.profileState.getAvatarForDevice('/watch');
    }

    get name() {
        return this.profileState.getName() || 'User';
    }

    get age() {
        return this.profileState.getAge() || 'N/A';
    }

    changePersona() {
        this.profileRouting.logoutToPersonaSelector();
    }

    resetApp() {
        localStorage.clear();
        this.profileState.clearProfile();
        location.href = "/persona";
    }

    navigateTo(route: string) {
        this.profileRouting.navigateTo(route);
    }
}
