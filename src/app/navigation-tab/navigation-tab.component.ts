import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NAVIGATION } from '../shared/constants';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule],
  selector: 'app-navigation-tab',
  templateUrl: './navigation-tab.component.html',
  styleUrls: ['./navigation-tab.component.less']
})
export class NavigationTabComponent {
  navigationLinks = NAVIGATION;
}
