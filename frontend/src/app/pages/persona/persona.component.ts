import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileRoutingService } from 'src/app/global/services/profile-routing.service';
import { DataService, User } from 'src/app/global/services/data.services';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-persona',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './persona.component.html',
  styleUrls: ['./persona.component.scss']
})
export class PersonaComponent implements OnInit {

  users$!: Observable<User[]>;

  constructor(
    private profileService: ProfileRoutingService,
    private dataService: DataService
  ) {}

  ngOnInit() {
    this.users$ = this.dataService.getAllUsers();
  }

  selectPersona(personaId: string) {
    this.profileService.redirectByPersona(personaId);
  }
}