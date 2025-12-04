import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ProfileRoutingService } from 'src/app/global/services/profile-routing.service';
import { ProfileStateService } from 'src/app/global/services/profile-state.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

    constructor(
      public routing: ProfileRoutingService
    ) {}

  navigateTo(route: string) {
    this.routing.navigateTo(route);
  }
}
