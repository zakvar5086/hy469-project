import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Pill } from 'src/app/global/services/data.services';
import { PillPopupService } from 'src/app/global/services/pill-popup.service';
import { ProfileStateService } from 'src/app/global/services/profile-state.service';

@Component({
  selector: 'app-pill-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pill-popup.component.html',
  styleUrls: ['./pill-popup.component.scss']
})
export class PillPopupComponent implements OnInit{
  @Input() pill!: Pill;

  isKid = false;
  
  ngOnInit(){
    const persona = this.profileState.getPersona();
    this.isKid = persona === 'persona3';
  }

  constructor(public popupService: PillPopupService, private profileState: ProfileStateService) {}

  onTake() {
    // TODO: Implement logic to mark pill as taken
    this.popupService.close();
  }

  onSkip() {
    // TODO: Implement logic to mark pill as skipped
    this.popupService.close();
  }

  onPostpone() {
    // TODO: Implement logic to postpone pill reminder
    this.popupService.close();
  }
}
