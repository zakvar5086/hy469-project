import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit{
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
