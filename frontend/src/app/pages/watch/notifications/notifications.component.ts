import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';



interface NotificationCard {
    time: string;
    title: string;
    message: string;
    image?: string;
}

interface totalNotification {
    date: string;
    card: NotificationCard[];
}

@Component({
    selector: 'app-notifications',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './notifications.component.html',
    styleUrls: ['./notifications.component.scss']
})

export class NotificationsComponent {


constructor(
    
    private router: Router
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


     notifications: totalNotification[] = [
    {
      date: 'Today',
      card: [
        {
          time: '10:00 AM',
          title: 'New Perscription',
          message: 'Click to see it!.',
          //image: 'assets/avatars/persona1.svg'
        },
        {
          time: '8:00 AM',
          title: 'Vitamin D',
          message: 'Your pills are running low.',
        }
      ]
    },
    {
      date: 'Yesterday',
      card: [
        {
          time: '6:00 PM',
          title: 'Ibuprofen',
          message: 'Scheduled dose was taken.',
        }
      ]
    }
  ];
}
