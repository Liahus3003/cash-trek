import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-slap-toggle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './slap-toggle.component.html',
  styleUrls: ['./slap-toggle.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SlapToggleComponent {
  @Output() toggleOption = new EventEmitter<string>();

  option = 'login';

  constructor() {}

  toggle(option: string): void {
    this.option = option;
    this.toggleOption.emit(this.option);
  }
}
