import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

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
  imports: [CommonModule],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})

export class NotificationsComponent {

     notifications: totalNotification[] = [
    {
      date: 'Today',
      card: [
        {
          time: '10:00 AM',
          title: 'Aspirin Reminder',
          message: 'Time to take your 10am pill.',
          //image: 'assets/avatars/persona1.svg'
        },
        {
          time: '8:00 AM',
          title: 'Vitamin D',
          message: 'Your morning dose is due.',
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

  deleteNotification(notif: any, index: number) {
    notif.card.splice(index, 1);

    if (notif.card.length === 0) {
      this.notifications = this.notifications.filter(n => n !== notif);
    }
  }
}