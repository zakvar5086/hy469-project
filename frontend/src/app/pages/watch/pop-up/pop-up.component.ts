
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pop-up',
  imports: [],
  standalone: true,
  templateUrl: './pop-up.component.html',
  styleUrls: ['./pop-up.component.scss'],
})
export class PopUpComponent {

  constructor(private router: Router) {}
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
