import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-postpone',
  standalone: true,
  templateUrl: './postpone.component.html',
  styleUrls: ['./postpone.component.scss']
})
export class PostponeComponent {
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
