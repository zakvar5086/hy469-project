import { Component, HostListener, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  username = "Eleni";
  profileImage = 'assets/avatars/persona1.png';

  constructor(private router: Router) {}

  ngOnInit() {
    this.updateProfileImage();
  }

  @HostListener('window:resize')
  onResize() {
    this.updateProfileImage();
  }

  private updateProfileImage() {
    this.profileImage = window.innerWidth <= 600
      ? 'assets/avatars/persona2.svg'
      : 'assets/avatars/persona1.svg';
  }

  getDevicePrefix(): string {
    const url = this.router.url.split('?')[0];

    if(url.startsWith('/tablet')) return '/tablet';
    if(url.startsWith('/phone')) return '/phone';
    if(url.startsWith('/watch')) return '/watch';
    if(url.startsWith('/speaker')) return '/speaker';

    return '/tablet';
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