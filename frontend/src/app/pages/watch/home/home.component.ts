import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

    constructor(
        private router: Router,
      ) {}

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
