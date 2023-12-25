
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NAVIGATION } from '../../constants';

@Component({
  standalone: true,
  imports: [RouterModule],
  selector: 'app-navigation-tab',
  templateUrl: './navigation-tab.component.html',
  styleUrls: ['./navigation-tab.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavigationTabComponent {
  navigationLinks = NAVIGATION;
}
