import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit{
  username = "Eleni";
  profileImage = 'assets/avatars/persona1.png';

  ngOnInit() {
    this.updateProfileImage();
  }

  @HostListener('window:resize')
  onResize() { this.updateProfileImage(); }

  private updateProfileImage() {
    this.profileImage = window.innerWidth <= 600
      ? 'assets/avatars/persona2.svg'
      : 'assets/avatars/persona1.svg';
  }
}
