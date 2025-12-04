import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PillContainerComponent } from 'src/app/global/shared/pill-container/pill-container.component';
import { ProfileRoutingService } from 'src/app/global/services/profile-routing.service';

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [CommonModule, PillContainerComponent],
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {
    
    selectedDate: Date = new Date();

    constructor(
        private profileRouting: ProfileRoutingService
    ) {}

    ngOnInit() {
        const state = history.state;

        if (state && state.selectedDate) {
            const d = new Date(state.selectedDate);
            if (!isNaN(d.getTime())) {
                this.selectedDate = d;
            }
        }
    }

    navigateTo(route: string) {
        this.profileRouting.navigateTo(route);
    }
}
