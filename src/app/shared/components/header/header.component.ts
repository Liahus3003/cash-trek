
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { User } from '@shared/interfaces/user';

@Component({
  standalone: true,
  imports: [],
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  userInfo!: User;
  constructor() {
    const user = localStorage.getItem('user-info');
    if (user) {
      this.userInfo = JSON.parse(user);
    }
  }
}
