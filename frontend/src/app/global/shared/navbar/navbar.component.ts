import { Component, HostListener, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ProfileStateService } from 'src/app/global/services/profile-state.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  avatarSrc = '';

  constructor(
    private router: Router,
    private profileState: ProfileStateService
  ) {}

  ngOnInit() {
    this.updateAvatar();
  }

  @HostListener('window:resize')
  onResize() {
    this.updateAvatar();
    this.autoSwitchDeviceOnResize();
  }

  updateAvatar() {
    const device = this.getDeviceFromWidth();
    this.avatarSrc = this.profileState.getAvatarForDevice(device);
  }

  getDeviceFromWidth(): string {
    const w = window.innerWidth;
    if (w >= 900) return '/tablet';
    if (w >= 600) return '/phone';
    return '/watch';
  }

  getDevicePrefix(): string {
    const url = this.router.url.split('?')[0];

    // If route already indicates device, use that
    if (url.startsWith('/tablet')) return '/tablet';
    if (url.startsWith('/phone')) return '/phone';
    if (url.startsWith('/watch')) return '/watch';
    if (url.startsWith('/speaker')) return '/speaker';

    // Otherwise fallback to detection
    return this.getDeviceFromWidth();
  }

  autoSwitchDeviceOnResize() {
    const device = this.getDeviceFromWidth();
    const current = this.router.url.split('?')[0];
    const page = current.split('/')[2] || 'home';

    this.router.navigate([`${device}/${page}`], {
      queryParamsHandling: 'merge'
    });
  }

  navigateTo(route: string) {
    const device = this.getDevicePrefix();
    this.router.navigate([device + route], {
      queryParamsHandling: 'merge'
    });
  }

  isActive(route: string): boolean {
    const device = this.getDevicePrefix();
    return this.router.url.startsWith(device + route);
  }

  getIcon(name: string): string {
    const baseRoute = '/' + name;
    const active = this.isActive(baseRoute);

    return active
      ? `assets/icons/${name}-blue.svg`
      : `assets/icons/${name}.svg`;
  }
}