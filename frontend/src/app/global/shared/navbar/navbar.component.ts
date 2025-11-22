import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProfileStateService } from 'src/app/global/services/profile-state.service';
import { ProfileRoutingService } from 'src/app/global/services/profile-routing.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

  constructor(
    private profileState: ProfileStateService,
    public routing: ProfileRoutingService
  ) {}

  get avatarSrc() {
    return this.profileState.getAvatarForDevice(this.routing.currentDevice);
  }

  navigateTo(route: string) {
    this.routing.navigateTo(route);
  }

  getIcon(name: string): string {
    const active = this.routing.isActive('/' + name);
    return active
      ? `assets/icons/${name}-blue.svg`
      : `assets/icons/${name}.svg`;
  }
}