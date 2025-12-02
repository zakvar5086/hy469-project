import { Component} from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-pop-up',
    imports: [CommonModule],
    standalone: true,
    templateUrl: './pop-up.component.html',
    styleUrls: ['./pop-up.component.scss'],
})
export class PopUpComponent  {
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

    private startY: number = 0;
    private swipeThreshold = 60; 

    startSwipe(event: TouchEvent) {
    this.startY = event.touches[0].clientY;
    }

    moveSwipe(event: TouchEvent) {
        const currentY = event.touches[0].clientY;
        const diffY = this.startY - currentY;
        if (diffY > this.swipeThreshold) {
            this.navigateTo("postpone");
        }
    }
}
