import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationHubComponent } from 'src/app/global/shared/notification-hub/notification-hub.component';
import { PillContainerComponent } from 'src/app/global/shared/pill-container/pill-container.component';
import { ProfileStateService } from 'src/app/global/services/profile-state.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NotificationHubComponent, PillContainerComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit{
    today = new Date();

    isKid = false;
    petSrc = 'assets/icons/idle-pet.gif';

    constructor(private profileState: ProfileStateService) {}

    ngOnInit() {
      const persona = this.profileState.getPersona();
      this.isKid = persona === 'persona3';
    }

    petClicked() {
      this.petSrc = 'assets/icons/clicked-pet.gif';
      setTimeout(() => {
        this.petSrc = 'assets/icons/idle-pet.gif';
      }, 1500);
    }

}
