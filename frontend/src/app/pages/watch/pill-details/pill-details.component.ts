import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

interface PillShortInstr{
    short: string;
}

interface Pill{
    id: number;
    name: string;
    image?: string;
    longIn: string;
    shortIn: PillShortInstr[];
}

@Component({
  selector: 'app-pill-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './pill-details.component.html',
  styleUrls: ['./pill-details.component.scss'],
})
export class PillDetailsComponent {

  constructor(private router: Router) {}


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


  showDetails: boolean = false;

  toggleDetails() {
      this.showDetails = !this.showDetails;
  }

  pill: Pill[] = [
    {
      id: 1,
      name: "Aspirin",
      image: "assets/icons/pill-img.jpg",

      longIn:
`Aspirin is commonly used to reduce fever and to provide relief from mild to moderate pain caused by conditions such as muscle aches, toothaches, the common cold, and headaches. It can also help decrease pain, swelling, and stiffness associated with inflammatory conditions like arthritis.
In addition to its pain-relieving and anti-inflammatory effects, aspirin belongs to a group of medications called salicylates and is classified as a nonsteroidal anti-inflammatory drug (NSAID). It works by blocking substances in the body that cause pain, fever, and inflammation.
Aspirin is also widely known for its ability to prevent blood clots in low doses, which is why it’s often recommended for certain individuals at risk of heart attack or stroke. However, its use for heart protection should only be done under medical guidance, as it may increase the risk of bleeding in some people.`,

      shortIn: [
        { short: "Take with food" },
        { short: "Do not exceed 4 doses in 24 hours" },
        { short: "Avoid if allergic to NSAIDs" }
      ]
    }
  ];
}
