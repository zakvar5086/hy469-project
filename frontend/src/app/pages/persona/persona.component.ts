import { Component } from '@angular/core';
import { ProfileRoutingService } from 'src/app/global/services/profile-routing.service';

@Component({
  selector: 'app-persona',
  standalone: true,
  templateUrl: './persona.component.html',
  styleUrls: ['./persona.component.scss']
})
export class PersonaComponent {

  constructor(private profileService: ProfileRoutingService) {}

  selectPersona(persona: string) {
    this.profileService.redirectByPersona(persona);
  }
}