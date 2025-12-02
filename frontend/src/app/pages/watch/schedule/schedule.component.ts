import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PillContainerComponent } from 'src/app/global/shared/pill-container/pill-container.component';
import { PillCardComponent } from 'src/app/global/shared/pill-card/pill-card.component';


@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [RouterModule, CommonModule, PillContainerComponent, PillCardComponent],
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent {
    
    




    private getDevicePrefix(): string {
        return '/watch/';
    }

    
    navigateTo(route: string) {
    //console.log("Navigating to", route);  
    const device = this.getDevicePrefix();
    this.router.navigate([device + route], {
        queryParamsHandling: 'merge'
    });
    }


    constructor(private router: Router) {}

    selectedDate: Date = new Date;

    ngOnInit() {
        const state = history.state;

        if (state && state.selectedDate) {
            const d = new Date(state.selectedDate);
            this.selectedDate = d;

            // if (!isNaN(d.getTime())) {      // check if valid
            //     this.selectedDate = d;
            // }
        }
    }  
}
    




