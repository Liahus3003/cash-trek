import { Component } from '@angular/core';
import { NAVIGATION } from '../shared/constants';

@Component({
  selector: 'app-navigation-tab',
  templateUrl: './navigation-tab.component.html',
  styleUrls: ['./navigation-tab.component.less']
})
export class NavigationTabComponent {
  navigationLinks = NAVIGATION;
}
