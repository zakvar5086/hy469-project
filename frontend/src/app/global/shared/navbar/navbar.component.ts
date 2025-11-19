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

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  isActive(route: string): boolean {
    return this.router.url.startsWith(route);
  }

  getIcon(name: string): string {
    const route = '/' + name;
    const active = this.isActive(route);

    return active
      ? `assets/icons/${name}-white.svg`
      : `assets/icons/${name}.svg`;
  }
}