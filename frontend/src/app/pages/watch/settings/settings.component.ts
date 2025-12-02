import { Component } from '@angular/core';
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
export class SettingsComponent {
    username = "Nikos";
    avatar = "assets/avatars/persona2.svg";
    appVersion = "1.0.0";
    project = "CS452";
    

    constructor(
        private profileRouting: ProfileRoutingService,
        private profileState: ProfileStateService,
        private router: Router
    ) {}

    changePersona() {
        this.profileRouting.logoutToPersonaSelector();
    }

    resetApp() {
        localStorage.clear();
        this.profileState.clearProfile();

        location.href = "/persona";
    }


        
    private getDevicePrefix(): string {
        return '/watch/';
    }

     navigateTo(route: string) {
        console.log("Navigating to", route);  
        const device = this.getDevicePrefix();
        this.router.navigate([device + route], {
          queryParamsHandling: 'merge'
        });
      }
}
