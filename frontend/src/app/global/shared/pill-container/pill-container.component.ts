import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PillCardComponent } from 'src/app/global/shared/pill-card/pill-card.component';

@Component({
  selector: 'app-pill-container',
  standalone: true,
  imports: [CommonModule, PillCardComponent],
  templateUrl: './pill-container.component.html',
  styleUrls: ['./pill-container.component.scss']
})
export class PillContainerComponent {

}
